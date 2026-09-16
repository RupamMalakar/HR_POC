import React from 'react';
import { DeliverableItem } from '../../types/hr';

interface DeliverablesViewProps {
  deliverables: DeliverableItem[];
  onApprove: (id: string) => void;
}

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({
  deliverables,
  onApprove
}) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header Info */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white tracking-tight">
            Deliverables &amp; Official HR Documents
          </h2>
          <p className="text-xs text-white/50">
            Autonomous drafts awaiting specialist sign-off and dispatch
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-400/30">
            {deliverables.filter(d => d.status === 'pending_approval').length} Pending Sign-off
          </span>
        </div>
      </div>

      {/* Grid of Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {deliverables.map((doc) => {
          const isPending = doc.status === 'pending_approval';
          const isApproved = doc.status === 'approved';

          return (
            <div
              key={doc.id}
              className="rounded-2xl p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all flex flex-col justify-between specular-border"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-400/20">
                    {doc.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
                      isPending
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {doc.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">{doc.title}</h3>
                <p className="text-xs text-white/50 mb-3 font-mono">
                  Employee: {doc.employeeName} · {doc.department} · {doc.generatedAt}
                </p>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 font-light leading-relaxed mb-4">
                  "{doc.contentPreview}"
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={() => alert(`Opening preview for ${doc.title}`)}
                  className="text-white/60 hover:text-white font-mono inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View PDF</span>
                </button>

                {isPending ? (
                  <button
                    onClick={() => onApprove(doc.id)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs shadow-neon-emerald transition-all cursor-pointer"
                  >
                    Approve &amp; Dispatch
                  </button>
                ) : (
                  <span className="font-mono text-emerald-300 text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Dispatched to Employee
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
