"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const routes = [
    { href: "/", label: "Simulator", icon: Icons.Cpu },
    { href: "/ecosystem", label: "Ecosystem", icon: Icons.Network },
    { href: "/frameworks", label: "Frameworks", icon: Icons.LayoutTemplate },
    { href: "/docs", label: "Documentation", icon: Icons.BookOpen },
    { href: "/design-system", label: "Design System", icon: Icons.Palette },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-slate-900/40 border border-slate-800/60 rounded-2xl p-2 px-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-sm tracking-tighter">NF</span>
          </div>
          <div>
            <span className="block text-sm font-black uppercase tracking-widest text-slate-200 leading-none">NeuralForge</span>
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest leading-none">AI Studio 2026</span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2 rounded-lg",
                  isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {route.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 border border-cyan-500/30 rounded-lg bg-cyan-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
           <a
             href="https://github.com/JFrangel/agents"
             target="_blank"
             rel="noopener noreferrer"
             className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-cyan-500/60 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
           >
             <Icons.Github className="w-4 h-4" /> Code
           </a>
           <a
             href="https://github.com/JFrangel/agents"
             target="_blank"
             rel="noopener noreferrer"
             className="px-4 py-2 bg-slate-100 text-slate-900 hover:bg-cyan-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
           >
             Deploy
           </a>
        </div>

      </div>
    </nav>
  );
}
