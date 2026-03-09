"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { neuralSkills } from "../../../data/skills";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className} /> : <Icons.Terminal className={className} />;
};

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  Orquestador: { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  Supervisor: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  Integrator: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  Worker: { bg: "bg-slate-500/15", text: "text-slate-400", border: "border-slate-600/40" },
};

const triggers: Record<string, string[]> = {
  Orchestration: [
    "Cuando el usuario pida una tarea compuesta que involucre múltiples agentes.",
    "Al iniciar un pipeline nuevo con más de 3 steps.",
    "Para hacer handoff entre skills de distintos tiers.",
  ],
  Architecture: [
    "Cuando se necesite diseñar la estructura de un nuevo sistema multi-tenant.",
    "Al auditar una arquitectura existente en busca de antipatrones.",
    "Para definir el schema de GraphQL o REST antes de implementar.",
  ],
  Design: [
    "Al solicitar una UI premium con glassmorphism o efectos bioluminiscentes.",
    "Para generar design tokens CSS (@theme) de un nuevo proyecto.",
    "Cuando se requiera consistencia visual entre múltiples componentes.",
  ],
  Security: [
    "Al implementar Row Level Security en Supabase/PostgreSQL.",
    "Para auditar permisos de API antes de production deploy.",
    "Al necesitar OWASP compliance review.",
  ],
  Database: [
    "Al diseñar un schema multi-tenant con aislamiento de datos.",
    "Para generar migrations automatizadas desde TypeScript types.",
    "Al necesitar optimización de consultas con índices avanzados.",
  ],
  Backend: [
    "Al construir endpoints REST o Server Actions en Next.js 15.",
    "Para integrar webhooks externos con validación de firma.",
    "Cuando se necesite middleware Edge con auth multi-tenant.",
  ],
  AI: [
    "Al necesitar validación semántica de outputs de otros agentes.",
    "Para generar embeddings y hacer RAG sobre documentos.",
    "Al integrar Gemini Pro o GPT-4 en un flujo de trabajo.",
  ],
  Testing: [
    "Para generar specs E2E Cypress basados en user stories.",
    "Al necesitar coverage de integración del pipeline completo.",
    "Para validar contracts de API entre microservicios.",
  ],
  Business: [
    "Al analizar datos de usuarios para segmentación RFM.",
    "Para generar dashboards ejecutivos con KPIs personalizados.",
    "Al necesitar automatizar reportes de conversion rate.",
  ],
  Data: [
    "Para procesar y vectorizar documentos con chunk scoring.",
    "Al construir un motor de búsqueda semántica.",
    "Para pipelines de ETL con validación automática.",
  ],
  Documentation: [
    "Al generar ADRs (Architecture Decision Records) automáticamente.",
    "Para crear README.md completo desde el código fuente.",
    "Al necesitar documentación de API en formato OpenAPI.",
  ],
};

