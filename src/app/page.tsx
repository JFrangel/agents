"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { neuralSkills, Skill } from '../data/skills';
import * as Icons from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className} /> : <Icons.Terminal className={className} />;
};

// --- Simulation output generator using SOUL-style handshake format ---
function getSimulationOutput(skills: Skill[]) {
  const names = skills.map(s => s.name);
  const hasOrch    = names.some(n => n.includes('orchestrator'));
  const hasDesign  = names.some(n => n.includes('design') || n.includes('creativity') || n.includes('web-anim'));
  const hasDB      = names.some(n => n.includes('supabase') || n.includes('api'));
  const hasAI      = names.some(n => n.includes('ai-validators') || n.includes('chunk'));
  const hasCRM     = names.some(n => n.includes('crm') || n.includes('payment'));
  const hasQA      = names.some(n => n.includes('qa'));
  const hasSec     = names.some(n => n.includes('security'));
  const hasI18n    = names.some(n => n.includes('language'));
  const hasDocs    = names.some(n => n.includes('tech-writer'));

  const lines: { text: string; color: string }[] = [];

  lines.push({ text: `[NEURAL-HANDSHAKE v2.0]`, color: 'text-cyan-300 font-bold' });
  lines.push({ text: `> Pipeline: ${names.join(' → ')}`, color: 'text-slate-400' });
  lines.push({ text: `> Nodos: ${skills.length} | Roles: ${[...new Set(skills.map(s => s.role))].join(', ')}`, color: 'text-slate-400' });
  lines.push({ text: '', color: '' });

  if (hasOrch) lines.push({ text: `[/orchestrator] → MESH_INIT: delegando task graph...`, color: 'text-cyan-300' });
  if (hasSec)  lines.push({ text: `[/security-guard] → AUDIT: verificando RLS policies... OK`, color: 'text-amber-400' });
  if (hasDocs) lines.push({ text: `[/tech-writer] → CONTEXT: generando ADR-001_architecture.md`, color: 'text-slate-300' });
  if (hasDesign) {
    lines.push({ text: `[/creativity] → IDEATE: ruptura creativa solicitada...`, color: 'text-purple-400' });
    lines.push({ text: `[/creativity] → DELEGATE → /design-system: "implementar glassmorphism V4"`, color: 'text-purple-300' });
    lines.push({ text: `[/design-system] → TOKEN_GEN: --color-primary-500, --blur-glass-120`, color: 'text-teal-400' });
  }
  if (hasDB) {
    lines.push({ text: `[/supabase-postgres] → SCHEMA: generando tablas multi-tenant...`, color: 'text-blue-400' });
    lines.push({ text: `[/api-integrator] → ENDPOINT: /api/agents/handoff (POST) created`, color: 'text-blue-300' });
  }
  if (hasAI)  lines.push({ text: `[/ai-validators] → GEMINI_CHECK: validando con modelo gemini-1.5-pro...`, color: 'text-amber-300' });
  if (hasCRM) lines.push({ text: `[/multi-tenant-crm] → RFM_SCORE: calculando scoring de usuarios...`, color: 'text-pink-400' });
  if (hasI18n) lines.push({ text: `[/multi-language] → I18N: generando 3 locales (es, en, pt)`, color: 'text-emerald-300' });
  if (hasQA)  lines.push({ text: `[/qa-tester] → E2E: ejecutando 12 specs (Cypress)... PASS`, color: 'text-teal-400' });

  lines.push({ text: '', color: '' });
  lines.push({ text: `✔ Artefactos generados:`, color: 'text-emerald-400' });
  if (hasDesign)  lines.push({ text: `  📁 src/design-tokens.css`, color: 'text-slate-300' });
  if (hasDB)      lines.push({ text: `  📁 supabase/migrations/001_init.sql`, color: 'text-slate-300' });
  if (hasOrch || hasAI) lines.push({ text: `  📁 agents/orchestrator_graph.ts`, color: 'text-slate-300' });
  if (hasCRM)     lines.push({ text: `  📁 app/(crm)/dashboard/page.tsx`, color: 'text-slate-300' });
  if (hasQA)      lines.push({ text: `  📁 tests/e2e/smoke.spec.ts`, color: 'text-slate-300' });
  if (hasDocs)    lines.push({ text: `  📄 docs/ADR-001_architecture.md`, color: 'text-slate-300' });
  lines.push({ text: `  📄 README.md  (auto-documentado)`, color: 'text-slate-300' });
  lines.push({ text: '', color: '' });
  lines.push({ text: `Done in ${(1.8 + skills.length * 0.4).toFixed(1)}s. [HANDSHAKE_OK]`, color: 'text-blue-400' });

  return lines;
}

