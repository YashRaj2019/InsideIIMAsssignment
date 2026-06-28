import React from 'react';
import { ShieldAlert, TrendingUp, HelpCircle } from 'lucide-react';

export default function Navbar({ dbStatus }) {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-dark-border">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-brand-primary to-brand-secondary p-2 rounded-lg text-dark-bg shadow-glow">
          <TrendingUp className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-primary bg-clip-text text-transparent">
            EQUITY<span className="text-brand-primary text-glow-cyan">EYE</span>
          </span>
          <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-dark-border text-brand-primary/80 uppercase tracking-widest border border-brand-primary/20">
            AI Research Agent
          </span>
        </div>
      </div>

    </nav>
  );
}
