#!/usr/bin/env node
/**
 * skill-orchestrator.js v2.1 — Build Gate Edition
 * 
 * Endpoints:
 *   POST /chat            → Activar skills según el mensaje
 *   GET  /validate        → Validar todas las skills
 *   POST /update-memory   → Actualizar memory.md de una skill
 *   POST /build-gate      → Registrar solicitud de build (requiere aprobación humana)
 *   POST /build-approve   → Aprobar un build pendiente
 *   POST /build-reject    → Rechazar un build pendiente
 *   GET  /build-status    → Listar builds pendientes
 */
const fs   = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..', '..');

// ─── Build Gate State (in-memory; podría persistirse en .agents/builds/) ──────
const pendingBuilds = new Map(); // buildId → { skillName, reason, files, timestamp, status }
let buildCounter = 1;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function loadSkills(skillsDir) {
  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skills = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const file   = path.join(skillsDir, e.name, 'SKILL.md');
    const readme = path.join(skillsDir, e.name, 'README.md');
    const memory = path.join(skillsDir, e.name, 'memory.md');
    const skill  = { name: e.name, dir: path.join(skillsDir, e.name), file: null, meta: {}, readme: null, memory: null };
    if (fs.existsSync(file)) {
      skill.file = file;
      skill.meta = parseSkillFrontmatter(fs.readFileSync(file, 'utf8')) || {};
    }
    if (fs.existsSync(readme)) skill.readme = fs.readFileSync(readme, 'utf8');
    if (fs.existsSync(memory)) skill.memory = fs.readFileSync(memory, 'utf8');
    skills.push(skill);
  }
  return skills;
}

function parseSkillFrontmatter(text) {
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return {};
  const yaml  = fmMatch[1];
  const lines = yaml.split(/\r?\n/);
  const meta  = {};
  for (const raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    const m    = line.match(/^\s{0,2}([a-zA-Z0-9_\-]+):\s*(.*)$/);
    if (m) {
      meta[m[1]] = parseScalar(m[2]) ;
    }
  }
  if (meta.invocation && typeof meta.invocation === 'object') {
    if (!meta.invocation.triggers) meta.invocation.triggers = [];
    meta.invocation.listen_to_chat =
      meta.invocation.listen_to_chat === true ||
      meta.invocation.listen_to_chat === 'true';
  }
  return meta;
}

function parseScalar(s) {
  if (s === 'true')  return true;
  if (s === 'false') return false;
  if (!isNaN(Number(s))) return Number(s);
  return s;
}

function matchTriggers(skills, message) {
  const m = message.toLowerCase();
  return skills
    .filter(s => {
      const inv = (s.meta && s.meta.invocation) || {};
      const triggers = inv.triggers || [];
      const listen   = !!inv.listen_to_chat || !!inv.auto;
      return listen && triggers.some(t => {
        const tt = ('' + t).toLowerCase();
        return tt === 'any message' || tt === 'chat' || tt === 'message' || m.includes(tt);
      });
    })
    .map(s => s.name.toUpperCase());
}

function handshake(skillsList, message) {
  const txt = skillsList.length ? skillsList.join(' · ') : 'NONE';
  return `⌬ SKILLS ACTIVADAS\n${txt}\n\nApplied\nCHAT → received: ${message}\n\nSTATUS\nSecurity: PASS | Env: DEV | Mode: ChatListener`;
}

// ─── Build Gate Helpers ───────────────────────────────────────────────────────
function createBuildRequest({ skillName, reason, files, changesDescription }) {
  const id  = `BUILD-${String(buildCounter++).padStart(4, '0')}`;
  const ts  = new Date().toISOString();
  const req = { id, skillName, reason, files: files || [], changesDescription, timestamp: ts, status: 'PENDING_APPROVAL' };
  pendingBuilds.set(id, req);

  // Persist to .agents/builds/ for recovery
  const buildsDir = path.join(ROOT, 'builds');
  fs.mkdirSync(buildsDir, { recursive: true });
  const buildEvent = path.join(buildsDir, `${id}.json`);
  fs.writeFileSync(buildEvent, JSON.stringify(req, null, 2), 'utf8');

  return req;
}

