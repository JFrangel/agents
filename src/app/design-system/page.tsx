"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 bg-mesh-gradient opacity-40" />
      
      {/* Floating Animated Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-float" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-24">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
              <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tighter uppercase text-slate-400 group-hover:text-slate-200 transition-colors underline decoration-cyan-500/50">Volver a Skills</span>
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 bg-cyan-500/5 px-4 py-1 rounded-full border border-cyan-500/20">
            Internal Documentation
          </div>
        </nav>

        {/* Header */}
        <div className="mb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Design System <br />
            <span className="text-cyan-500">NeuralForge</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl">
            Bienvenido al Design System modular. Un estándar visual diseñado para crear interfaces AI Studio consistentes, accesibles y estéticamente superiores.
          </p>
        </div>

        {/* Content Sections */}
        <div className="grid gap-8">
          <section className="glass-panel border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl hover:border-white/20 transition-all group">
            <h2 className="text-2xl font-black mb-6 text-white group-hover:text-cyan-400 transition-colors">¿Qué incluye este estándar?</h2>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-1">1</div>
                <div>
                  <h3 className="font-bold text-slate-200">Design Tokens</h3>
                  <p className="text-sm text-slate-400 mb-2">Colores, radios y animaciones base en un core JSON referenciado por Tailwind V4.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-1">2</div>
                <div>
                  <h3 className="font-bold text-slate-200">Componentes Atómicos</h3>
                  <p className="text-sm text-slate-400 mb-2">Componentes puros como el Button con variantes premium (Glassmorphism).</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">3</div>
                <div>
                  <h3 className="font-bold text-slate-200">Validación de Skills QA</h3>
                  <p className="text-sm text-slate-400 mb-4">Integración con el subagente QA para probar la UI nativamente en Browser Automático.</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="glass-panel border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl hover:border-white/20 transition-all group">
            <h2 className="text-2xl font-black mb-6 text-white group-hover:text-cyan-400 transition-colors">Implementación (Ejemplo Interactivo)</h2>
            <div className="space-y-4 text-slate-400 font-medium leading-relaxed">
              <p>Botones nativos importados desde el Component Library local:</p>
            </div>
            <div className="flex gap-4 mt-10">
              <Button variant="gradient" className="rounded-xl px-10 py-6 font-black uppercase tracking-widest text-xs">Run Primary</Button>
              <Button variant="outline" className="rounded-xl px-10 py-6 font-black uppercase tracking-widest text-xs border-white/10 hover:bg-white/5 text-slate-300">Run Outline</Button>
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
