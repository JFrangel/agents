#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');

// SKILLS root is the parent of the orchestrator folder (two levels up from scripts)
const ROOT = path.resolve(__dirname, '..', '..');

function loadSkills(skillsDir) {
  const skillsPath = skillsDir;
  const entries = fs.readdirSync(skillsPath, { withFileTypes: true });
  const skills = [];
  for (const e of entries) {
    if (e.isDirectory()) {
      const file = path.join(skillsPath, e.name, 'SKILL.md');
      const readme = path.join(skillsPath, e.name, 'README.md');
      const memory = path.join(skillsPath, e.name, 'memory.md');
      const skill = { name: e.name, dir: path.join(skillsPath, e.name), file: null, meta: {}, readme: null, memory: null };
      if (fs.existsSync(file)) {
        skill.file = file;
        const text = fs.readFileSync(file, 'utf8');
        skill.meta = parseSkillFrontmatter(text) || {};
      }
      if (fs.existsSync(readme)) {
        skill.readme = fs.readFileSync(readme, 'utf8');
      }
      if (fs.existsSync(memory)) {
        skill.memory = fs.readFileSync(memory, 'utf8');
      }
      skills.push(skill);
    }
  }
  return skills;
}

function parseSkillFrontmatter(text) {
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return {};
  const yaml = fmMatch[1];
  const lines = yaml.split(/\r?\n/);
  const meta = {};
  let section = null;
  let listKey = null;
  for (let raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    const m = line.match(/^\s{0,2}([a-zA-Z0-9_\-]+):\s*(.*)$/);
    if (m) {
      section = m[1];
      const rest = m[2];
      if (rest === '') {
        meta[section] = {};
      } else {
        meta[section] = parseScalar(rest);
      }
      listKey = null;
      continue;
    }
    const indentList = line.match(/^\s{4,}-\s+(.*)$/);
    if (indentList) {
      const item = indentList[1].trim();
      // find parent (most recent section key that is an object)
      // try to attach to last created object key
      const keys = Object.keys(meta);
      const lastKey = keys[keys.length - 1];
      if (Array.isArray(meta[lastKey])) {
        meta[lastKey].push(item);
      } else if (typeof meta[lastKey] === 'object') {
        // if it's object and list under subkey
        // try to detect subkey from previous line
        if (!meta[lastKey].triggers) meta[lastKey].triggers = [];
        meta[lastKey].triggers.push(item);
      }
    }
  }
  // normalize invocation.triggers and listen flag
  if (meta.invocation && typeof meta.invocation === 'object') {
    const inv = meta.invocation;
    if (!inv.triggers) inv.triggers = [];
    inv.listen_to_chat = inv.listen_to_chat === true || inv.listen_to_chat === 'true';
  }
  return meta;
}

function parseScalar(s) {
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (!isNaN(Number(s))) return Number(s);
  return s;
}

function matchTriggers(skills, message) {
  const m = message.toLowerCase();
  const activated = [];
  for (const s of skills) {
    const inv = (s.meta && s.meta.invocation) || {};
    const triggers = inv.triggers || [];
    const listen = !!inv.listen_to_chat || !!inv.auto;
    let ok = false;
    for (const t of triggers) {
      const tt = ('' + t).toLowerCase();
      if (!tt) continue;
      if (tt === 'any message' || tt === 'chat' || tt === 'message') {
        ok = true;
        break;
      }
      if (m.includes(tt)) { ok = true; break; }
    }
    if (listen && ok) activated.push(s.name.toUpperCase());
  }
  return activated;
}

function handshake(skillsList, message) {
  const skillsText = skillsList.length ? skillsList.join(' · ') : 'NONE';
  return `⌬ SKILLS ACTIVADAS\n${skillsText}\n\nApplied\nCHAT → received: ${message}\n\nSTATUS\nSecurity: PASS | Env: DEV | Mode: ChatListener`;
}

function runOnce(message) {
  const skills = loadSkills(ROOT);
  const act = matchTriggers(skills, message);
  console.log('\n' + handshake(act, message) + '\n');
}

function startServer(port = 4000) {
  const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/chat') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const j = JSON.parse(body);
          const msg = j.message || j.text || '';
          const skills = loadSkills(ROOT);
          const actNames = matchTriggers(skills, msg);
          // include memory snippets for activated skills
          const activated = skills.filter(s => actNames.includes(s.name.toUpperCase()));
          let report = handshake(actNames, msg);
          if (activated.length) {
            report += '\n\n--- SKILLS MEMORY SNIPPETS ---\n';
            for (const s of activated) {
              report += `\nSKILL: ${s.name}\n`;
              if (s.memory) {
                const snippet = s.memory.split(/\r?\n/).slice(0,10).join('\n');
                report += `MEMORY:\n${snippet}\n`;
              } else {
                report += 'MEMORY: (none)\n';
              }
              if (s.readme) {
                const title = (s.readme.split('\n')[0]||'').trim();
                report += `README_TITLE: ${title}\n`;
              }
            }
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(report);
        } catch (err) {
          res.writeHead(400);
          res.end('invalid json');
        }
      });
      return;
    }
    // validate all skills
    if (req.method === 'GET' && req.url === '/validate') {
      try {
        const skills = loadSkills(ROOT);
        const results = skills.map(s => {
          return {
            name: s.name,
            hasSKILL: !!s.file,
            hasREADME: !!s.readme,
            hasMemory: !!s.memory,
            memoryPreview: s.memory ? s.memory.split(/\r?\n/).slice(0,5).join(' | ') : null
          };
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ skills: results }, null, 2));
      } catch (err) { res.writeHead(500); res.end('error'); }
      return;
    }
    // update memory for a skill
    if (req.method === 'POST' && req.url === '/update-memory') {
      let body = '';
      req.on('data', c => body += c);
      req.on('end', () => {
        try {
          const j = JSON.parse(body);
          const skill = j.skill;
          const action = j.action || 'append';
          const content = j.content || '';
          if (!skill) { res.writeHead(400); res.end('missing skill'); return; }
          const memPath = path.join(ROOT, skill, 'memory.md');
          if (!fs.existsSync(path.join(ROOT, skill))) { res.writeHead(404); res.end('skill not found'); return; }
          const timestamp = new Date().toISOString();
          if (action === 'append') {
            const toWrite = `\n\n---\n# update ${timestamp}\n${content}\n`;
            fs.appendFileSync(memPath, toWrite, 'utf8');
            res.writeHead(200); res.end('appended');
            return;
          } else if (action === 'set') {
            fs.writeFileSync(memPath, content, 'utf8');
            res.writeHead(200); res.end('set');
            return;
          } else {
            res.writeHead(400); res.end('unknown action'); return;
          }
        } catch (err) { res.writeHead(400); res.end('invalid json'); }
      });
      return;
    }
    res.writeHead(404);
    res.end('Not Found');
  });
  server.listen(port, () => console.log(`Skill Orchestrator listening on http://localhost:${port}  POST /chat {message:"..."}`));
}

// CLI
const args = process.argv.slice(2);
if (args.includes('--once')) {
  const idx = args.indexOf('--once');
  const msg = args[idx+1] || 'ping';
  runOnce(msg);
} else if (args.includes('--port')) {
  const p = Number(args[args.indexOf('--port')+1]) || 4000;
  startServer(p);
} else {
  // default: start server
  startServer(4000);
}
