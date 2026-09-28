import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';
import { DeliverableItem, DeliverableStatus, RequestItem } from '../../types/hr';
import { DeliverableDrawer } from '../modals/DeliverableDrawer';
import { CreateDeliverableModal } from '../modals/CreateDeliverableModal';

interface DeliverablesViewProps {
  deliverables: DeliverableItem[];
  requests?: RequestItem[];
  onApprove?: (id: string) => void;
  onUpdateDeliverable?: (id: string, updates: Partial<DeliverableItem>) => Promise<any>;
  onSendDeliverable?: (id: string) => Promise<any>;
  onCreateDeliverable?: (deliv: Partial<DeliverableItem>) => Promise<any>;
  onNavigateToRequest?: (requestId: string) => void;
}

type FilterTab = 'all' | 'needs_review' | 'drafts' | 'ready' | 'sent';

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({
  deliverables = [],
  requests = [],
  onApprove,
  onUpdateDeliverable,
  onSendDeliverable,
  onCreateDeliverable,
  onNavigateToRequest
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeliverable, setSelectedDeliverable] = useState<DeliverableItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Real Counts from the active dataset
  const counts = useMemo(() => {
    return {
      all: deliverables.length,
      needs_review: deliverables.filter(d => d.status === 'NEEDS_REVIEW' || d.status === 'AI_GENERATED').length,
      drafts: deliverables.filter(d => d.status === 'EDITED' || d.status === 'AI_GENERATED').length,
      ready: deliverables.filter(d => d.status === 'READY').length,
      sent: deliverables.filter(d => d.status === 'SENT').length
    };
  }, [deliverables]);

  // Filtered deliverables
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter(d => {
      // Tab filter
      if (activeFilter === 'needs_review' && d.status !== 'NEEDS_REVIEW' && d.status !== 'AI_GENERATED') {
        return false;
      }
      if (activeFilter === 'drafts' && d.status !== 'EDITED' && d.status !== 'AI_GENERATED') {
        return false;
      }
      if (activeFilter === 'ready' && d.status !== 'READY') {
        return false;
      }
      if (activeFilter === 'sent' && d.status !== 'SENT') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (d.title || '').toLowerCase().includes(q);
        const matchType = (d.type || '').toLowerCase().includes(q);
        const matchReq = (d.requestId || '').toLowerCase().includes(q);
        const matchEmp = (d.employeeName || '').toLowerCase().includes(q);
        const matchContent = (d.content || '').toLowerCase().includes(q);
        return matchTitle || matchType || matchReq || matchEmp || matchContent;
      }

      return true;
    });
  }, [deliverables, activeFilter, searchQuery]);

  const getStatusBadge = (st: DeliverableStatus) => {
    switch (st) {
      case 'NEEDS_REVIEW':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'AI_GENERATED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'EDITED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'READY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'SENT':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'ARCHIVED':
        return 'bg-white/10 text-white/50 border-white/10';
      default:
        return 'bg-white/10 text-white/70 border-white/15';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HR Communication':
      case 'Employee Notice':
        return <Send className="w-3.5 h-3.5 text-blue-400" />;
      case 'Policy Analysis':
      case 'Policy Comparison':
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Case Summary':
      case 'Investigation Summary':
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* Workspace Header */}
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="font-display text-xl font-bold text-white tracking-tight">
              HR DELIVERABLES
            </h1>
          </div>
          <p className="text-xs text-white/50">
            Review and manage AI-generated HR work before dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deliverable</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills with Real Counts */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setActiveFilter('needs_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'needs_review'
                ? 'bg-amber-500 text-black font-bold shadow-sm'
                : 'text-amber-300/80 hover:text-amber-200'
            }`}
          >
            <span>Needs Review</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeFilter === 'needs_review' ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'}`}>
              {counts.needs_review}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('drafts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'drafts'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Drafts ({counts.drafts})
          </button>
          <button
            onClick={() => setActiveFilter('ready')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'ready'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Ready ({counts.ready})
          </button>
          <button
            onClick={() => setActiveFilter('sent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'sent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Sent ({counts.sent})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deliverables..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Enterprise Output Workspace Table */}
      <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 font-mono uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Related Request</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created / Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDeliverables.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-30 text-white" />
                    <span>No deliverables found matching the current filter.</span>
                  </td>
                </tr>
              ) : (
                filteredDeliverables.map((deliv) => {
                  const createdDate = new Date(deliv.createdAt);
                  const isToday = createdDate.toDateString() === new Date().toDateString();
                  const timeFormatted = isToday
                    ? `Today · ${createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : createdDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <tr
                      key={deliv.id}
                      onClick={() => setSelectedDeliverable(deliv)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      {/* TYPE */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10">
                            {getTypeIcon(deliv.type)}
                          </span>
                          <span className="font-mono text-[11px] text-white/80 font-medium">
                            {deliv.type}
                          </span>
                        </div>
                      </td>

                      {/* TITLE */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-md">
                          <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {deliv.title}
                          </h4>
                          <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">
                            {deliv.contentPreview || deliv.content.substring(0, 100)}
                          </p>
                        </div>
                      </td>

                      {/* RELATED REQUEST */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {deliv.requestId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
                              {deliv.requestId}
                            </span>
                            {deliv.employeeName && (
                              <span className="text-[11px] text-white/50 hidden md:inline">
                                ({deliv.employeeName})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/30 font-mono">—</span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border ${getStatusBadge(
                            deliv.status
                          )}`}
                        >
                          {deliv.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* CREATED */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-white/50 text-[11px]">
                        {timeFormatted}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="inline-flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setSelectedDeliverable(deliv)}
                            className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-xs transition-colors cursor-pointer"
                          >
                            Open
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right-Side Deliverable Detail Drawer */}
      {selectedDeliverable && (
        <DeliverableDrawer
          deliverable={selectedDeliverable}
          onClose={() => setSelectedDeliverable(null)}
          onUpdate={async (id, updates) => {
            if (onUpdateDeliverable) {
              const updated = await onUpdateDeliverable(id, updates);
              if (updated) setSelectedDeliverable(updated);
            }
          }}
          onSend={async (id) => {
            if (onSendDeliverable) {
              const sent = await onSendDeliverable(id);
              if (sent) setSelectedDeliverable(sent);
            }
          }}
          onNavigateToRequest={(reqId) => {
            setSelectedDeliverable(null);
            if (onNavigateToRequest) onNavigateToRequest(reqId);
          }}
        />
      )}

      {/* Create Deliverable Modal */}
      <CreateDeliverableModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        requests={requests}
        onCreate={async (deliv) => {
          if (onCreateDeliverable) {
            await onCreateDeliverable(deliv);
          }
        }}
      />
    </div>
  );
};
