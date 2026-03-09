"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { neuralSkills } from "../../data/skills";
import * as Icons from "lucide-react";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType;
  return Icon ? <Icon className={className} /> : <Icons.Terminal className={className} />;
};

const categories = [...new Set(neuralSkills.map(s => s.category))];
const roleColors: Record<string, string> = {
  Orquestador: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  Supervisor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Integrator: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  Worker: "text-slate-400 bg-slate-500/10 border-slate-600/30",
};

export default function DocsLanding() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <Reveal>
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 glass-panel">
            <Icons.BookOpen className="w-3.5 h-3.5" /> API Reference v2.0
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Selecciona un agente para leer su Manifiesto, Casos de Uso (Triggers) y cómo invocarlo en tu orquestación diaria.
          </p>
        </header>
      </Reveal>

      {/* Stats bar */}
      <Reveal delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Skills", value: neuralSkills.length, icon: Icons.Bot, color: "text-cyan-400" },
            { label: "Categorías", value: categories.length, icon: Icons.FolderOpen, color: "text-purple-400" },
            { label: "SOUL v", value: "2.0", icon: Icons.Shield, color: "text-emerald-400" },
            { label: "Handshakes activos", value: "∞", icon: Icons.Workflow, color: "text-amber-400" },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-4 border border-slate-800 text-center hover:border-slate-700 transition-all">
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* Skills by category */}
      {categories.map((cat, ci) => {
        const catSkills = neuralSkills.filter(s => s.category === cat);
        return (
          <section key={cat} className="mb-16">
            <Reveal delay={0}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-lg font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Icons.FolderOpen className="w-5 h-5" /> {cat}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-700/80 to-transparent" />
                <span className="text-xs text-slate-600 font-mono">{catSkills.length} skills</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catSkills.map((skill, i) => (
                  <Reveal key={skill.id} delay={i * 0.06}>
                    <Link href={`/docs/${skill.id}`}>
                      <motion.div whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
                        className="glass-panel p-5 rounded-2xl h-full border border-slate-800 hover:border-cyan-500/50 transition-all group cursor-pointer relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:bg-slate-800 transition-colors">
                              <IconComponent name={skill.iconName} className="w-6 h-6 text-cyan-400" />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${roleColors[skill.role] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                              {skill.role}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-slate-200 group-hover:text-cyan-400 transition-colors font-mono mb-1">
                            {skill.name}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{skill.description}</p>
                          <div className="mt-4 text-xs font-semibold text-cyan-500 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Leer Manifiesto <Icons.ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </section>
        );
      })}

      {/* Footer CTA */}
      <Reveal delay={0}>
        <div className="mt-8 p-8 rounded-3xl glass-panel border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />
          <Icons.Github className="w-10 h-10 text-slate-500 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-2">Explora el código fuente</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            Todos los SKILL.md, reglas SOUL y scripts de inyección están disponibles en el repositorio.
          </p>
          <a href="https://github.com/JFrangel/agents" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-cyan-400 transition-colors shadow-lg">
            <Icons.Github className="w-5 h-5" /> Ver en GitHub
          </a>
        </div>
      </Reveal>
    </main>
  );
}
