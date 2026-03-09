"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";

interface Stack {
  id: string;
  name: string;
  icon: React.ElementType;
  status: string;
  color: string;
  accentColor: string;
  cmd: string[];
}

const stacks: Stack[] = [
  {
    id: "nextjs", name: "Next.js 15", icon: Icons.Triangle, status: "stable",
    color: "hover:border-slate-400", accentColor: "rgba(148,163,184,0.3)",
    cmd: [
      "$ npx neural-forge init --with next@15",
      "✔ Configurando App Router (RSC + Server Actions)...",
      "✔ Turbopack habilitado para dev local.",
      "✔ Middleware Edge configurado para multi-tenant.",
      "Done in 1.8s."
    ]
  },
  {
    id: "react", name: "React 19", icon: Icons.Atom, status: "stable",
    color: "hover:border-cyan-500", accentColor: "rgba(34,211,238,0.3)",
    cmd: [
      "$ npx neural-forge add react@19",
      "✔ Activando React Compiler (AOT optimizations)...",
      "✔ Server Components habilitados (sin hydration overhead).",
      "✔ use() hook configurado para Suspense avanzado.",
      "Done in 0.9s."
    ]
  },
  {
    id: "tailwind", name: "Tailwind CSS v4", icon: Icons.Wind, status: "stable",
    color: "hover:border-teal-500", accentColor: "rgba(20,184,166,0.3)",
    cmd: [
      "$ npx neural-forge add tailwind@4",
      "✔ CSS-first configuration activada (no tailwind.config.js).",
      "✔ Design tokens generados: --color-primary-*, --spacing-*.",
      "✔ @theme block inyectado en globals.css.",
      "Done in 0.7s."
    ]
  },
  {
    id: "postgres", name: "PostgreSQL 16", icon: Icons.Database, status: "stable",
    color: "hover:border-blue-500", accentColor: "rgba(59,130,246,0.3)",
    cmd: [
      "$ npx neural-forge add postgres --with rls",
      "✔ Tablas multi-tenant con Row Level Security...",
      "✔ Policies RLS generadas para auth.uid().",
      "✔ Schema versionado con pgmigrate.",
      "Done in 2.1s."
    ]
  },
  {
    id: "supabase", name: "Supabase", icon: Icons.Zap, status: "stable",
    color: "hover:border-emerald-500", accentColor: "rgba(16,185,129,0.3)",
    cmd: [
      "$ npx neural-forge add supabase --project myapp",
      "✔ Cliente Supabase SSR configurado.",
      "✔ Auth helpers (cookie-based session) activos.",
      "✔ Storage bucket 'uploads' creado y securizado.",
      "Done in 3.2s."
    ]
  },
  {
    id: "prisma", name: "Prisma ORM", icon: Icons.Layers, status: "stable",
    color: "hover:border-slate-400", accentColor: "rgba(148,163,184,0.3)",
    cmd: [
      "$ npx neural-forge add prisma --schema auto",
      "✔ Schema inferido desde tipos TypeScript existentes.",
      "✔ Generando cliente Prisma tipado...",
      "✔ Migrations iniciales aplicadas en dev DB.",
      "Done in 4.5s."
    ]
  },
];

function TypewriterTerminal({ lines }: { lines: string[] }) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [charIdx, setCharIdx] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed([]);
    setLineIdx(0);
    setCharIdx(0);
  }, [lines]);

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      frameRef.current = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          if (!next[lineIdx]) next[lineIdx] = '';
          next[lineIdx] = line.slice(0, charIdx + 1);
          return next;
        });
        setCharIdx(c => c + 1);
      }, charIdx === 0 ? 180 : 14);
    } else {
      frameRef.current = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0); }, 160);
    }
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [lineIdx, charIdx, lines]);

  return (
    <div className="p-6 bg-slate-950 font-mono text-sm min-h-[200px] space-y-1.5 overflow-x-auto">
      {displayed.map((line, i) => (
        <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className={line.startsWith("$") ? "text-slate-400" : line.startsWith("Done") ? "text-blue-400 mt-3" : line.startsWith("✔") ? "text-emerald-400" : "text-slate-300"}>
          {line}
          {i === lineIdx && lineIdx < lines.length && <span className="animate-pulse ml-0.5">▌</span>}
        </motion.p>
      ))}
      {lineIdx >= lines.length && displayed.length > 0 && (
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-slate-500">▌</motion.span>
      )}
    </div>
  );
}

