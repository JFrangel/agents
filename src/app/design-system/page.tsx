"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

/* ──────────────────────────────────────────────────────────────
   ArchitectureMatrix — physics-based with mouse repulsion,
   orbital particles and connection opacity by distance to cursor
   ────────────────────────────────────────────────────────────── */
interface NodeData {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  label: string;
  layer: string;
}

function ArchitectureMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animRef = useRef<number>(0);
  const nodesRef = useRef<NodeData[]>([]);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  // Initialize nodes
  useEffect(() => {
    nodesRef.current = [
      { id: 0, x: 50, y: 22, vx: 0, vy: 0, r: 9,   color: "#06b6d4", label: "Next.js 15",   layer: "Frontend" },
      { id: 1, x: 20, y: 50, vx: 0, vy: 0, r: 8,   color: "#22d3ee", label: "React 19",     layer: "UI Layer" },
      { id: 2, x: 80, y: 50, vx: 0, vy: 0, r: 8,   color: "#14b8a6", label: "Tailwind v4",  layer: "Styling" },
      { id: 3, x: 35, y: 72, vx: 0, vy: 0, r: 7.5, color: "#10b981", label: "Supabase",     layer: "Backend" },
      { id: 4, x: 65, y: 72, vx: 0, vy: 0, r: 7.5, color: "#60a5fa", label: "PostgreSQL",   layer: "Database" },
      { id: 5, x: 50, y: 55, vx: 0, vy: 0, r: 6,   color: "#64748b", label: "Prisma ORM",   layer: "ORM" },
      { id: 6, x: 15, y: 28, vx: 0, vy: 0, r: 5,   color: "#a78bfa", label: "Framer Motion",layer: "Animation" },
      { id: 7, x: 85, y: 28, vx: 0, vy: 0, r: 5,   color: "#f59e0b", label: "TypeScript",   layer: "Language" },
    ];
  }, []);

  const edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[0,5],[1,6],[0,7],[5,3],[5,4]];

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -999, y: -999 };
    setHoveredLabel(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;
    const draw = () => {
      t += 0.012;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      // Apply mouse repulsion + gentle drift back to origin
      const origins = [
        [50,22],[20,50],[80,50],[35,72],[65,72],[50,55],[15,28],[85,28]
      ];
      let hovered: string | null = null;

      nodes.forEach((n, i) => {
        const ox = origins[i][0], oy = origins[i][1];
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const repulse = Math.max(0, (22 - dist) / 22) * 12;
        // Hover detection
        if (dist < n.r / 100 * 20 + 4) hovered = n.label;
        // Physics
        n.vx += (dx / Math.max(dist, 1)) * repulse * 0.08;
        n.vy += (dy / Math.max(dist, 1)) * repulse * 0.08;
        // Spring back to origin
        n.vx += (ox - n.x) * 0.03;
        n.vy += (oy - n.y) * 0.03;
        // Damping + subtle float
        n.vx *= 0.82;
        n.vy *= 0.82;
        n.vx += Math.sin(t + i * 1.3) * 0.015;
        n.vy += Math.cos(t + i * 1.7) * 0.015;
        n.x += n.vx;
        n.y += n.vy;
      });
      setHoveredLabel(hovered);

      // Draw edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        const px = (na.x + nb.x) / 2 - mx, py = (na.y + nb.y) / 2 - my;
        const edgeDist = Math.sqrt(px*px + py*py);
        const alpha = Math.min(0.6, 0.1 + (40 - Math.min(edgeDist, 40)) / 40 * 0.5);
        const gx = ctx.createLinearGradient(
          na.x / 100 * W, na.y / 100 * H,
          nb.x / 100 * W, nb.y / 100 * H
        );
        gx.addColorStop(0, na.color + "40");
        gx.addColorStop(0.5, "#22d3ee" + Math.round(alpha * 255).toString(16).padStart(2,"0"));
        gx.addColorStop(1, nb.color + "40");
        ctx.beginPath();
        ctx.moveTo(na.x / 100 * W, na.y / 100 * H);
        ctx.lineTo(nb.x / 100 * W, nb.y / 100 * H);
        ctx.strokeStyle = gx;
        ctx.lineWidth = alpha > 0.3 ? 1.5 : 0.8;
        ctx.stroke();

        // Animated data token on each edge
        const progress = ((t * 0.25 + a * 0.37 + b * 0.22) % 1);
        const tx = (na.x + (nb.x - na.x) * progress) / 100 * W;
        const ty = (na.y + (nb.y - na.y) * progress) / 100 * H;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#22d3ee" + "cc";
        ctx.shadowColor = "#22d3ee";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const nx = n.x / 100 * W, ny = n.y / 100 * H;
        const ndx = n.x - mx, ndy = n.y - my;
        const d = Math.sqrt(ndx*ndx + ndy*ndy);
        const isHov = d < 12;
        const radius = (n.r / 100) * Math.min(W, H) * 0.5 + (isHov ? 3 : 0);

        // Outer glow ring (pulsing)
        const pulseR = radius * (1.6 + 0.3 * Math.sin(t * 1.5 + i * 0.6));
        const ringAlpha = 0.2 + 0.12 * Math.sin(t * 1.5 + i * 0.6);
        const ring = ctx.createRadialGradient(nx, ny, radius * 0.8, nx, ny, pulseR);
        ring.addColorStop(0, n.color + "00");
        ring.addColorStop(1, n.color + Math.round(ringAlpha * 255).toString(16).padStart(2,"0"));
        ctx.beginPath();
        ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = ring;
        ctx.fill();

        // Node body gradient
        const grad = ctx.createRadialGradient(nx - radius*0.3, ny - radius*0.3, 0, nx, ny, radius);
        grad.addColorStop(0, n.color + "90");
        grad.addColorStop(1, n.color + "30");
        ctx.beginPath();
        ctx.arc(nx, ny, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.strokeStyle = n.color + (isHov ? "ee" : "80");
        ctx.lineWidth = isHov ? 2 : 1;
        ctx.fill();
        ctx.stroke();

        // Label for hovered or anchor node
        if (isHov || i === 0) {
          ctx.font = `bold ${Math.round(radius * 1.1)}px monospace`;
          ctx.fillStyle = n.color;
          ctx.textAlign = "center";
          ctx.fillText(n.label, nx, ny + radius + radius * 1.3);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-80 rounded-3xl overflow-hidden bg-slate-950 border border-slate-800/60 cursor-crosshair select-none">
      {/* Cursor ambient glow via CSS (no canvas needed) */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />

      <canvas ref={canvasRef} width={1200} height={480} className="absolute inset-0 w-full h-full" />

      {/* Hovered tooltip */}
      {hoveredLabel && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-mono font-bold text-cyan-400 pointer-events-none">
          {hoveredLabel} · Enterprise tier
        </motion.div>
      )}
      <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-700 pointer-events-none">
        Mueve el cursor · Physics-Based · 2026
      </div>
    </div>
  );
}

/* ── Scroll Reveal ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── Color Swatch ── */
function Swatch({ label, value, textColor = "text-white" }: { label: string; value: string; textColor?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
      onClick={copy}
      className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-16 h-16 rounded-2xl border-2 border-slate-800 group-hover:border-slate-600 transition-all shadow-lg"
        style={{ backgroundColor: value }} />
      <span className="text-[10px] font-mono text-slate-400">{label}</span>
      <span className={`text-[9px] font-mono ${textColor} opacity-60`}>{copied ? "✓ copied" : value}</span>
    </motion.button>
  );
}

/* ── Token Card ── */
function TokenCard({ icon: Icon, title, value, desc }: { icon: React.ElementType; title: string; value: string; desc: string }) {
  return (
    <motion.div whileHover={{ y: -4 }}
      className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-cyan-400" />
        <h4 className="font-bold text-slate-200 text-sm">{title}</h4>
      </div>
      <code className="text-xs text-cyan-400 font-mono bg-slate-900 px-2 py-1 rounded block mb-2">{value}</code>
      <p className="text-xs text-slate-500">{desc}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════
   PAGE
════════════════════════════════════ */
export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<"tokens" | "components" | "matrix">("tokens");

  const tabs = [
    { id: "tokens" as const, label: "Design Tokens", icon: Icons.Palette },
    { id: "components" as const, label: "Components", icon: Icons.Layers },
    { id: "matrix" as const, label: "Architecture Matrix", icon: Icons.Network },
  ];

  const colors = [
    { label: "Cyan 400", value: "#22d3ee" },
    { label: "Blue 600",  value: "#2563eb" },
    { label: "Purple 500",value: "#8b5cf6" },
    { label: "Emerald",   value: "#10b981" },
    { label: "Amber 400", value: "#fbbf24" },
    { label: "Slate 800", value: "#1e293b" },
    { label: "Slate 950", value: "#020617" },
    { label: "White",     value: "#f8fafc" },
  ];

  return (
    <main className="min-h-screen text-slate-50 relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[5%] w-[600px] h-[600px] bg-blue-600/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-cyan-600/6 rounded-full blur-[140px]" />
        <div className="absolute top-[60%] right-[30%] w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Nav */}
        <Reveal>
          <div className="flex justify-between items-center mb-16">
            <Link href="/" className="flex items-center gap-2 group text-sm font-bold text-slate-400 hover:text-cyan-400 transition-colors">
              <div className="w-8 h-8 rounded-lg glass-panel border border-slate-700 group-hover:border-cyan-500/50 flex items-center justify-center transition-colors">
                <Icons.ArrowLeft className="w-4 h-4" />
              </div>
              Volver al Simulador
            </Link>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-500 glass-panel px-4 py-1.5 rounded-full border border-cyan-500/25">
              Internal Documentation
            </div>
          </div>
        </Reveal>

        {/* Hero */}
        <Reveal delay={0.05}>
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 glass-panel">
              <Icons.Palette className="w-3.5 h-3.5" /> Design System v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Design System<br /><span className="text-cyan-400">NeuralForge</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              El estándar visual que impulsa las 21 interfaces del Agentic Mesh. Tokens, componentes y la arquitectura visual del stack 2026.
            </p>
          </div>
        </Reveal>

        {/* Tab Navigation */}
        <Reveal delay={0.1}>
          <div className="flex gap-2 mb-12 glass-panel p-1.5 rounded-2xl border border-slate-800 w-fit mx-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ── TOKENS TAB ── */}
        {activeTab === "tokens" && (
          <div className="space-y-8">
            <Reveal>
              <section className="glass-panel border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-all">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-3">
                  <Icons.Palette className="w-6 h-6 text-cyan-400" /> Color Palette
                </h2>
                <p className="text-slate-400 text-sm mb-8">Haz clic en un color para copiar su valor hex.</p>
                <div className="flex flex-wrap gap-6">
                  {colors.map(c => <Swatch key={c.label} label={c.label} value={c.value} />)}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <TokenCard icon={Icons.Type} title="Font Scale" value="font-black tracking-tighter" desc="Headings: Inter Black. Body: Inter Medium. Mono: system monospace." />
                <TokenCard icon={Icons.Maximize2} title="Border Radius" value="rounded-3xl / rounded-2xl" desc="Cards: 24px. Inputs: 12px. Badges: full. Botones: 12px." />
                <TokenCard icon={Icons.Zap} title="Animation" value="ease: [0.22, 1, 0.36, 1]" desc="Spring: stiffness 280, damping 25. Fade duration: 0.55s." />
                <TokenCard icon={Icons.Layers} title="Glass Panel" value=".glass-panel" desc="bg: rgba(30,41,59,0.7) + backdrop-blur(12px) + border rgba(255,255,255,0.08)." />
                <TokenCard icon={Icons.Sun} title="Shadows" value="shadow-[0_0_20px...]" desc="Neon cyan: 20px radius. Card: 0 8px 30px. Hover: +50% intensity." />
                <TokenCard icon={Icons.Grid} title="Spacing Scale" value="gap-4 / gap-6 / gap-8" desc="Tight: 4 · Normal: 6 · Loose: 8 · Section: 16-24." />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <section className="glass-panel border border-slate-800 p-8 rounded-3xl">
                <h3 className="text-lg font-black mb-6 text-white flex items-center gap-2">
                  <Icons.Code className="w-5 h-5 text-purple-400" /> CSS Variables (@theme)
                </h3>
                <pre className="bg-slate-950 rounded-xl p-6 text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`@theme {
  /* Colors */
  --color-brand-cyan: #22d3ee;
  --color-brand-blue: #3b82f6;
  --color-brand-purple: #8b5cf6;
  
  /* Backgrounds */
  --background: #0f172a;   /* slate-950 */
  --card:       #1e293b;   /* slate-800 */
  
  /* Scrollbar */
  --scroll-thumb: rgba(34, 211, 238, 0.35);
  --scroll-thumb-hover: rgba(34, 211, 238, 0.65);
  
  /* Font */
  --font-inter: ui-sans-serif, system-ui, sans-serif;
}`}
                </pre>
              </section>
            </Reveal>
          </div>
        )}

        {/* ── COMPONENTS TAB ── */}
        {activeTab === "components" && (
          <div className="space-y-8">
            {/* Buttons */}
            <Reveal>
              <section className="glass-panel border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-3">
                  <Icons.MousePointer className="w-6 h-6 text-cyan-400" /> Button Component
                </h2>
                <p className="text-sm text-slate-400 mb-8">Todas las variantes del sistema con estados hover/active.</p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button variant="gradient" className="rounded-xl px-8 py-4 font-black uppercase tracking-widest text-xs">Run Primary</Button>
                  <Button variant="outline" className="rounded-xl px-8 py-4 font-black uppercase tracking-widest text-xs border-white/10 hover:bg-white/5 text-slate-300">Run Outline</Button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-8 py-4 glass-panel border border-cyan-500/30 hover:border-cyan-400/60 rounded-xl text-xs font-black uppercase tracking-widest text-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]">
                    Glass Button
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-8 py-4 bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400/60 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-400 transition-all">
                    Success
                  </motion.button>
                </div>
                <pre className="bg-slate-950 rounded-xl p-5 text-xs font-mono text-slate-400 border border-slate-800">
{`import { Button } from "@/components/ui/Button";

<Button variant="gradient">Run Primary</Button>
<Button variant="outline">Run Outline</Button>`}
                </pre>
              </section>
            </Reveal>

            {/* Cards */}
            <Reveal delay={0.1}>
              <section className="glass-panel border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-3">
                  <Icons.Square className="w-6 h-6 text-purple-400" /> Card Variants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { title: "Glass Card", cls: "glass-panel border-slate-800/80", badge: "glass" },
                    { title: "Cyan Glow", cls: "glass-panel border-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.1)]", badge: "neon" },
                    { title: "Emerald Card", cls: "glass-panel border-emerald-500/25", badge: "status" },
                  ].map((c, i) => (
                    <motion.div key={i} whileHover={{ y: -4 }}
                      className={`${c.cls} p-5 rounded-2xl border transition-all`}>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{c.badge}</span>
                      <h4 className="font-bold text-white mt-1 mb-2">{c.title}</h4>
                      <p className="text-xs text-slate-400">Componente card estándar con variante {c.badge}.</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Badges */}
            <Reveal delay={0.15}>
              <section className="glass-panel border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-3">
                  <Icons.Tag className="w-6 h-6 text-amber-400" /> Badge System
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Orquestador", bg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" },
                    { label: "Supervisor", bg: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
                    { label: "Integrator", bg: "bg-purple-500/15 border-purple-500/30 text-purple-400" },
                    { label: "Worker", bg: "bg-slate-500/15 border-slate-600/40 text-slate-400" },
                    { label: "SOUL v2.0 ✓", bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
                    { label: "stable", bg: "bg-slate-900 border-slate-800 text-slate-500" },
                  ].map(b => (
                    <span key={b.label} className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${b.bg}`}>{b.label}</span>
                  ))}
                </div>
              </section>
            </Reveal>

            {/* Skill QA widget */}
            <Reveal delay={0.2}>
              <section className="glass-panel border border-slate-800 p-8 rounded-3xl">
                <h2 className="text-2xl font-black mb-2 text-white flex items-center gap-3">
                  <Icons.TestTube className="w-6 h-6 text-emerald-400" /> Validación QA
                </h2>
                <p className="text-sm text-slate-400 mb-6">El subagente /qa-tester valida cada componente en Browser Automático.</p>
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-xs font-mono text-slate-500">qa-tester · cypress spec</span>
                  </div>
                  <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto">
{`describe('Design System', () => {
  it('validates Button component', () => {
    cy.visit('/design-system');
    cy.contains('Run Primary').click();
    cy.get('button').should('have.class', 'bg-gradient');
  });
  
  it('validates Glass Card', () => {
    cy.get('.glass-panel').should('exist');
    cy.get('.glass-panel').should('have.css', 
      'backdrop-filter', 'blur(12px)');
  });
});`}
                  </pre>
                </div>
              </section>
            </Reveal>
          </div>
        )}

        {/* ── MATRIX TAB ── */}
        {activeTab === "matrix" && (
          <div className="space-y-8">
            <Reveal>
              <div className="text-center mb-8">
                <p className="text-slate-400">Grafo de dependencias del stack 2026. Physics-based — mueve el cursor sobre los nodos.</p>
              </div>
              <ArchitectureMatrix />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Next.js 15", color: "#06b6d4", layer: "Frontend",  desc: "App Router + Turbopack" },
                  { label: "React 19",   color: "#22d3ee", layer: "UI Layer",   desc: "Server Components + use()" },
                  { label: "Supabase",   color: "#10b981", layer: "Backend",    desc: "Auth + RLS + Realtime" },
                  { label: "Prisma ORM", color: "#64748b", layer: "ORM",        desc: "Type-safe DB client" },
                ].map((n, i) => (
                  <motion.div key={i} whileHover={{ y: -4 }}
                    className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
                    <div className="w-3 h-3 rounded-full mb-3" style={{ backgroundColor: n.color }} />
                    <h4 className="font-bold text-white text-sm">{n.label}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{n.layer}</p>
                    <p className="text-xs text-slate-400 mt-2">{n.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}
