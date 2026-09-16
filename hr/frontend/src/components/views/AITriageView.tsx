import React, { useState } from 'react';
import { AITriageItem, Category } from '../../types/hr';

interface AITriageViewProps {
  triageQueue: AITriageItem[];
  onOverride: (id: string, category: Category) => void;
}

export const AITriageView: React.FC<AITriageViewProps> = ({
  triageQueue,
  onOverride
}) => {
  const [testPrompt, setTestPrompt] = useState('');
  const [simulationResult, setSimulationResult] = useState<{
    category: string;
    confidence: number;
    reasoning: string;
    suggestedAction: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPrompt.trim()) return;

    setIsSimulating(true);
    setTimeout(() => {
      const q = testPrompt.toLowerCase();
      let category = 'other';
      let confidence = 0.95;
      let reasoning = 'General inquiry detected. Cross-referenced enterprise standard ticketing vocabulary.';
      let suggestedAction = 'Route to General HR queue and notify dispatcher.';

      if (q.includes('bonus') || q.includes('salary') || q.includes('pay') || q.includes('tax')) {
        category = 'payroll';
        confidence = 0.98;
        reasoning = 'High lexical density for payroll compensation terms. Detected monetary units and tax withholding queries.';
        suggestedAction = 'Route to Senior Payroll Specialist; invoke Automated Comp Comparison engine.';
      } else if (q.includes('insurance') || q.includes('health') || q.includes('dental') || q.includes('dependent')) {
        category = 'benefits';
        confidence = 0.96;
        reasoning = 'Matched Healthcare & Global Benefits Policy Section 4. Dependent coverage rules triggered.';
        suggestedAction = 'Dispatch Enrollment Guide and request proof of dependent status.';
      } else if (q.includes('leave') || q.includes('vacation') || q.includes('sabbatical') || q.includes('sick')) {
        category = 'leave';
        confidence = 0.97;
        reasoning = 'Matched Statutory Absence & Sabbatical Handbook Article 6. Calculated tenure eligibility.';
        suggestedAction = 'Generate Sabbatical Schedule Request Form.';
      }

      setSimulationResult({ category, confidence, reasoning, suggestedAction });
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-glass specular-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/50 uppercase">Model Accuracy</span>
            <span className="material-symbols-outlined text-purple-400 text-[18px]">verified</span>
          </div>
          <div className="font-display text-3xl font-bold text-white">99.1%</div>
          <p className="text-[11px] text-purple-300/80 font-mono mt-2">Without human re-route</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-glass specular-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/50 uppercase">Triaged Today</span>
            <span className="material-symbols-outlined text-cyan-400 text-[18px]">bolt</span>
          </div>
          <div className="font-display text-3xl font-bold text-white">86 cases</div>
          <p className="text-[11px] text-cyan-300/80 font-mono mt-2">Avg latency: 1.18s</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-glass specular-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/50 uppercase">Autonomous Resolves</span>
            <span className="material-symbols-outlined text-emerald-400 text-[18px]">auto_mode</span>
          </div>
          <div className="font-display text-3xl font-bold text-white">72 cases</div>
          <p className="text-[11px] text-emerald-300/80 font-mono mt-2">Resolved overnight</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-glass specular-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/50 uppercase">Active Core</span>
            <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f0ff] animate-pulse" />
          </div>
          <div className="font-display text-3xl font-bold text-white">v3.4 SPATIAL</div>
          <p className="text-[11px] text-white/40 font-mono mt-2">LLM + Vector RAG</p>
        </div>
      </div>

      {/* Simulator Sandbox */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-indigo-950/40 backdrop-blur-2xl border border-white/15 shadow-glass specular-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-neon-cyan text-[20px]">psychology</span>
          <h3 className="font-display text-base font-bold text-white">
            AI Triage Sandbox &amp; Live Classifier Simulator
          </h3>
        </div>
        <p className="text-xs text-white/60 mb-4 font-light">
          Test how incoming raw tickets are vectorized, classified, and tagged with confidence scores.
        </p>

        <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="e.g. My payslip didn't include the Q3 performance bonus..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-neon-cyan"
          />
          <button
            type="submit"
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-neon-violet transition-all whitespace-nowrap cursor-pointer"
          >
            {isSimulating ? 'Classifying...' : 'Test Classifier'}
          </button>
        </form>

        {simulationResult && (
          <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-cyan-500/30 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                Predicted: {simulationResult.category}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30">
                {Math.round(simulationResult.confidence * 100)}% Confidence
              </span>
            </div>
            <p className="text-xs text-white/80 font-light">{simulationResult.reasoning}</p>
            <p className="text-xs font-mono text-purple-300">
              Action: {simulationResult.suggestedAction}
            </p>
          </div>
        )}
      </div>

      {/* Live Triage Queue Cards */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-purple-400">auto_awesome</span>
            <h3 className="font-display text-lg font-bold text-white">Live Autonomous Triage Stream</h3>
          </div>
          <span className="text-xs font-mono text-cyan-300">{triageQueue.length} Active in Pipeline</span>
        </div>

        <div className="space-y-4">
          {triageQueue.map((item) => {
            const isHigh = item.urgencyScore === 'HIGH';
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-white/80">
                      {item.requestId}
                    </span>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                      {Math.round(item.confidenceScore * 100)}% Confidence
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isHigh ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.urgencyScore}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-light text-white/70">
                  <strong className="text-white font-mono font-medium">Model Rationale:</strong> {item.reasoning}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                  <span className="text-cyan-300/90 font-mono text-[11px]">
                    Recommendation: {item.suggestedAction}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Auto-routing verified for ${item.requestId}.`)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-medium text-xs transition-all cursor-pointer"
                    >
                      Confirm Route
                    </button>
                    <button
                      onClick={() => {
                        const newCat = prompt('Enter new category (payroll, benefits, leave, documents, compliance):', item.predictedCategory);
                        if (newCat) onOverride(item.id, newCat as Category);
                      }}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 text-xs transition-all cursor-pointer"
                    >
                      Override Category
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
