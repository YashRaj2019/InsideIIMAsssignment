import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Search, BarChart3, Newspaper, Cpu } from 'lucide-react';

export default function LoadingScreen({ company }) {
  const [stage, setStage] = useState(0);

  // Staged loading texts and icons
  const stages = [
    { text: 'Resolving stock ticker & business identifiers...', icon: Search },
    { text: 'Fetching financial statements & metrics from Yahoo Finance...', icon: BarChart3 },
    { text: 'Reading news sentiment & extracting Wikipedia context...', icon: Newspaper },
    { text: 'Orchestrating Gemini AI to construct final investment recommendation...', icon: Cpu }
  ];

  // Increment stages dynamically to make the progress feel alive
  useEffect(() => {
    const intervals = [1000, 1200, 1200];
    let currentStage = 0;

    const runNextStage = () => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setStage(currentStage);
        setTimeout(runNextStage, intervals[currentStage - 1] || 1200);
      }
    };

    const timer = setTimeout(runNextStage, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-xl mx-auto p-6 bg-slate-900/30 rounded-3xl border border-dark-border/60 glass-panel shadow-2xl relative overflow-hidden mt-8">
      {/* Glow highlight */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-primary/10 blur-[60px]" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-secondary/10 blur-[60px]" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center w-full"
      >
        {/* Animated Radar/Scanner Circle */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-brand-primary/20 animate-ping absolute" />
          <div className="w-20 h-20 rounded-full border border-brand-primary/30 flex items-center justify-center bg-slate-950/80 glow-pulse">
            <Cpu className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
        </div>

        <h3 className="font-extrabold text-2xl text-white tracking-wide mb-2 text-center">
          Researching {company || 'Company'}
        </h3>
        <p className="text-sm text-dark-muted mb-8 text-center max-w-xs">
          Our Senior AI Analyst is aggregating live API endpoints and evaluating financial sheets.
        </p>

        {/* Stages Checklist */}
        <div className="w-full space-y-4 mb-8">
          {stages.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = stage > idx;
            const isActive = stage === idx;

            return (
              <div
                key={idx}
                className={`flex items-start gap-4 p-3 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-primary/5 border-brand-primary/30 shadow-glow'
                    : isCompleted
                    ? 'bg-slate-900/40 border-dark-border/40 opacity-70'
                    : 'bg-transparent border-transparent opacity-30'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0 stroke-[2.5]" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-dark-muted shrink-0" />
                )}

                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-primary' : 'text-dark-muted'}`} />
                  <span className={`text-sm font-semibold tracking-wide ${isActive ? 'text-white' : 'text-dark-muted'}`}>
                    {s.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-dark-bg/60 border border-dark-border h-3.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((stage + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between w-full mt-2 text-[10px] text-dark-muted font-bold tracking-wider uppercase">
          <span>API Retrieval</span>
          <span>AI Synthesis</span>
        </div>
      </motion.div>
    </div>
  );
}
