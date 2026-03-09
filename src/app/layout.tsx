import type { Metadata } from 'next';
import { Navbar } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import { CursorGlow } from '../components/ui/CursorGlow';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeuralForge AI Studio - Ecosystem Showcase',
  description: 'Interactive visualization of the 21 neural skills from NeuralForge Architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased overflow-x-hidden selection:bg-purple-500/30 flex flex-col">
        <CursorGlow />
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
        <div className="fixed top-[-50%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="fixed bottom-[-50%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-cyan-900/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
        
        <Navbar />
        <div className="flex-1 pt-24">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
