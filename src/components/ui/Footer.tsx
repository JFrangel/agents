export function Footer() {
  return (
    <footer className="py-24 border-t border-slate-800/50 text-center relative z-10 bg-slate-950 mt-20">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white flex items-center justify-center mx-auto mb-10 font-black text-lg shadow-2xl shadow-cyan-500/20">
        NF
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] mb-12">
        Designed for the 2026 Agentic Era
      </p>
      <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600">
        <span className="hover:text-cyan-400 cursor-crosshair transition-colors">NeuralForge Protocol v4.4.1</span>
        <span className="hover:text-cyan-400 cursor-crosshair transition-colors">ORCHESTRATOR_CORE</span>
        <span className="hover:text-cyan-400 cursor-crosshair transition-colors">EST. 2026</span>
        <span className="hover:text-cyan-400 cursor-crosshair transition-colors">MIT LICENSE</span>
      </div>
    </footer>
  );
}
