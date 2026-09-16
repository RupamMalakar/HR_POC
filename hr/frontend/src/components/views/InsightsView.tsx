import React from 'react';
import { InsightItem, CategoryVolume } from '../../types/hr';

interface InsightsViewProps {
  insights: InsightItem[];
  categories: CategoryVolume[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  insights,
  categories
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header Info */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white tracking-tight">
            Process Improvement &amp; Operational Insights
          </h2>
          <p className="text-xs text-white/50">
            Autonomous discovery of operational bottlenecks, recurring tickets, and policy gaps
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting operational telemetry report to CSV...")}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Recommended Process Changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((item) => {
          const isWarning = item.type === 'warning';
          const isEmerald = item.type === 'emerald';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between specular-border hover:bg-white/[0.06] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${
                    isWarning ? 'bg-rose-500/20 text-rose-300' : isEmerald ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  {item.changeText && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/70 border border-white/10">
                      {item.changeText}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-white/60 font-light leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4">
                <button
                  onClick={() => alert(`Creating automated triage rule for: ${item.title}`)}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-mono transition-colors text-center cursor-pointer"
                >
                  Deploy Auto-Rule →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Volume Breakdown Details */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border">
        <h3 className="font-display text-base font-bold text-white mb-4">
          Weekly Ticket Distribution &amp; Categorical Workload
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-white font-medium">{cat.name}</span>
                <span className="text-xs font-mono text-cyan-300 font-bold">{cat.percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cat.colorGradient}`}
                  style={{ width: `${cat.barWidthPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-white/40">{cat.count} total cases</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
