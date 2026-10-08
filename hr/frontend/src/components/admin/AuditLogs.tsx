import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services/adminService';
import { AdminAuditLog } from '../../types/admin';
import { AdminDataTable, Column } from './AdminDataTable';
import { SearchFilterBar, FilterGroup } from './SearchFilterBar';
import { useAdminToast } from './AdminToast';
import {
  FileText,
  ShieldCheck,
  Download,
  RefreshCw,
  Calendar,
  Lock,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const { showToast } = useAdminToast();
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getAdminAuditLogs({ limit: 100 });
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch audit log trail');
      showToast(err.message || 'Audit log retrieval failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter groups
  const actionsList = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => l.action && set.add(l.action));
    return Array.from(set);
  }, [logs]);

  const actorsList = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => l.actor && set.add(l.actor));
    return Array.from(set);
  }, [logs]);

  const filterGroups: FilterGroup[] = [
    {
      id: 'action',
      label: 'Action',
      value: actionFilter,
      onChange: setActionFilter,
      options: [
        { label: 'All Actions', value: 'all' },
        ...actionsList.map((a) => ({ label: a, value: a }))
      ]
    },
    {
      id: 'actor',
      label: 'Actor',
      value: actorFilter,
      onChange: setActorFilter,
      options: [
        { label: 'All Actors', value: 'all' },
        ...actorsList.map((act) => ({ label: act, value: act }))
      ]
    }
  ];

  // Client filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = (l.description || '').toLowerCase().includes(q);
        const matchesActor = (l.actor || '').toLowerCase().includes(q);
        const matchesAction = (l.action || '').toLowerCase().includes(q);
        const matchesResource = (l.resourceId || '').toLowerCase().includes(q);
        if (!matchesDesc && !matchesActor && !matchesAction && !matchesResource) return false;
      }
      if (actionFilter !== 'all' && l.action !== actionFilter) return false;
      if (actorFilter !== 'all' && l.actor !== actorFilter) return false;
      return true;
    });
  }, [logs, searchQuery, actionFilter, actorFilter]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredLogs.length === 0) {
      showToast('No logs available to export.', 'warning');
      return;
    }
    const headers = ['Timestamp', 'Actor', 'Actor ID', 'Action', 'Resource', 'Resource ID', 'Description', 'Status', 'IP'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorId}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.resourceId}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.ip || '127.0.0.1'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit trail exported successfully as CSV.', 'success');
  };

  // Columns definition
  const columns: Column<AdminAuditLog>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      className: 'font-mono text-slate-400 whitespace-nowrap text-[11px]',
      render: (l) => (
        <div>
          <span className="text-slate-900 dark:text-white font-medium block">
            {new Date(l.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-slate-400 text-[10px]">
            {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      )
    },
    {
      key: 'actor',
      header: 'Admin / Actor',
      sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-[10px] font-mono">
            {l.actor?.charAt(0) || 'A'}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-xs truncate">
              {l.actor}
            </span>
            <span className="font-mono text-[10px] text-slate-400 block truncate">
              {l.actorId}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (l) => (
        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
          {l.action}
        </span>
      )
    },
    {
      key: 'resource',
      header: 'Target Resource',
      sortable: true,
      render: (l) => (
        <div>
          <span className="text-xs font-semibold text-slate-900 dark:text-white block">
            {l.resource}
          </span>
          {l.resourceId && (
            <span className="font-mono text-[10px] text-slate-400">
              ID: {l.resourceId}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description & Details',
      className: 'max-w-md',
      render: (l) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
          {l.description}
        </p>
      )
    },
    {
      key: 'status',
      header: 'Result',
      sortable: true,
      render: (l) => (
        <span
          className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border flex items-center gap-1 w-max ${
            l.status === 'SUCCESS'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {l.status === 'SUCCESS' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          ) : (
            <XCircle className="w-3 h-3 text-rose-400" />
          )}
          <span>{l.status}</span>
        </span>
      )
    },
    {
      key: 'ip',
      header: 'Host IP',
      render: (l) => (
        <span className="font-mono text-[10px] text-slate-400">
          {l.ip || '127.0.0.1'}
        </span>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Notice Banner: Immutable SOC2 Logs */}
      <div className="p-4 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Immutable SOC2 &amp; Compliance Audit Trail
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                READ-ONLY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Every user creation, role modification, deactivation, and setting update is cryptographically anchored and preserved.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-700/60 dark:border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search audit records by actor, action, resource, or details..."
        filters={filterGroups}
        actions={
          <button
            type="button"
            onClick={fetchLogs}
            className="h-10 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-700/60 dark:border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            title="Refresh audit logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        }
      />

      {/* Data Table */}
      <AdminDataTable
        columns={columns}
        data={filteredLogs}
        keyExtractor={(l) => l.id}
        isLoading={isLoading}
        error={error}
        emptyMessage="No audit records match the selected search or filter criteria."
        pageSize={15}
      />
    </div>
  );
};