/**
 * formatBuildRequest — Genera el bloque de chat que el orquestador debe mostrar al humano.
 * El formato es intencionalmente llamativo para que el humano lo note.
 */
function formatBuildRequestForChat(req) {
  const fileList = req.files.length
    ? req.files.map(f => `  - \`${f}\``).join('\n')
    : '  - (archivos no especificados)';

  return `
═══════════════════════════════════════════
🔨 **BUILD GATE — APROBACIÓN REQUERIDA**
═══════════════════════════════════════════

**ID**: \`${req.id}\`
**Skill solicitante**: \`${req.skillName}\`
**Timestamp**: ${req.timestamp}

**Razón del build**:
${req.reason}

**Cambios que lo requieren**:
${req.changesDescription || '(sin descripción adicional)'}

**Archivos modificados**:
${fileList}

**¿Aprobas ejecutar el build?**
→ Responde con \`APROBAR ${req.id}\` o \`RECHAZAR ${req.id}\`
→ O vía API: POST /build-approve o POST /build-reject con { "buildId": "${req.id}" }

═══════════════════════════════════════════
`.trim();
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────
function startServer(port = 4000) {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { handleRequest(req, res, body); }
      catch (err) { res.writeHead(500); res.end(String(err)); }
    });
  });
  server.listen(port, () =>
    console.log(`Skill Orchestrator v2.1 (Build Gate) → http://localhost:${port}`)
  );
}

