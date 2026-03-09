"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { neuralSkills, Skill } from "../../data/skills";
import * as Icons from "lucide-react";

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

// Animated "Neural Mesh" SVG hero — zero images
function NeuralMeshHero() {
  const nodes = [
    { x: 15, y: 50, tier: 1 }, { x: 35, y: 20 }, { x: 35, y: 80 },
    { x: 55, y: 35 }, { x: 55, y: 65 }, { x: 75, y: 50 },
    { x: 88, y: 25 }, { x: 88, y: 75 },
  ];
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[5,6],[5,7],[1,4],[2,3]];

  return (
    <div className="relative w-full h-72 overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_50%,rgba(6,182,212,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {edges.map(([a, b], i) => (
          <motion.line key={i}
            x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="rgba(34,211,238,0.2)" strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: i * 0.08, duration: 1, ease: "easeOut" }}
          />
        ))}
        {nodes.map((node, i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 400 }}>
            <motion.circle cx={node.x} cy={node.y} r={i === 0 ? 4.5 : 3}
              fill={i === 0 ? "rgba(6,182,212,0.3)" : "rgba(34,211,238,0.1)"}
              stroke={i === 0 ? "#06b6d4" : "rgba(34,211,238,0.5)"} strokeWidth="0.5"
              animate={{ r: [i === 0 ? 4.5 : 3, i === 0 ? 5.5 : 3.8, i === 0 ? 4.5 : 3] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
            />
          </motion.g>
        ))}
      </svg>

      {/* Labels overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.p className="text-xs font-mono text-slate-500 tracking-widest uppercase"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          21-Agent Neural Mesh · Agentic Architecture 2026
        </motion.p>
      </div>

      {/* Tier badges */}
      {[
        { label: "T1 Orch.", x: "5%", color: "text-cyan-400" },
        { label: "T2 Gov.", x: "42%", color: "text-purple-400" },
        { label: "T3 Work.", x: "80%", color: "text-slate-400" },
      ].map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          className={`absolute bottom-4 text-[10px] font-black uppercase tracking-widest ${t.color}`}
          style={{ left: t.x }}>
          {t.label}
        </motion.div>
      ))}
    </div>
  );
}

