"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import * as Icons from "lucide-react";

const navLinks = [
  { label: "Simulator", href: "/" },
  { label: "Ecosystem", href: "/ecosystem" },
  { label: "Frameworks", href: "/frameworks" },
  { label: "Documentation", href: "/docs" },
  { label: "Design System", href: "/design-system" },
];

const resources = [
  { label: "SOUL Protocol v2.0", href: "https://github.com/JFrangel/agents" },
  { label: "Neural Handshake Docs", href: "https://github.com/JFrangel/agents" },
  { label: "Workflow Registry", href: "https://github.com/JFrangel/agents" },
  { label: "SKILL.md Spec", href: "https://github.com/JFrangel/agents" },
];

const legal = [
  { label: "MIT License", href: "https://github.com/JFrangel/agents/blob/main/LICENSE" },
  { label: "Código Fuente", href: "https://github.com/JFrangel/agents" },
  { label: "README", href: "https://github.com/JFrangel/agents#readme" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800/60 bg-slate-950 relative overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-64 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-cyan-500/25"
              >
                NF
              </motion.div>
              <div>
                <p className="font-black text-white text-sm tracking-tight">NeuralForge</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">AI Studio 2026</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              Plataforma multi-agente construida sobre el protocolo SOUL v2.0. 21 agentes especializados, orquestación enterprise.
            </p>
            <div className="flex items-center gap-3">
              <motion.a whileHover={{ scale: 1.15, y: -2 }} href="https://github.com/JFrangel/agents" target="_blank" rel="noopener noreferrer"
                className="p-2 glass-panel rounded-lg border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors">
                <Icons.Github className="w-4 h-4" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.15, y: -2 }} href="#"
                className="p-2 glass-panel rounded-lg border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors">
                <Icons.Twitter className="w-4 h-4" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.15, y: -2 }} href="#"
                className="p-2 glass-panel rounded-lg border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-colors">
                <Icons.BookOpen className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">Plataforma</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                    <Icons.ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">Recursos</h4>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                    <Icons.ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-cyan-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status + legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-5">Estado</h4>
            {/* Status widget */}
            <div className="glass-panel rounded-xl p-4 border border-slate-800 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-bold text-emerald-400">All Systems Operational</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Neural Mesh", ok: true },
                  { label: "SOUL Protocol", ok: true },
                  { label: "Handshake v2.0", ok: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{s.label}</span>
                    <span className={s.ok ? "text-emerald-400 font-mono" : "text-red-400 font-mono"}>
                      {s.ok ? "✓ OK" : "✗ FAIL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 group">
                    <Icons.ChevronRight className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600">
            <span>NeuralForge Protocol v4.4.1</span>
            <span className="text-slate-800">·</span>
            <span>ORCHESTRATOR_CORE</span>
            <span className="text-slate-800">·</span>
            <span>EST. 2026</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">
            Designed for the 2026 Agentic Era
          </p>
        </div>
      </div>
    </footer>
  );
}