function handleRequest(req, res, body) {
  const { method, url } = req;

  // ── POST /chat ────────────────────────────────────────────
  if (method === 'POST' && url === '/chat') {
    const j        = JSON.parse(body);
    const msg      = j.message || j.text || '';
    const skills   = loadSkills(ROOT);
    const actNames = matchTriggers(skills, msg);
    const activated = skills.filter(s => actNames.includes(s.name.toUpperCase()));
    let report = handshake(actNames, msg);

    if (activated.length) {
      report += '\n\n--- SKILLS MEMORY SNIPPETS ---\n';
      for (const s of activated) {
        report += `\nSKILL: ${s.name}\n`;
        report += s.memory
          ? `MEMORY:\n${s.memory.split(/\r?\n/).slice(0, 10).join('\n')}\n`
          : 'MEMORY: (none)\n';
        if (s.readme) {
          report += `README_TITLE: ${(s.readme.split('\n')[0] || '').trim()}\n`;
        }
      }
    }

    // Check for pending builds to show in chat
    const pending = [...pendingBuilds.values()].filter(b => b.status === 'PENDING_APPROVAL');
    if (pending.length) {
      report += '\n\n--- ⚠️ BUILDS PENDIENTES DE APROBACIÓN ---\n';
      for (const b of pending) {
        report += '\n' + formatBuildRequestForChat(b) + '\n';
      }
    }

    json(res, { report, activatedSkills: actNames, pendingBuilds: pending.length });
    return;
  }

  // ── GET /validate ─────────────────────────────────────────
  if (method === 'GET' && url === '/validate') {
    const skills  = loadSkills(ROOT);
    const results = skills.map(s => ({
      name:          s.name,
      hasSKILL:      !!s.file,
      hasREADME:     !!s.readme,
      hasMemory:     !!s.memory,
      memoryPreview: s.memory ? s.memory.split(/\r?\n/).slice(0, 5).join(' | ') : null,
    }));
    json(res, { skills: results });
    return;
  }

  // ── POST /update-memory ───────────────────────────────────
  if (method === 'POST' && url === '/update-memory') {
    const j       = JSON.parse(body);
    const skill   = j.skill;
    const action  = j.action || 'append';
    const content = j.content || '';
    if (!skill) { res.writeHead(400); res.end('missing skill'); return; }
    const skillDir = path.join(ROOT, skill);
    if (!fs.existsSync(skillDir)) { res.writeHead(404); res.end('skill not found'); return; }
    const memPath  = path.join(skillDir, 'memory.md');
    const ts       = new Date().toISOString();
    if (action === 'append') {
      fs.appendFileSync(memPath, `\n\n---\n# update ${ts}\n${content}\n`, 'utf8');
    } else if (action === 'set') {
      fs.writeFileSync(memPath, content, 'utf8');
    } else {
      res.writeHead(400); res.end('unknown action'); return;
    }
    json(res, { ok: true, action, skill, timestamp: ts });
    return;
  }

  // ── POST /build-gate ─────────────────────────────────────
  // Skill calls this when it detects significant code changes requiring a build.
  if (method === 'POST' && url === '/build-gate') {
    const j   = JSON.parse(body);
    const req2 = createBuildRequest({
      skillName:          j.skillName || 'unknown-skill',
      reason:             j.reason    || 'Significant code change detected',
      files:              j.files     || [],
      changesDescription: j.changesDescription || '',
    });
    const chatBlock = formatBuildRequestForChat(req2);
    console.log('\n' + chatBlock + '\n');  // Print to console so IDE / chat sees it
    json(res, { buildId: req2.id, status: req2.status, chatBlock });
    return;
  }

  // ── POST /build-approve ───────────────────────────────────
  if (method === 'POST' && url === '/build-approve') {
    const j = JSON.parse(body);
    const b = pendingBuilds.get(j.buildId);
    if (!b) { res.writeHead(404); res.end('build not found'); return; }
    b.status      = 'APPROVED';
    b.approvedAt  = new Date().toISOString();
    b.approvedBy  = j.approvedBy || 'human';
    pendingBuilds.set(j.buildId, b);
    // Update persisted file
    const bp = path.join(ROOT, 'builds', `${j.buildId}.json`);
    if (fs.existsSync(bp)) fs.writeFileSync(bp, JSON.stringify(b, null, 2));
    console.log(`\n✅ BUILD APROBADO: ${j.buildId} — Ejecutar build ahora.\n`);
    json(res, { ok: true, buildId: j.buildId, status: 'APPROVED', message: `Build ${j.buildId} aprobado. Ejecutar proceso de build.` });
    return;
  }

  // ── POST /build-reject ────────────────────────────────────
  if (method === 'POST' && url === '/build-reject') {
    const j = JSON.parse(body);
    const b = pendingBuilds.get(j.buildId);
    if (!b) { res.writeHead(404); res.end('build not found'); return; }
    b.status     = 'REJECTED';
    b.rejectedAt = new Date().toISOString();
    b.rejectedBy = j.rejectedBy || 'human';
    b.reason     = j.reason || 'Rechazado por el usuario';
    pendingBuilds.set(j.buildId, b);
    const bp = path.join(ROOT, 'builds', `${j.buildId}.json`);
    if (fs.existsSync(bp)) fs.writeFileSync(bp, JSON.stringify(b, null, 2));
    console.log(`\n❌ BUILD RECHAZADO: ${j.buildId} — ${b.reason}\n`);
    json(res, { ok: true, buildId: j.buildId, status: 'REJECTED' });
    return;
  }

  // ── GET /build-status ─────────────────────────────────────
  if (method === 'GET' && url === '/build-status') {
    const all = [...pendingBuilds.values()];
    json(res, {
      pending:  all.filter(b => b.status === 'PENDING_APPROVAL'),
      approved: all.filter(b => b.status === 'APPROVED'),
      rejected: all.filter(b => b.status === 'REJECTED'),
      total:    all.length,
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found\nAvailable: POST /chat, GET /validate, POST /update-memory, POST /build-gate, POST /build-approve, POST /build-reject, GET /build-status');
}

function json(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.includes('--once')) {
  const idx = args.indexOf('--once');
  const msg = args[idx + 1] || 'ping';
  const skills   = loadSkills(ROOT);
  const actNames = matchTriggers(skills, msg);
  console.log('\n' + handshake(actNames, msg) + '\n');
} else if (args.includes('--port')) {
  const p = Number(args[args.indexOf('--port') + 1]) || 4000;
  startServer(p);
} else {
  startServer(4000);
}