function SkillDocPageClient({ skillId }: { skillId: string }) {
  const skill = neuralSkills.find(s => s.id === skillId);
  if (!skill) notFound();

  const roleStyle = roleColors[skill.role] || roleColors.Worker;
  const skillTriggers = triggers[skill.category] || [
    `Cuando el usuario solicite explícitamente "${skill.name.replace('/', '')}".`,
    `Cuando la tarea requiera perfil de ${skill.role} en ${skill.category}.`,
    "Para delegar subtareas especializadas dentro del Neural Mesh.",
  ];

  const relatedSkills = neuralSkills.filter(s => s.id !== skill.id && s.category === skill.category).slice(0, 3);

  return (
    <main className="min-h-screen py-12 px-6 max-w-4xl mx-auto">
      {/* Back */}
      <Reveal>
        <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 mb-12 transition-colors group">
          <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Regresar al Catálogo
        </Link>
      </Reveal>

      {/* Hero card */}
      <Reveal delay={0.05}>
        <article className="glass-panel rounded-[2rem] p-8 md:p-12 relative overflow-hidden border border-slate-800 mb-8">
          {/* BG glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/6 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          {/* Header */}
          <header className="mb-10 relative z-10">
            <div className="flex items-start gap-6 flex-wrap">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-2xl bg-linear-to-br from-cyan-900 to-slate-900 border border-cyan-500/30 flex flex-shrink-0 items-center justify-center shadow-2xl shadow-cyan-500/20"
              >
                <IconComponent name={skill.iconName} className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                    {skill.role}
                  </span>
                  <span className="text-sm font-mono text-slate-500">{skill.category}</span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <motion.span animate={{ opacity: [1,0.3,1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                    SOUL v2.0 compliant
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white font-mono">{skill.name}</h1>
              </div>
            </div>
          </header>

          <div className="relative z-10 space-y-8">
            {/* Overview */}
            <Reveal delay={0.1}>
              <section>
                <h2 className="text-xl font-bold mb-3 text-slate-200 flex items-center gap-2">
                  <Icons.Info className="w-5 h-5 text-cyan-400" /> Visión General
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">{skill.description}</p>
              </section>
            </Reveal>

            {/* Workflow card */}
            <Reveal delay={0.15}>
              <section className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Icons.Workflow className="w-4 h-4 text-cyan-400" /> Neural Workflow
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {["INPUT", "Reality Check", "Execute", "Auto-Critique", "TOKEN →"].map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                          i === 0 ? "bg-blue-500/15 border-blue-500/40 text-blue-400" :
                          i === 4 ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400" :
                          "bg-slate-800 border-slate-700 text-slate-300"
                        }`}
                      >{step}</motion.div>
                      {i < 4 && <Icons.ChevronRight className="w-3 h-3 text-slate-600" />}
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Triggers */}
            <Reveal delay={0.2}>
              <section>
                <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Icons.Zap className="w-4 h-4 text-amber-400" /> Casos de Uso (Triggers)
                </h3>
                <div className="space-y-3">
                  {skillTriggers.map((trigger, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.07 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all group"
                    >
                      <span className="text-cyan-400 font-bold font-mono text-sm mt-0.5 shrink-0">{String(i+1).padStart(2,'0')}.</span>
                      <p className="text-slate-300 text-sm">{trigger}</p>
                      <Icons.ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5 ml-auto" />
                    </motion.div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Ecosystem integration */}
            <Reveal delay={0.25}>
              <section className="bg-linear-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-cyan-500/15">
                <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Icons.Network className="w-4 h-4 text-purple-400" /> Integración con el Ecosystem
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm mb-4">
                  Esta skill opera dentro del <span className="text-cyan-400 font-semibold">Neural Mesh Protocol v2.0</span>. Si la solicitud excede su dominio (<code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs">{skill.category}</code>), puede hacer handoff automático al <code className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded text-xs">/orchestrator</code> para re-rutear a un agente especialista.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-500">Delegación:</span>
                  <span className="text-cyan-400">{skill.name}</span>
                  <Icons.ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-amber-400">/orchestrator</span>
                  <Icons.ArrowRight className="w-3 h-3 text-slate-600" />
                  <span className="text-slate-400">specialist</span>
                </div>
              </section>
            </Reveal>
          </div>
        </article>
      </Reveal>

      {/* Related skills */}
      {relatedSkills.length > 0 && (
        <Reveal delay={0.3}>
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Icons.Link className="w-4 h-4" /> Skills relacionadas en {skill.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedSkills.map((rel, i) => (
                <motion.div key={rel.id} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href={`/docs/${rel.id}`}
                    className="flex items-center gap-3 p-4 glass-panel rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all group">
                    <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
                      <IconComponent name={rel.iconName} className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-200 group-hover:text-cyan-400 transition-colors font-mono truncate">{rel.name}</p>
                      <p className="text-xs text-slate-500">{rel.role}</p>
                    </div>
                    <Icons.ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors ml-auto shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </main>
  );
}

export default function SkillDocPage({ params }: { params: Promise<{ skillId: string }> }) {
  const { skillId } = use(params);
  return <SkillDocPageClient skillId={skillId} />;
}