export default function EcosystemLanding() {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const orchestrators = neuralSkills.filter(s => s.role === 'Orquestador');
  const supervisors = neuralSkills.filter(s => s.role === 'Supervisor');
  const integrators = neuralSkills.filter(s => s.role === 'Integrator');
  const workers = neuralSkills.filter(s => s.role === 'Worker');

  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
    return Icon ? <Icon className={className} /> : <Icons.Terminal className={className} />;
  };

  const examples: Record<string, string> = {
    'Orchestration': `## Ejemplo de Invocación\n\`\`\`yaml\norchestrator_call:\n  task: "Construir dashboard CRM"\n  delegates_to:\n    - agent: /design-system\n      context: "Glassmorphism V4"\n    - agent: /supabase-postgres\n      context: "RLS policies"\n\`\`\``,
    'Architecture': `## Output\n\`\`\`ts\n// orchestrator_graph.ts\nconst graph = new StateGraph();\ngraph.addNode("orchestrator", orch);\ngraph.addNode("design", design);\ngraph.addEdge("orchestrator", "design");\n\`\`\``,
    'Design': `## Token Output\n\`\`\`css\n@theme {\n  --color-primary: oklch(70% 0.25 220);\n  --blur-glass: 120px;\n  --shadow-neon: 0 0 30px oklch(70% 0.25 220 / 0.5);\n}\n\`\`\``,
    'Security': `## Audit Log\n\`\`\`sql\nCREATE POLICY "tenant_isolation" ON records\n  USING (org_id = auth.jwt()->>'org_id');\n-- Audit: 0 bypass vectors\n\`\`\``,
    'Database': `## Schema\n\`\`\`sql\nCREATE TABLE tenants (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  slug TEXT UNIQUE NOT NULL\n);\nCREATE TABLE profiles (\n  tenant_id UUID REFERENCES tenants\n);\n\`\`\``,
    'Backend': `## Endpoint\n\`\`\`ts\nexport async function POST(req: Request) {\n  const { payload, next } = await req.json();\n  const result = await agentRouter.dispatch(next, payload);\n  return Response.json({ output: result });\n}\n\`\`\``,
    'AI': `## Gemini Call\n\`\`\`ts\nconst model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });\nconst r = await model.generateContent(agentOutput);\n// Confidence: 0.97\n\`\`\``,
    'Testing': `## Cypress Spec\n\`\`\`ts\ndescribe('Smoke', () => {\n  it('runs simulation', () => {\n    cy.visit('/');\n    cy.get('[data-testid="skill-card"]').first().click();\n    cy.contains('Force Handoff').click();\n    cy.contains('Pipeline Completado');\n  });\n});\n\`\`\``,
    'Business': `## CRM Output\n\`\`\`json\n{\n  "rfm_score": { "R": 5, "F": 4, "M": 5 },\n  "segment": "Champions",\n  "churn_risk": 0.04\n}\n\`\`\``,
  };

  const generateSkillCode = (skill: Skill) => {
    const eg = examples[skill.category] || `## Integración\n\`\`\`ts\nconst out = await mesh.invoke("${skill.name}", { task: "main", context: state });\n\`\`\``;
    return `---\nname: ${skill.name}\nrole: ${skill.role}\ncategory: ${skill.category}\nversion: "2.0"\nsoul_compliance: true\n---\n\n# SKILL ACTIVADA: ${skill.name.replace('/', '').toUpperCase()}\n\n> ${skill.description}\n\n## Workflow\n\`\`\`\nINPUT → Graph State\n  ├→ [1] Reality Check\n  ├→ [2] Ejecutar tarea\n  ├→ [3] Auto-crítica\n  └→ [4] TOKEN → siguiente agente\n\`\`\`\n\n${eg}\n\n## Constraints (SOUL)\n- NUNCA actuar sin token del orquestador.\n- Ecosystem Awareness: colaborar con la malla.\n- Creative Imperative: mejorar proactivamente.`;
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

        {/* Stats row */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { label: "Agentes Totales", value: "21", icon: Icons.Bot, color: "text-cyan-400" },
              { label: "Roles Distintos", value: "4", icon: Icons.Layers, color: "text-purple-400" },
              { label: "Handshakes/min", value: "∞", icon: Icons.Zap, color: "text-emerald-400" },
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

        {/* Neural Mesh Animated Hero — no static image */}
        <Reveal delay={0.15}>
          <div className="mb-16">
            <NeuralMeshHero />
          </div>
        </Reveal>

        {/* Hierarchy */}
        <div className="space-y-16">
          {/* T1 */}
          <section>
            <Reveal delay={0}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Icons.Crown className="w-5 h-5" /> Tier 1: Orchestration
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orchestrators.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 0.08}>
                    <SkillCard skill={skill} IconComponent={IconComponent} onClick={() => setActiveSkill(skill)} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </section>

          {/* T2 */}
          <section>
            <Reveal delay={0}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
                  <Icons.ShieldAlert className="w-5 h-5" /> Tier 2: Governance & Design
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...supervisors, ...integrators].map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 0.06}>
                    <SkillCard skill={skill} IconComponent={IconComponent} onClick={() => setActiveSkill(skill)} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </section>

          {/* T3 */}
          <section>
            <Reveal delay={0}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Icons.Layers className="w-5 h-5" /> Tier 3: Specialized Workers
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-500/50 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {workers.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 0.04}>
                    <SkillCard skill={skill} IconComponent={IconComponent} compact onClick={() => setActiveSkill(skill)} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </section>
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
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-3 text-xs font-mono text-slate-500">skills/{activeSkill.name.replace('/', '')}/SKILL.md</span>
                </div>
                <div className="overflow-y-auto flex-1">
                  <pre className="font-mono text-xs text-slate-300 p-6 whitespace-pre-wrap leading-relaxed bg-slate-950">
                    <code>{generateSkillCode(activeSkill)}</code>
                  </pre>
                </div>
                <div className="p-4 border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/80">
                  <p className="text-xs text-slate-500 font-mono">{activeSkill.description}</p>
                  <button onClick={() => setActiveSkill(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700">Cerrar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </BodyPortal>
    </main>
  );
}

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
