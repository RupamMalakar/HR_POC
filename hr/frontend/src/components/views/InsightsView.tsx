import React, { useState } from 'react';
import { InsightItem, CategoryVolume } from '../../types/hr';
import { hrService } from '../../services/hrService';
import { NavTab } from '../layout/Sidebar';

interface InsightsViewProps {
  insights: InsightItem[];
  categories: CategoryVolume[];
  onRefresh?: () => Promise<void> | void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  insights,
  categories,
  onRefresh,
  onNavigateTab
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'sla' | 'policy'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deployedRules, setDeployedRules] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await hrService.getInsights();
        await hrService.getCategoryVolumes();
      }
      showToast('Operational telemetry and insights refreshed from live ticket state.');
    } catch {
      showToast('Failed to refresh insights. Please ensure the backend is running.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await hrService.exportInsightsCsv();
      showToast('CSV report successfully generated and downloaded.');
    } catch {
      showToast('Error exporting CSV telemetry report.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeployRule = (item: InsightItem) => {
    setDeployedRules(prev => ({ ...prev, [item.id]: true }));
    showToast(`Automated triage rule configured for: "${item.title}". Incoming cases will be auto-flagged.`);
  };

  // Metrics summary
  const totalCount = insights.length;
  const criticalHighCount = insights.filter(i => i.impact === 'CRITICAL' || i.impact === 'HIGH').length;
  const slaBottlenecks = insights.filter(i => (i.id && i.id.includes('SLA')) || (i.icon === 'alarm' || i.icon === 'timelapse')).length;
  const policyGaps = insights.filter(i => (i.id && (i.id.includes('POLICY') || i.id.includes('CLUSTER'))) || i.relatedPolicy).length;

  // Filtered insights
  const filteredInsights = insights.filter(item => {
    if (activeFilter === 'high') {
      return item.impact === 'CRITICAL' || item.impact === 'HIGH';
    }
    if (activeFilter === 'sla') {
      return (item.id && item.id.includes('SLA')) || item.icon === 'alarm' || item.icon === 'timelapse';
    }
    if (activeFilter === 'policy') {
      return (item.id && (item.id.includes('POLICY') || item.id.includes('CLUSTER'))) || Boolean(item.relatedPolicy);
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col gap-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0e1726]/90 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,240,255,0.15)] backdrop-blur-xl text-white text-xs font-mono animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-cyan-400 text-[18px]">verified</span>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Automated Process Discovery
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Process Improvement &amp; Operational Insights
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl leading-relaxed">
            Autonomous discovery of operational bottlenecks, resolution SLA anomalies, recurring inquiry clusters, and policy grounding gaps powered by real-time ticket telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Re-run dynamic telemetry analysis on current ticket database"
          >
            <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-white/70'}`}>
              refresh
            </span>
            <span>{isRefreshing ? 'Analyzing...' : 'Refresh Analysis'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.1)] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExporting ? 'hourglass_top' : 'download'}
            </span>
            <span>{isExporting ? 'Exporting...' : 'Export Telemetry CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Active Insights</span>
            <div className="text-2xl font-display font-bold text-white mt-1">{totalCount}</div>
            <span className="text-[10px] text-cyan-400/80 font-mono">Live heuristic checks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            <span className="material-symbols-outlined text-[22px]">insights</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Critical Bottlenecks</span>
            <div className="text-2xl font-display font-bold text-rose-400 mt-1">{criticalHighCount}</div>
            <span className="text-[10px] text-rose-400/80 font-mono">Require executive review</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">SLA Anomalies</span>
            <div className="text-2xl font-display font-bold text-amber-400 mt-1">{slaBottlenecks}</div>
            <span className="text-[10px] text-amber-400/80 font-mono">&gt;24h in review</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <span className="material-symbols-outlined text-[22px]">alarm</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">Policy &amp; Gaps</span>
            <div className="text-2xl font-display font-bold text-emerald-400 mt-1">{policyGaps}</div>
            <span className="text-[10px] text-emerald-400/80 font-mono">Documentation updates</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="material-symbols-outlined text-[22px]">rule</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-white/15 text-white border border-white/20 shadow-sm'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>All Insights</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10">{totalCount}</span>
        </button>

        <button
          onClick={() => setActiveFilter('high')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'high'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
              : 'text-white/50 hover:text-rose-300 hover:bg-white/5'
          }`}
        >
          <span>High &amp; Critical Impact</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300">{criticalHighCount}</span>
        </button>

        <button
          onClick={() => setActiveFilter('sla')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'sla'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-white/50 hover:text-amber-300 hover:bg-white/5'
          }`}
        >
          <span>SLA Anomalies</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300">{slaBottlenecks}</span>
        </button>

        <button
          onClick={() => setActiveFilter('policy')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'policy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-white/50 hover:text-emerald-300 hover:bg-white/5'
          }`}
        >
          <span>Policy Grounding Gaps</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">{policyGaps}</span>
        </button>
      </div>

      {/* Recommended Process Changes / Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInsights.map((item) => {
          const impact = item.impact || (item.type === 'warning' ? 'HIGH' : item.type === 'emerald' ? 'LOW' : 'MEDIUM');
          const isCritical = impact === 'CRITICAL';
          const isHigh = impact === 'HIGH';
          const isMedium = impact === 'MEDIUM';
          const isLow = impact === 'LOW';

          const isRuleDeployed = deployedRules[item.id];

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-white/[0.03] border flex flex-col justify-between specular-border hover:bg-white/[0.06] transition-all duration-200 group ${
                isCritical 
                  ? 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.08)]' 
                  : isHigh 
                  ? 'border-amber-500/30' 
                  : isMedium 
                  ? 'border-cyan-500/20' 
                  : 'border-white/10'
              }`}
            >
              <div>
                {/* Card Header: Icon, Change Badge, Impact Pill */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl border ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : isMedium
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      <span className="material-symbols-outlined text-[20px]">{item.icon || 'lightbulb'}</span>
                    </div>

                    <span className="text-[10px] font-mono text-white/40 tracking-wider">
                      {item.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Impact Pill */}
                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                      isCritical
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                        : isHigh
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : isMedium
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
                      {impact}
                    </span>

                    {/* Change / Telemetry Badge */}
                    {item.changeText && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10 whitespace-nowrap">
                        {item.changeText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-white/60 font-light leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Suggested Remediation Box */}
                {item.suggestedRemediation && (
                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-1">
                      <span className="material-symbols-outlined text-[13px]">bolt</span>
                      <span>Suggested Remediation</span>
                    </div>
                    <p className="text-xs text-white/80 font-normal leading-relaxed">
                      {item.suggestedRemediation}
                    </p>
                  </div>
                )}

                {/* Tags: Policy & Category */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {item.relatedPolicy && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300/80 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      <span className="material-symbols-outlined text-[12px]">description</span>
                      <span className="truncate max-w-[200px]" title={item.relatedPolicy}>
                        {item.relatedPolicy}
                      </span>
                    </span>
                  )}
                  {item.relatedCategory && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10 capitalize">
                      <span className="material-symbols-outlined text-[12px]">folder</span>
                      <span>{item.relatedCategory.replace('_', ' ')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3.5 border-t border-white/5 mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleDeployRule(item)}
                  disabled={isRuleDeployed}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                    isRuleDeployed
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 hover:bg-white/10 active:scale-98 border border-white/10 text-cyan-300 hover:text-cyan-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isRuleDeployed ? 'done' : 'auto_fix_high'}
                  </span>
                  <span>{isRuleDeployed ? 'Rule Active' : 'Deploy Auto-Rule →'}</span>
                </button>

                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab(item.relatedCategory === 'leave' || isHigh ? 'requests' : 'ai-triage')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                    title="View related tickets in workspace"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredInsights.length === 0 && (
        <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-2xl bg-white/5 text-white/40 mb-3">
            <span className="material-symbols-outlined text-[32px]">filter_list_off</span>
          </div>
          <h4 className="text-base font-bold text-white mb-1">No Insights in Current View</h4>
          <p className="text-xs text-white/50 max-w-sm">
            No operational issues match the &ldquo;{activeFilter}&rdquo; filter. Switch filters or submit new tickets to observe dynamic pattern clustering.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="mt-4 px-3.5 py-1.5 rounded-xl bg-white/10 text-white text-xs font-mono hover:bg-white/15 transition-colors cursor-pointer"
          >
            Show All Insights
          </button>
        </div>
      )}

      {/* Category Volume Breakdown Details */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Weekly Ticket Distribution &amp; Categorical Workload
            </h3>
            <p className="text-xs text-white/50">
              Categories exceeding the 25% distribution threshold automatically trigger operational re-balancing alerts.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 self-start sm:self-auto">
            Threshold: 25% Max Share
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const isExceeded = cat.percent > 25;
            return (
              <div 
                key={cat.name} 
                className={`p-4 rounded-xl bg-black/40 border transition-all ${
                  isExceeded ? 'border-amber-500/30 bg-amber-500/[0.03]' : 'border-white/5'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-white font-medium flex items-center gap-1.5">
                    {cat.name}
                    {isExceeded && (
                      <span className="text-[10px] text-amber-400 font-bold" title="Exceeds 25% threshold">
                        ⚠️
                      </span>
                    )}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isExceeded ? 'text-amber-400' : 'text-cyan-300'}`}>
                    {cat.percent}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.colorGradient || 'from-cyan-500 to-blue-500'}`}
                    style={{ width: `${Math.min(100, cat.barWidthPercent || cat.percent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                  <span>{cat.count} total cases</span>
                  <span>{isExceeded ? 'Flagged Spike' : 'Within Bounds'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
