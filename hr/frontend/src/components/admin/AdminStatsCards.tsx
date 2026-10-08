import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Inbox,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { AdminStats } from '../../types/admin';

interface AdminStatsCardsProps {
  stats: AdminStats | null;
  isLoading?: boolean;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      id: 'total-users',
      label: 'Total Users',
      value: stats ? stats.totalUsers : 0,
      icon: <Users className="w-5 h-5 text-violet-400" />,
      tag: 'DIRECTORY',
      tagColor: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
      gradient: 'from-violet-500/15 via-purple-500/5 to-transparent'
    },
    {
      id: 'active-users',
      label: 'Active Users',
      value: stats ? stats.activeUsers : 0,
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      tag: 'ONLINE / ACTIVE',
      tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent'
    },
    {
      id: 'inactive-users',
      label: 'Inactive Users',
      value: stats ? stats.inactiveUsers : 0,
      icon: <UserX className="w-5 h-5 text-slate-400" />,
      tag: 'DEACTIVATED',
      tagColor: 'text-slate-300 bg-slate-500/10 border-slate-500/20',
      gradient: 'from-slate-500/15 via-zinc-500/5 to-transparent'
    },
    {
      id: 'total-requests',
      label: 'Total Requests',
      value: stats ? stats.totalRequests : 0,
      icon: <Inbox className="w-5 h-5 text-blue-400" />,
      tag: 'ALL CASES',
      tagColor: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
      gradient: 'from-blue-500/15 via-indigo-500/5 to-transparent'
    },
    {
      id: 'open-requests',
      label: 'Open Requests',
      value: stats ? stats.openRequests : 0,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      tag: 'ACTIVE QUEUE',
      tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
      gradient: 'from-amber-500/15 via-orange-500/5 to-transparent'
    },
    {
      id: 'resolved-requests',
      label: 'Resolved Requests',
      value: stats ? stats.resolvedRequests : 0,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />,
      tag: 'RESOLVED',
      tagColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
      gradient: 'from-teal-500/15 via-emerald-500/5 to-transparent'
    },
    {
      id: 'sla-compliance',
      label: 'SLA Compliance',
      value: stats ? `${stats.slaCompliance.toFixed(1)}%` : '0%',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      tag: 'TARGET 92%',
      tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
      gradient: 'from-cyan-500/15 via-blue-500/5 to-transparent'
    },
    {
      id: 'system-health',
      label: 'System Health',
      value: stats?.systemHealth?.backendApi === 'HEALTHY' ? 'Healthy' : 'Operational',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      tag: 'ALL ENGINES',
      tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-500/15 via-green-500/5 to-transparent'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`relative overflow-hidden rounded-2xl p-4 border border-slate-700/60 dark:border-white/10 bg-gradient-to-br ${card.gradient} bg-white/[0.03] dark:bg-slate-900/40 backdrop-blur-md shadow-sm transition-all duration-200 hover:border-slate-500 dark:hover:border-white/20 hover:-translate-y-0.5 group`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-white/10 dark:bg-black/30 border border-slate-700/40 dark:border-white/10 shadow-inner group-hover:scale-105 transition-transform">
              {card.icon}
            </div>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${card.tagColor}`}>
              {card.tag}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-white/50 uppercase tracking-wider block">
              {card.label}
            </span>
            <div className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              {isLoading ? (
                <div className="h-7 w-16 bg-white/10 rounded animate-pulse my-0.5" />
              ) : (
                card.value
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