// Portal wrapper — mounts children directly on document.body to escape any offset context
function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function NeuralShowcase() {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [simulationPhase, setSimulationPhase] = useState<number>(0);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const [fabVisible, setFabVisible] = useState(false);

  // Show the floating FAB only when user has scrolled PAST the hero (so it doesn't overlap the inline buttons)
  useEffect(() => {
    const onScroll = () => setFabVisible(window.scrollY > 380);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleSkill = (skill: Skill) => {
    if (simulationPhase !== 0) return;
    if (selectedSkills.find((s) => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter((s) => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const clearSelection = () => { setSelectedSkills([]); setSimulationPhase(0); };

  const scrollToPipeline = () => {
    pipelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const runSimulation = () => {
    setSimulationPhase(1);
    setTimeout(() => setSimulationPhase(2), selectedSkills.length * 700 + 1500);
  };

  const simOutput = selectedSkills.length > 1 ? getSimulationOutput(selectedSkills) : [];

  return (
    <main className="min-h-screen pb-48">
      {/* ===== Hero ===== */}
      <header className="pt-16 pb-12 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6 animate-pulse">
          <Icons.Sparkles className="w-4 h-4" />
          Powered by NeuralForge AI Ecosystem
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600">
          The 21-Skill Workforce
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Selecciona 2 o más skills para visualizar cómo la malla de agentes se orquesta y genera artefactos reales.
        </p>

        {/* Inline CTA — visible until user scrolls */}
        <AnimatePresence>
          {selectedSkills.length > 1 && simulationPhase === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <button
                onClick={scrollToPipeline}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <Icons.ArrowDown className="w-4 h-4" /> Ver Pipeline
              </button>
              <button
                onClick={runSimulation}
                className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.7)] transition-all flex items-center gap-2"
              >
                <Icons.Sparkles className="w-5 h-5" />
                Force Handoff · {selectedSkills.length} Nodos
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===== Skills Grid ===== */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-200">Catálogo de Skills</h2>
          <span className="text-sm font-medium text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            {neuralSkills.length} Disponibles · <span className="text-cyan-400">{selectedSkills.length} Seleccionadas</span>
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {neuralSkills.map((skill: Skill) => {
            const isSelected = selectedSkills.some((s) => s.id === skill.id);
            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={skill.id}
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "p-5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group border",
                  isSelected
                    ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "glass-panel bg-slate-900/40 border-slate-800/60 hover:border-slate-700"
                )}
              >
                <div className={cn("absolute inset-0 bg-linear-to-br from-cyan-500/10 to-purple-600/10 opacity-0 transition-opacity duration-300", isSelected ? "opacity-100" : "group-hover:opacity-100")} />
                <div className="relative z-10 flex flex-col h-full gap-3">
                  <div className="flex justify-between items-start">
                    <div className={cn("p-2 rounded-lg transition-colors", isSelected ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-400")}>
                      <IconComponent name={skill.iconName} className="w-5 h-5" />
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full border ${
                      skill.role === 'Orquestador' ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' :
                      skill.role === 'Supervisor'  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                      skill.role === 'Integrator'  ? 'bg-purple-500/15 border-purple-500/30 text-purple-400' :
                      'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {skill.role}
                    </span>
                  </div>
                  <div>
                    <h3 className={cn("font-semibold font-mono tracking-tight", isSelected ? "text-cyan-400" : "text-slate-200")}>
                      {skill.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
                  </div>
                  {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)]" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ===== Sticky Bottom Pipeline ===== */}
      <div ref={pipelineRef}>
        <AnimatePresence>
          {selectedSkills.length > 0 && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 pointer-events-none"
            >
              <div className="max-w-6xl mx-auto pointer-events-auto">
                <div className="bg-slate-900/97 border-t-4 border-t-cyan-500 border border-slate-700/60 rounded-2xl shadow-2xl p-4 backdrop-blur-md relative overflow-hidden">
                  {/* Ambient glow */}
                  <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  <div className="absolute bottom-0 left-1/2 w-64 h-24 bg-blue-600/8 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}>
                        <Icons.Workflow className="w-5 h-5 text-cyan-400" />
                      </motion.div>
                      <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">Neural Handoff Pipeline</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <p className="text-[11px] text-slate-400">
                            {selectedSkills.length} agente{selectedSkills.length > 1 ? 's' : ''} en cola
                            {selectedSkills.length > 1 ? ' · Listo para simular' : ' · Selecciona otro agente'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedSkills.length > 1 && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex items-center gap-1.5 disabled:opacity-50"
                          onClick={runSimulation}
                          disabled={simulationPhase !== 0}
                        >
                          <Icons.Play className="w-3.5 h-3.5 fill-current" /> Run Simulation
                        </motion.button>
                      )}
                      <button onClick={clearSelection} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Icons.X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Animated pipeline track */}
                  <div className="overflow-x-auto pb-1">
                    <div className="relative flex items-center min-w-max gap-0">
                      {/* Connecting animated line */}
                      {selectedSkills.length > 1 && (
                        <div className="absolute top-[18px] left-10 right-10 h-0.5 bg-slate-800 z-0">
                          <motion.div
                            initial={{ width: '0%', x: '-100%' }}
                            animate={{ width: '60%', x: '200%' }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                          />
                        </div>
                      )}

                      {selectedSkills.map((skill, index) => (
                        <React.Fragment key={skill.id}>
                          {index > 0 && <div className="w-12 shrink-0" />}
                          <div className="flex flex-col items-center gap-2 group relative z-10">
                            {/* Outer pulse ring */}
                            <div className="relative">
                              <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ repeat: Infinity, duration: 2, delay: index * 0.4 }}
                                className="absolute inset-0 rounded-xl bg-cyan-400/20 border border-cyan-400/30"
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                                className="w-9 h-9 rounded-xl bg-slate-800 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-shadow relative"
                              >
                                <IconComponent name={skill.iconName} className="w-4 h-4 text-cyan-400" />
                                {/* Active dot */}
                                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: index * 0.2 }}
                                  className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full border border-slate-900 shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
                              </motion.div>
                            </div>
                            <p className="text-[9px] font-mono text-slate-400 truncate w-14 text-center">{skill.name.replace('/', '')}</p>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== FAB flotante — aparece sólo cuando el usuario ha scrolleado PAST el hero ===== */}
      <BodyPortal>
        <AnimatePresence>
          {selectedSkills.length > 1 && simulationPhase === 0 && fabVisible && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ position: 'fixed', bottom: '7rem', right: '1.5rem', zIndex: 300 }}
            >
              <button
                onClick={runSimulation}
                className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-black uppercase tracking-wide rounded-2xl shadow-[0_8px_32px_rgba(6,182,212,0.55)] hover:shadow-[0_12px_40px_rgba(6,182,212,0.75)] transition-all hover:-translate-y-1"
              >
                <Icons.Sparkles className="w-5 h-5 animate-pulse" />
                <span className="hidden sm:inline">Handoff</span>
                <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-md font-mono">{selectedSkills.length}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </BodyPortal>

      {/* ===== SIMULATION MODAL (via Portal → always viewport-centered) ===== */}
      <BodyPortal>
        <AnimatePresence>
          {simulationPhase > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
              className="bg-slate-950/92 backdrop-blur-xl"
            >
              <motion.div
                initial={{ scale: 0.92, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 24 }}
                transition={{ type: "spring", damping: 26, stiffness: 260 }}
                style={{ width: '100%', maxWidth: '48rem', maxHeight: '88vh', overflowY: 'auto' }}
                className="glass-panel border border-cyan-500/40 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.2)] bg-slate-900/90"
              >
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/98 backdrop-blur p-5 pb-4 border-b border-slate-800 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-xl">
                      <Icons.Terminal className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white">Neural Synthesis Simulation</h2>
                      <p className="text-xs text-slate-400">{selectedSkills.length} agentes · SOUL v2.0 Handshake Protocol</p>
                    </div>
                  </div>
                  {simulationPhase === 2 && (
                    <button onClick={() => setSimulationPhase(0)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                      <Icons.X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Agent cards */}
                <div className="p-5 space-y-3">
                  {selectedSkills.map((skill, idx) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.25 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800"
                    >
                      <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0">
                        <IconComponent name={skill.iconName} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">{skill.role}</span>
                          <span className="font-bold text-white font-mono text-sm">{skill.name}</span>
                        </div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.25 + 0.3 }}
                          className="text-xs text-slate-400 font-mono"
                        >
                          {idx === 0 ? '→ TASK_START: recibiendo graph state del orquestador...' :
                            idx < selectedSkills.length - 1
                              ? `→ TOKEN_PASS: procesando output de módulo ${idx}, preparando handoff...`
                              : '→ SEAL: finalizando pipeline. Generando artefactos y ADR...'}
                        </motion.p>
                      </div>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: idx * 0.25 + 0.5 }}
                        className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    </motion.div>
                  ))}

                  {/* CLI Terminal Output */}
                  {simulationPhase === 2 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="rounded-xl overflow-hidden border border-slate-800">
                      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                        <span className="ml-3 text-xs font-mono text-slate-500">neural-forge / handshake-log</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-[10px] text-emerald-400 font-mono">HANDSHAKE_OK</span>
                        </div>
                      </div>
                      <div className="bg-slate-950 p-5 font-mono text-xs space-y-1 overflow-x-auto max-h-64 overflow-y-auto">
                        {simOutput.map((line, i) => (
                          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                            className={line.color || 'text-slate-300'}>
                            {line.text || '\u00A0'}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ===== Success ===== */}
                  {simulationPhase === 2 && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                      className="rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950">

                      {/* Green header */}
                      <div className="bg-gradient-to-r from-emerald-900/50 to-cyan-900/30 px-6 py-6 text-center border-b border-emerald-500/20">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 280, delay: 0.4 }}
                          className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(52,211,153,0.25)]">
                          <Icons.CheckCircle2 className="w-7 h-7 text-emerald-400" />
                        </motion.div>
                        <h3 className="text-xl font-black text-white mb-1">Pipeline Completado ✓</h3>
                        <p className="text-sm text-slate-300">
                          <span className="text-emerald-400 font-bold">{selectedSkills.length} agentes</span> ejecutaron el protocolo{" "}
                          <span className="font-mono text-cyan-400">SOUL v2.0</span> exitosamente.
                        </p>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 divide-x divide-slate-800 border-b border-slate-800">
                        {[
                          { label: "Agentes", value: selectedSkills.length, color: "text-white" },
                          { label: "Protocolo", value: "SOUL ✓", color: "text-emerald-400" },
                          { label: "Tiempo", value: `${(1.8 + selectedSkills.length * 0.4).toFixed(1)}s`, color: "text-cyan-400" },
                        ].map((s, i) => (
                          <div key={i} className="py-4 text-center">
                            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Pipeline recap */}
                      <div className="px-5 py-4 border-b border-slate-800">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-bold">Execution Graph</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {selectedSkills.map((s, i) => (
                            <div key={s.id} className="flex items-center gap-1.5">
                              {i > 0 && <Icons.ArrowRight className="w-3 h-3 text-slate-700" />}
                              <span className="text-[10px] px-2 py-1 bg-slate-900 border border-slate-800 rounded font-mono text-cyan-400">{s.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-5 py-5 flex gap-3 justify-center flex-wrap bg-slate-900/50">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          onClick={() => setSimulationPhase(0)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-xl border border-slate-700 transition-colors">
                          <Icons.RotateCcw className="w-4 h-4" /> Volver al Simulador
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                          <Link href="/ecosystem" onClick={() => setSimulationPhase(0)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
                            <Icons.Network className="w-4 h-4" /> Ver Ecosistema
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </BodyPortal>
    </main>
  );
}
