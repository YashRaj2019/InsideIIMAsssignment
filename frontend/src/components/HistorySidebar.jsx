import React from 'react';
import { History, Calendar, FileText, Trash2 } from 'lucide-react';

export default function HistorySidebar({ history, currentReport, onSelectReport, onDeleteReport, onClearHistory }) {
  return (
    <aside className="glass-panel rounded-2xl p-5 flex flex-col h-[calc(100vh-140px)] border border-dark-border">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dark-border">
        <History className="w-5 h-5 text-brand-primary" />
        <h3 className="font-bold text-lg text-dark-text tracking-wide">Research History</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-dark-border text-dark-muted font-bold">
          {history.length}
        </span>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="ml-auto text-dark-muted hover:text-brand-danger transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-brand-danger/10"
            title="Clear all history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
          <FileText className="w-10 h-10 text-dark-border mb-2 stroke-[1.5]" />
          <p className="text-sm text-dark-muted">No research reports saved yet.</p>
          <p className="text-xs text-dark-muted/60 mt-1">Search for a company to compile your first report.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {history.map((report) => {
            const isSelected = currentReport && currentReport._id === report._id;
            const date = new Date(report.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <button
                key={report._id}
                onClick={() => onSelectReport(report)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-2 relative group ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-secondary/20 to-brand-primary/10 border-brand-primary/60 shadow-glow'
                    : 'bg-slate-900/40 border-dark-border/80 hover:bg-slate-900/80 hover:border-dark-border'
                }`}
              >
                <div className="flex items-center justify-between w-full gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="font-extrabold text-[11px] text-white tracking-wider bg-slate-950/80 px-1.5 py-0.5 rounded border border-dark-border shrink-0">
                      {report.ticker}
                    </span>
                    <span className="font-semibold text-xs text-dark-muted truncate min-w-0">
                      {report.company}
                    </span>
                  </div>
                  
                  {/* Dynamic Hover Delete Icon */}
                  <div className="flex items-center relative min-h-[18px]">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 transition-all duration-150 group-hover:opacity-0`}
                      style={{
                        color: report.recommendation === 'Invest' ? '#10b981' : '#94a3b8',
                        backgroundColor: report.recommendation === 'Invest' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                        border: report.recommendation === 'Invest' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(148, 163, 184, 0.3)'
                      }}
                    >
                      {report.recommendation}
                    </span>
                    <button
                      onClick={(e) => onDeleteReport(report._id, e)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-dark-muted hover:text-brand-danger opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer p-1 rounded-md hover:bg-brand-danger/10"
                      title="Delete report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-dark-muted font-medium mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-dark-muted/60" />
                    {date}
                  </span>
                  <span className="text-glow-cyan font-semibold">
                    {report.confidence}% Conf.
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
