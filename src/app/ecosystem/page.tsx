"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { neuralSkills, Skill } from "../../data/skills";
import * as Icons from "lucide-react";
import Link from "next/link";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ────────── Mouse-Reactive Neural Mesh ────────── */
function NeuralMeshHero() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = [
    { x: 15, y: 50, r: 4.5, color: "#06b6d4", label: "Orch." },
    { x: 35, y: 20, r: 3,   color: "#22d3ee", label: "Design" },
    { x: 35, y: 80, r: 3,   color: "#8b5cf6", label: "Security" },
    { x: 55, y: 35, r: 3,   color: "#10b981", label: "Backend" },
    { x: 55, y: 65, r: 3,   color: "#f59e0b", label: "Data" },
    { x: 75, y: 50, r: 3.5, color: "#06b6d4", label: "Arch." },
    { x: 88, y: 25, r: 2.5, color: "#64748b", label: "Testing" },
    { x: 88, y: 75, r: 2.5, color: "#64748b", label: "Biz" },
  ];
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[5,6],[5,7],[1,4],[2,3]];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const getDisplaced = (node: typeof nodes[0]) => {
    const dx = node.x - mouse.x, dy = node.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(0, (20 - dist) / 20) * 6;
    return { x: node.x + (dist > 0 ? (dx / dist) * force : 0), y: node.y + (dist > 0 ? (dy / dist) * force : 0) };
  };

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => setMouse({ x: 50, y: 50 })}
      className="relative w-full h-72 overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/50 cursor-crosshair select-none">
      {/* Dynamic glow that follows cursor */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-200"
        style={{ background: `radial-gradient(circle 160px at ${mouse.x}% ${mouse.y}%, rgba(6,182,212,0.14), transparent 70%)` }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_50%,rgba(6,182,212,0.06)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(139,92,246,0.05)_0%,transparent_60%)]" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {edges.map(([a, b], i) => {
          const na = getDisplaced(nodes[a]), nb = getDisplaced(nodes[b]);
          const hl = hoveredNode === a || hoveredNode === b;
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke={hl ? "rgba(34,211,238,0.55)" : "rgba(34,211,238,0.18)"} strokeWidth={hl ? "0.55" : "0.3"}
            style={{ transition: 'all 0.12s ease' }} />;
        })}
        {/* Animated data tokens */}
        {edges.slice(0, 4).map(([a, b], i) => {
          const na = getDisplaced(nodes[a]), nb = getDisplaced(nodes[b]);
          return (
            <motion.circle key={`tok${i}`} r="0.75" fill="#22d3ee" opacity="0.75"
              animate={{ cx: [na.x, nb.x, na.x], cy: [na.y, nb.y, na.y], opacity: [0, 0.85, 0] }}
              transition={{ repeat: Infinity, duration: 3.2 + i * 1.2, delay: i * 0.8, ease: "easeInOut" }} />
          );
        })}
        {nodes.map((node, i) => {
          const d = getDisplaced(node);
          const hov = hoveredNode === i;
          return (
            <g key={i} onMouseEnter={() => setHoveredNode(i)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: 'pointer' }}>
              {/* Pulse ring */}
              <motion.circle cx={d.x} cy={d.y} r={node.r + 2}
                fill="none" stroke={node.color} strokeWidth="0.35" opacity={hov ? 0.6 : 0.2}
                animate={{ r: [node.r + 2, node.r + 3.5, node.r + 2], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.28 }} />
              {/* Node */}
              <motion.circle cx={d.x} cy={d.y} r={hov ? node.r + 1.5 : node.r}
                fill={node.color} fillOpacity={hov ? 0.4 : 0.15} stroke={node.color} strokeWidth="0.5"
                animate={{ r: [node.r, node.r + 0.6, node.r] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3, ease: "easeInOut" }}
                style={{ transition: 'all 0.15s ease' }} />
              {/* Label */}
              {(hov || i === 0) && (
                <text x={d.x} y={d.y + node.r + 5.5} textAnchor="middle" fontSize="3"
                  fill={node.color} fontFamily="monospace" opacity="0.9">{node.label}</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Overlay badges */}
      {[{ label: "T1 Orch.", x: "5%", color: "text-cyan-400"  },
        { label: "T2 Gov.", x: "42%", color: "text-purple-400" },
        { label: "T3 Work.", x: "80%", color: "text-slate-400" },
      ].map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          className={`absolute bottom-4 text-[10px] font-black uppercase tracking-widest ${t.color} pointer-events-none`}
          style={{ left: t.x }}>{t.label}</motion.div>
      ))}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">Hover para explorar</div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-700 pointer-events-none">21-Agent · SOUL v2.0</div>

      {/* Hovered tooltip */}
      <AnimatePresence>
        {hoveredNode !== null && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-14 left-4 glass-panel rounded-lg px-3 py-2 border border-slate-700 text-xs font-mono pointer-events-none">
            <span style={{ color: nodes[hoveredNode].color }} className="font-bold">{nodes[hoveredNode].label}</span>
            <span className="text-slate-500 ml-2">· tier agent</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────── generateSkillCode ────────── */
const examples: Record<string, string> = {
  'Orchestration': `## Ejemplo de Invocación\n\`\`\`yaml\norchestrator_call:\n  task: "Construir dashboard CRM"\n  delegates_to:\n    - agent: /design-system\n      context: "Glassmorphism V4"\n    - agent: /supabase-postgres\n      context: "RLS policies"\n\`\`\``,
  'Architecture': `## Output\n\`\`\`ts\nconst graph = new StateGraph();\ngraph.addNode("orchestrator", orch);\ngraph.addNode("design", design);\ngraph.addEdge("orchestrator", "design");\n\`\`\``,
  'Design': `## Token Output\n\`\`\`css\n@theme {\n  --color-primary: oklch(70% 0.25 220);\n  --blur-glass: 120px;\n  --shadow-neon: 0 0 30px oklch(70% 0.25 220 / 0.5);\n}\n\`\`\``,
  'Security': `## Audit Log\n\`\`\`sql\nCREATE POLICY "tenant_isolation" ON records\n  USING (org_id = auth.jwt()->>'org_id');\n-- Audit: 0 bypass vectors\n\`\`\``,
  'Database': `## Schema\n\`\`\`sql\nCREATE TABLE tenants (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  slug TEXT UNIQUE NOT NULL\n);\nCREATE TABLE profiles (tenant_id UUID REFERENCES tenants);\n\`\`\``,
  'Backend': `## Endpoint\n\`\`\`ts\nexport async function POST(req: Request) {\n  const { payload, next } = await req.json();\n  const result = await agentRouter.dispatch(next, payload);\n  return Response.json({ output: result });\n}\n\`\`\``,
  'AI': `## Gemini Call\n\`\`\`ts\nconst model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });\nconst r = await model.generateContent(agentOutput);\n// Confidence: 0.97\n\`\`\``,
  'Testing': `## Cypress Spec\n\`\`\`ts\ndescribe('Smoke', () => {\n  it('runs simulation', () => {\n    cy.visit('/');\n    cy.get('[data-testid="skill-card"]').first().click();\n    cy.contains('Run Simulation').click();\n    cy.contains('Pipeline Completado');\n  });\n});\n\`\`\``,
  'Business': `## CRM Output\n\`\`\`json\n{ "rfm_score": { "R": 5, "F": 4, "M": 5 }, "segment": "Champions", "churn_risk": 0.04 }\n\`\`\``,
};

function generateSkillCode(skill: Skill): string {
  const eg = examples[skill.category] || `## Integration\n\`\`\`ts\nconst out = await mesh.invoke("${skill.name}", { task: "main", context: state });\n\`\`\``;
  return `---\nname: ${skill.name}\nrole: ${skill.role}\ncategory: ${skill.category}\nversion: "2.0"\nsoul_compliance: true\n---\n\n# SKILL ACTIVADA: ${skill.name.replace('/','').toUpperCase()}\n\n> ${skill.description}\n\n## Workflow\n\`\`\`\nINPUT → Graph State\n  ├→ [1] Reality Check\n  ├→ [2] Ejecutar tarea\n  ├→ [3] Auto-crítica\n  └→ [4] TOKEN → siguiente agente\n\`\`\`\n\n${eg}\n\n## Constraints (SOUL)\n- NUNCA actuar sin token del orquestador.\n- Ecosystem Awareness: colaborar con la malla.\n- Creative Imperative: mejorar proactivamente.`;
}

/* ────────── SkillCard ────────── */
function SkillCard({ skill, IconComponent, compact = false, onClick }:
  { skill: Skill; IconComponent: React.ComponentType<{ name: string; className?: string }>; compact?: boolean; onClick: () => void }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className="glass-panel rounded-2xl p-5 border border-slate-800 group hover:border-cyan-500/60 transition-all cursor-pointer relative overflow-hidden h-full shadow-lg hover:shadow-[0_8px_30px_rgba(34,211,238,0.08)]">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 to-purple-500/6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 group-hover:bg-slate-800 transition-colors ${compact ? 'p-2 rounded-lg' : ''}`}>
          <IconComponent name={skill.iconName} className={compact ? 'w-5 h-5 text-cyan-400' : 'w-7 h-7 text-cyan-400'} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 group-hover:text-cyan-500 transition-colors">{skill.category}</div>
          <h3 className={`font-bold text-slate-200 truncate group-hover:text-white ${compact ? 'text-sm' : 'text-lg'}`}>{skill.name}</h3>
          {!compact && <p className="text-xs text-slate-400 leading-relaxed mt-1 group-hover:text-slate-300 line-clamp-2">{skill.description}</p>}
        </div>
        <Icons.Code className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors shrink-0" />
      </div>
    </motion.div>
  );
}

/* ────────── Page ────────── */
export default function EcosystemLanding() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const orchestrators = neuralSkills.filter(s => s.role === 'Orquestador');
  const supervisors   = neuralSkills.filter(s => s.role === 'Supervisor');
  const integrators   = neuralSkills.filter(s => s.role === 'Integrator');
  const workers       = neuralSkills.filter(s => s.role === 'Worker');

  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
    return Icon ? <Icon className={className} /> : <Icons.Terminal className={className} />;
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Hero */}
        <Reveal className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 glass-panel">
            <Icons.Network className="w-3.5 h-3.5" /> Agentic Mesh 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Agentic Mesh 2026.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Arquitectura Multi-Rol. Haz clic en cualquier skill para ver su código completo.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { label: "Agentes Totales", value: "21", icon: Icons.Bot, color: "text-cyan-400" },
              { label: "Roles Distintos",  value: "4",  icon: Icons.Layers, color: "text-purple-400" },
              { label: "Handshakes/min",   value: "∞",  icon: Icons.Zap, color: "text-emerald-400" },
            ].map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -4 }}
                className="glass-panel rounded-2xl p-4 border border-slate-800 text-center hover:border-cyan-500/30 transition-all">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Mouse-Reactive Neural Mesh */}
        <Reveal delay={0.15}>
          <div className="mb-16">
            <NeuralMeshHero />
          </div>
        </Reveal>

        {/* Skill Tiers */}
        <div className="space-y-16">
          {/* T1 */}
          <section>
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Icons.Crown className="w-5 h-5" /> Tier 1: Orchestration
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orchestrators.map((skill, i) => (
                <Reveal key={skill.id} delay={i * 0.08}>
                  <SkillCard skill={skill} IconComponent={IconComponent} onClick={() => setActiveSkill(skill)} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* T2 */}
          <section>
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                  <Icons.ShieldAlert className="w-5 h-5" /> Tier 2: Governance & Design
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...supervisors, ...integrators].map((skill, i) => (
                <Reveal key={skill.id} delay={i * 0.06}>
                  <SkillCard skill={skill} IconComponent={IconComponent} onClick={() => setActiveSkill(skill)} />
                </Reveal>
              ))}
            </div>
          </section>

          {/* T3 */}
          <section>
            <Reveal>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Icons.Layers className="w-5 h-5" /> Tier 3: Specialized Workers
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-500/50 to-transparent" />
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {workers.map((skill, i) => (
                <Reveal key={skill.id} delay={i * 0.04}>
                  <SkillCard skill={skill} IconComponent={IconComponent} compact onClick={() => setActiveSkill(skill)} />
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ BOTTOM SECTION ═══ */}
        <div className="mt-24 space-y-10">
          {/* Feature cards row */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Icons.Cpu,
                  title: "Neural Handoff Protocol",
                  desc: "Cada agente emite un TOKEN cuando finaliza. El orquestador lo intercepta y decide el siguiente nodo del grafo.",
                  color: "text-cyan-400",
                  borderHover: "hover:border-cyan-500/40",
                },
                {
                  icon: Icons.ShieldCheck,
                  title: "SOUL Compliance v2.0",
                  desc: "Todos los agentes están constrainados: nunca actúan sin token, auto-critican su output y colaboran con el mesh.",
                  color: "text-emerald-400",
                  borderHover: "hover:border-emerald-500/40",
                },
                {
                  icon: Icons.Workflow,
                  title: "Ecosystem Awareness",
                  desc: "Si un agente detecta que la tarea excede su dominio, paraliza y transfiere al orquestador automáticamente.",
                  color: "text-purple-400",
                  borderHover: "hover:border-purple-500/40",
                },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y: -6 }}
                  className={`glass-panel rounded-2xl p-6 border border-slate-800 ${item.borderHover} transition-all group`}>
                  <div className="p-3 bg-slate-900 rounded-xl inline-flex mb-4 group-hover:bg-slate-800 transition-colors">
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>

          {/* Metrics band */}
          <Reveal delay={0.1}>
            <div className="glass-panel rounded-3xl border border-slate-800 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                {[
                  { value: "21", label: "Agentes en el Mesh", suffix: "" },
                  { value: "4",  label: "Niveles de rol",     suffix: " tiers" },
                  { value: "2.0",label: "Versión SOUL",       suffix: "" },
                  { value: "<2", label: "Handoff ms",         suffix: "ms" },
                ].map((m, i) => (
                  <div key={i}>
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 280, delay: i * 0.08 }}
                      className="text-3xl md:text-4xl font-black text-white mb-1">
                      {m.value}<span className="text-cyan-400">{m.suffix}</span>
                    </motion.div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* GitHub CTA */}
          <Reveal delay={0.15}>
            <div className="rounded-3xl glass-panel border border-slate-800 text-center p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
              <Icons.Github className="w-12 h-12 text-slate-500 mx-auto mb-5" />
              <h3 className="text-3xl font-black text-white mb-3">Explora el código fuente</h3>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg">
                Todos los SKILL.md, reglas SOUL y scripts de inyección disponibles en GitHub.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <motion.a whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  href="https://github.com/JFrangel/agents" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg">
                  <Icons.Github className="w-5 h-5" /> Ver en GitHub
                </motion.a>
                <motion.div whileHover={{ scale: 1.04, y: -2 }}>
                  <Link href="/docs"
                    className="inline-flex items-center gap-2 px-8 py-3 glass-panel border border-slate-700 hover:border-cyan-500/50 text-white font-bold rounded-xl transition-all">
                    <Icons.BookOpen className="w-5 h-5" /> Leer Documentación
                  </Link>
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* SKILL CODE MODAL via Portal */}
      <BodyPortal>
        <AnimatePresence>
          {activeSkill && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
              className="bg-slate-950/92 backdrop-blur-xl"
              onClick={() => setActiveSkill(null)}>
              <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                style={{ width: '100%', maxWidth: '48rem', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
                className="glass-panel border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.2)] bg-slate-900/90"
                onClick={e => e.stopPropagation()}>
                {/* Modal header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-xl">
                      <Icons.Code className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white font-mono">{activeSkill.name}</h2>
                      <p className="text-xs text-slate-400">{activeSkill.role} · {activeSkill.category}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveSkill(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>
                {/* Terminal titlebar */}
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-3 text-xs font-mono text-slate-500">skills/{activeSkill.name.replace('/', '')}/SKILL.md</span>
                </div>
                {/* Content */}
                <div className="overflow-y-auto flex-1">
                  <pre className="font-mono text-xs text-slate-300 p-6 whitespace-pre-wrap leading-relaxed bg-slate-950">
                    <code>{generateSkillCode(activeSkill)}</code>
                  </pre>
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/80">
                  <p className="text-xs text-slate-500 font-mono truncate pr-4">{activeSkill.description}</p>
                  <button onClick={() => setActiveSkill(null)} className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700">Cerrar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </BodyPortal>
    </main>
  );
}
