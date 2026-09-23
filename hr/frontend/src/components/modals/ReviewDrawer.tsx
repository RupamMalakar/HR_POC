import React, { useState } from 'react';
import { RequestItem } from '../../types/hr';

interface ReviewDrawerProps {
  item: RequestItem | null;
  onClose: () => void;
  onResolve: (id: string, notes: string) => void;
  onEscalate?: (id: string, notes: string) => void;
}

export const ReviewDrawer: React.FC<ReviewDrawerProps> = ({
  item,
  onClose,
  onResolve
}) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const handleResolve = async () => {
    setIsSubmitting(true);
    await onResolve(item.id, notes || 'Case reviewed and verified against internal HR handbook policies.');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[#090c1e] border-l border-white/20 shadow-2xl h-full flex flex-col justify-between overflow-y-auto specular-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-neon-cyan font-bold">
                {item.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                item.priority === 'high'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {item.priority} priority
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <h2 className="font-display text-lg font-bold text-white leading-tight">
            {item.title}
          </h2>
          <p className="text-xs font-mono text-white/40 mt-1">
            Waiting time: {item.waitingTime} · Submitted {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Employee Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.employee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={typeof item.employee === 'object' && item.employee ? (item.employee.name || 'Employee') : 'Employee'}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/20"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {typeof item.employee === 'object' && item.employee ? (item.employee.name || 'Employee') : (item.employee || 'Employee')}
                </h4>
                <p className="text-xs text-white/50">
                  {item.employee?.title || item.employee?.department || 'Operations'}
                </p>
                <span className="text-[11px] font-mono text-cyan-300/70">
                  {item.employee?.email || 'employee@enterprise.internal'}
                </span>
              </div>
            </div>
            {item.employee?.tenure && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white/70">
                Tenure: {item.employee.tenure}
              </span>
            )}
          </div>

          {/* Issue Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-2">
              Case Narrative
            </h4>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs text-white/90 leading-relaxed font-light">
              {item.description}
            </div>
          </div>

          {/* AI Autonomous Triage Telemetry */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-blue-950/40 border border-purple-500/30 shadow-neon-violet">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-[18px]">
                  auto_awesome
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  Autonomous AI Assessment
                </span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30">
                {Math.round(item.aiTriage.confidence * 100)}% Confidence
              </span>
            </div>
            <p className="text-xs text-white/80 font-mono">
              Classification: <span className="text-cyan-300">{item.aiTriage.classification}</span>
            </p>
            <p className="text-xs text-white/60 mt-2 font-light">
              Recommendation: Standard policy clauses match handbook article 4. Automated resolution draft has been staged in the deliverables queue.
            </p>
          </div>

          {/* Action Resolution Form */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
              HR Specialist Resolution Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Reconciled with payroll batch #891. Nov 1 payout confirmed..."
              className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-neon-cyan"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              disabled={isSubmitting}
              onClick={() => {
                alert(`Case ${item.id} escalated to Tier-2 Operations Lead.`);
                onClose();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-all"
            >
              Escalate
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleResolve}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs shadow-neon-emerald transition-all"
            >
              {isSubmitting ? 'Resolving...' : 'Approve & Resolve Case'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
