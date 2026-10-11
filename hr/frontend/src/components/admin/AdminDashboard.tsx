import React, { useState, useEffect } from 'react';
import { AdminStatsCards } from './AdminStatsCards';
import { adminService } from '../../services/adminService';
import { AdminStats, AdminAuditLog } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';
import {
  Server,
  Database,
  Radio,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  Sliders,
  FileText,
  RefreshCw,
  Clock,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await adminService.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats();
  };

  const health = stats?.systemHealth || {
    backendApi: 'HEALTHY',
    database: 'CONNECTED',
    sse: 'CONNECTED',
    aiServices: 'AVAILABLE'
  };

  const recentLogs: AdminAuditLog[] = stats?.recentActivity || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner with Quick Action Bar */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-slate-900/40 border border-violet-500/30 backdrop-blur-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-violet-500/20 border border-violet-400/40 text-violet-300">
                ADMINISTRATION COCKPIT
              </span>
              <span className="text-xs text-slate-400 dark:text-white/40 font-mono">
                SOC2 / HIPAA PROTECTED
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-white/60 max-w-2xl leading-relaxed">
              Real-time platform governance, user directory controls, role permission boundaries, and audit logging.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-700/60 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-white/80 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-950/50"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Manage Users</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Stats Cards */}
      <AdminStatsCards stats={stats} isLoading={isLoading} />

      {/* Two Columns: System Health & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Real-time System Health */}
        <div className="rounded-2xl p-5 bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">
                health_and_safety
              </span>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                System Health &amp; Services
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              LIVE MONITOR
            </span>
          </div>

          <div className="space-y-3">
            {/* Backend API */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Backend REST API</span>
                  <span className="text-[10px] text-slate-400 font-mono">Port 8000 / JSON protocol</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{health.backendApi}</span>
              </div>
            </div>

            {/* Database */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Enterprise Data Store</span>
                  <span className="text-[10px] text-slate-400 font-mono">Atomic fs persistence</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{health.database}</span>
              </div>
            </div>

            {/* Server-Sent Events (SSE) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">SSE Push Stream</span>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time dual portal sync</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{health.sse}</span>
              </div>
            </div>

            {/* AI Services */}
            <div
              onClick={() => onNavigateTab('ai-telemetry')}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-slate-800 hover:border-cyan-500/40 dark:border-white/5 transition-all cursor-pointer group"
              title="Click to view real-time AI Telemetry & Token Intelligence"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-300 transition-colors block">
                    AI Triage &amp; Copilot
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Token Telemetry &amp; Latency →
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{health.aiServices}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Admin Activity Logs Preview */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                  Recent Platform Admin Activity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('audit-logs')}
                className="text-xs font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No recent admin activity recorded yet.
                </div>
              ) : (
                recentLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 mt-0.5">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {log.action}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            by {log.actor}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-300 truncate mt-0.5">
                          {log.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 mt-1">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Operations Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-slate-700/60 dark:border-white/10">
            <button
              type="button"
              onClick={() => onNavigateTab('roles')}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-slate-700/60 dark:border-white/10 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1 text-violet-400 group-hover:text-violet-300">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Role Matrix</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Configure 4 role levels &amp; permissions
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-slate-700/60 dark:border-white/10 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1 text-cyan-400 group-hover:text-cyan-300">
                <Sliders className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">System Settings</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                SLA thresholds, categories, &amp; toggles
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('audit-logs')}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-slate-700/60 dark:border-white/10 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1 text-teal-400 group-hover:text-teal-300">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Audit Trail</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Read-only logs for SOC2 compliance
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('ai-telemetry')}
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-cyan-500/20 hover:border-cyan-400/50 text-left transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,240,255,0.05)]"
            >
              <div className="flex items-center gap-2 mb-1 text-cyan-400 group-hover:text-cyan-300">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">AI Telemetry</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Live token metrics, latency, &amp; logs
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