// Mouse-reactive Architecture Matrix
function ArchitectureMatrix() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const nodeData = [
    { id: 0, x: 50, y: 22, label: "Next.js 15", color: "#94a3b8", glow: "#64748b" },
    { id: 1, x: 22, y: 48, label: "React 19", color: "#22d3ee", glow: "#06b6d4" },
    { id: 2, x: 50, y: 75, label: "Prisma ORM", color: "#64748b", glow: "#475569" },
    { id: 3, x: 78, y: 48, label: "Tailwind v4", color: "#14b8a6", glow: "#0d9488" },
    { id: 4, x: 30, y: 68, label: "Supabase", color: "#10b981", glow: "#059669" },
    { id: 5, x: 70, y: 68, label: "PostgreSQL", color: "#60a5fa", glow: "#3b82f6" },
  ];

  const edges = [[0,1],[0,3],[1,2],[2,4],[2,5],[3,5],[4,2],[1,4],[3,0],[5,3]];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // The mouse repels/attracts nodes slightly
  const getDisplacedNode = (node: typeof nodeData[0]) => {
    const dx = node.x - mouse.x;
    const dy = node.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(0, (18 - dist) / 18) * 5;
    return {
      x: node.x + (dist > 0 ? (dx / dist) * force : 0),
      y: node.y + (dist > 0 ? (dy / dist) * force : 0),
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse({ x: 50, y: 50 })}
      className="relative w-full h-80 overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/60 cursor-crosshair select-none"
    >
      {/* Ambient radial following cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle 180px at ${mouse.x}% ${mouse.y}%, rgba(6,182,212,0.12), transparent 70%)`,
        }}
      />

      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[20,40,60,80].map(v => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(100,116,139,0.5)" strokeWidth="0.3" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(100,116,139,0.5)" strokeWidth="0.3" />
          </g>
        ))}
      </svg>

      {/* SVG Graph */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Edges */}
        {edges.map(([a, b], i) => {
          const na = getDisplacedNode(nodeData[a]);
          const nb = getDisplacedNode(nodeData[b]);
          const isHighlighted = hoveredNode === a || hoveredNode === b;
          return (
            <motion.line key={i}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={isHighlighted ? "rgba(34,211,238,0.6)" : "rgba(34,211,238,0.12)"}
              strokeWidth={isHighlighted ? "0.6" : "0.3"}
              style={{ transition: 'all 0.12s ease' }}
            />
          );
        })}

        {/* Animated token on random edge */}
        {edges.slice(0,3).map(([a, b], i) => {
          const na = getDisplacedNode(nodeData[a]);
          const nb = getDisplacedNode(nodeData[b]);
          return (
            <motion.circle key={`token-${i}`} r="0.8" fill="#22d3ee" opacity="0.8"
              animate={{
                cx: [na.x, nb.x, na.x],
                cy: [na.y, nb.y, na.y],
                opacity: [0, 0.9, 0],
              }}
              transition={{ repeat: Infinity, duration: 3 + i * 1.5, delay: i * 1.2, ease: "easeInOut" }}
            />
          );
        })}

        {/* Nodes */}
        {nodeData.map((node, i) => {
          const displaced = getDisplacedNode(node);
          const isHov = hoveredNode === i;
          return (
            <g key={i}
              onMouseEnter={() => setHoveredNode(i)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer', transition: 'all 0.12s ease' }}>
              {/* Glow ring */}
              <motion.circle
                cx={displaced.x} cy={displaced.y}
                r={isHov ? 7 : 5}
                fill="none"
                stroke={node.color}
                strokeWidth={isHov ? "0.8" : "0.4"}
                opacity={isHov ? 0.8 : 0.3}
                style={{ transition: 'all 0.15s ease' }}
              />
              {/* Node body */}
              <motion.circle
                cx={displaced.x} cy={displaced.y} r="3.5"
                fill={node.color} fillOpacity={isHov ? 0.4 : 0.15}
                stroke={node.color} strokeWidth="0.5"
                animate={{ r: isHov ? [3.5, 4.2, 3.5] : [3.5, 4, 3.5] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.35, ease: "easeInOut" }}
              />
              {/* Label */}
              <text x={displaced.x} y={displaced.y + 8.5} textAnchor="middle" fontSize={isHov ? "3.5" : "3"}
                fill={isHov ? node.color : "rgba(148,163,184,0.7)"} fontFamily="monospace"
                style={{ transition: 'all 0.15s ease' }}>
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredNode !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute top-4 left-4 glass-panel rounded-lg px-3 py-2 border border-slate-700 text-xs font-mono"
          >
            <span className="text-cyan-400 font-bold">{nodeData[hoveredNode].label}</span>
            <span className="text-slate-500 ml-2">· Enterprise tier</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-700">Mueve el cursor · Enterprise Architecture · 2026</div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function FrameworksPage() {
  const [activeStack, setActiveStack] = useState<Stack>(stacks[0]);
  const [termKey, setTermKey] = useState(0);

  const selectStack = (s: Stack) => { setActiveStack(s); setTermKey(k => k + 1); };

  return (
    <main className="min-h-screen py-16 px-6 max-w-7xl mx-auto">
      {/* Hero */}
      <Reveal>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 glass-panel">
            <Icons.LayoutTemplate className="w-3.5 h-3.5" /> Stack v2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-white tracking-tight">Enterprise Architecture Grid</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Haz clic en cualquier framework para simular su integración en tiempo real. Mueve el cursor sobre el grafo.
          </p>
        </div>
      </Reveal>

      {/* Interactive Architecture SVG */}
      <Reveal delay={0.1}>
        <div className="mb-14">
          <ArchitectureMatrix />
        </div>
      </Reveal>

      {/* Stack Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-12">
        {stacks.map((stack, i) => {
          const isActive = activeStack.id === stack.id;
          return (
            <Reveal key={stack.id} delay={i * 0.06}>
              <motion.button
                whileHover={{ y: -8, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectStack(stack)}
                className={`w-full glass-panel p-6 rounded-3xl border text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group relative overflow-hidden ${
                  isActive ? "border-cyan-500/70 shadow-[0_0_35px_rgba(34,211,238,0.2)]" : `border-slate-800 ${stack.color}`
                }`}
              >
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0 }}
                  className="absolute inset-0 pointer-events-none rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${stack.accentColor}, transparent 70%)` }}
                />
                <div className={`p-4 rounded-2xl transition-colors relative z-10 ${isActive ? "bg-cyan-500/15 border border-cyan-500/30" : "bg-slate-900 border border-slate-800 group-hover:bg-slate-800"}`}>
                  <stack.icon className={`w-9 h-9 transition-colors ${isActive ? "text-cyan-400" : "text-slate-300 group-hover:text-cyan-400"}`} />
                </div>
                <div className="relative z-10">
                  <h3 className={`font-bold mb-1 transition-colors ${isActive ? "text-white" : "text-slate-200 group-hover:text-white"}`}>{stack.name}</h3>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border transition-colors ${
                    isActive ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" : "bg-slate-900 text-slate-500 border-slate-800 group-hover:border-cyan-500/30 group-hover:text-cyan-400"
                  }`}>{stack.status}</span>
                </div>
                {isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </motion.button>
            </Reveal>
          );
        })}
      </div>

      {/* Terminal */}
      <Reveal delay={0.2}>
        <AnimatePresence mode="wait">
          <motion.div key={activeStack.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-2xl"
          >
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs font-mono text-slate-500">{activeStack.cmd[0]}</span>
              <div className="ml-auto flex items-center gap-1.5">
                <motion.div animate={{ opacity: [1,0.3,1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-[10px] text-emerald-400 font-mono">neural-forge running</span>
              </div>
            </div>
            <TypewriterTerminal key={termKey} lines={activeStack.cmd} />
          </motion.div>
        </AnimatePresence>
      </Reveal>

      {/* Bottom CTA section */}
      <Reveal delay={0.1}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Icons.Zap, title: "Integración en segundos", desc: "Cada framework se instala con un solo comando neural-forge.", color: "text-amber-400" },
            { icon: Icons.ShieldCheck, title: "Security-first", desc: "RLS políticas generadas automáticamente por /security-guard.", color: "text-emerald-400" },
            { icon: Icons.Cpu, title: "AI-Ready Stack", desc: "Gemini Pro y OpenAI configurados out-of-the-box.", color: "text-purple-400" },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all">
              <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </main>
  );
}
