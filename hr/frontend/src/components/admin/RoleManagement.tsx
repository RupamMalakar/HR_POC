import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminRole } from '../../types/admin';
import { useAdminToast } from './AdminToast';
import {
  Shield,
  ShieldCheck,
  Check,
  X,
  Users,
  Save,
  RotateCcw,
  Loader2,
  Info
} from 'lucide-react';

const ALL_SYSTEM_PERMISSIONS = [
  { id: 'manage_users', label: 'User Directory Management', desc: 'Create, edit, and deactivate user accounts' },
  { id: 'manage_roles', label: 'Role & Permission Configuration', desc: 'Assign roles and modify permission boundaries' },
  { id: 'manage_settings', label: 'System Configuration & SLAs', desc: 'Modify global SLA response timers and feature toggles' },
  { id: 'view_audit_logs', label: 'SOC2 Audit Log Inspection', desc: 'Access read-only system audit trails' },
  { id: 'view_reports', label: 'Executive Analytics & Reports', desc: 'Generate and download PDF/CSV compliance digests' },
  { id: 'manage_deliverables', label: 'HR Deliverables & Email Dispatch', desc: 'Draft and dispatch official letters and Gmail replies' },
  { id: 'manage_requests', label: 'Service Request Triage & Lifecycles', desc: 'Review, update, and resolve employee cases' },
  { id: 'view_employee_data', label: 'Confidential Employee Records', desc: 'Inspect compensation, tenure, and department files' },
  { id: 'create_own_requests', label: 'Submit Personal HR Requests', desc: 'File leave, payroll inquiries, and document requests' },
  { id: 'view_own_requests', label: 'Track Own Ticket Lifecycles', desc: 'Monitor personal request waiting times and status' },
  { id: 'view_own_profile', label: 'Access Self-Service Profile', desc: 'Review personal benefits and payslips' },
  { id: 'use_employee_services', label: 'Interactive AI Policy Copilot', desc: 'Consult enterprise handbook and policy assistant' }
];

export const RoleManagement: React.FC = () => {
  const { showToast } = useAdminToast();
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<string>('ADMIN');
  const [editedPermissions, setEditedPermissions] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdminRoles();
      setRoles(data);
      const initialMap: Record<string, string[]> = {};
      data.forEach((r) => {
        initialMap[r.id] = [...r.permissions];
      });
      setEditedPermissions(initialMap);
    } catch (err: any) {
      showToast(err.message || 'Failed to load system roles', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const currentRole = roles.find((r) => r.id === activeRole) || roles[0];
  const currentPermissions = (currentRole && editedPermissions[currentRole.id]) || [];

  const togglePermission = (permId: string) => {
    if (!currentRole) return;
    if (currentRole.id === 'ADMIN' && (permId === 'manage_roles' || permId === 'manage_users')) {
      showToast('Core administrative governance permissions cannot be removed from ADMIN.', 'warning');
      return;
    }

    setEditedPermissions((prev) => {
      const list = prev[currentRole.id] || [];
      const has = list.includes(permId);
      const next = has ? list.filter((p) => p !== permId) : [...list, permId];
      return { ...prev, [currentRole.id]: next };
    });
  };

  const handleSaveRole = async () => {
    if (!currentRole) return;
    setIsSaving(true);
    try {
      const updatedPerms = editedPermissions[currentRole.id] || [];
      await adminService.updateRolePermissions(currentRole.id, updatedPerms);
      showToast(`Role "${currentRole.name}" permissions updated successfully.`, 'success');
      fetchRoles();
    } catch (err: any) {
      showToast(err.message || 'Failed to update role permissions.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!currentRole) return;
    setEditedPermissions((prev) => ({
      ...prev,
      [currentRole.id]: [...(currentRole.permissions || [])]
    }));
    showToast('Permission modifications reverted to server state.', 'info');
  };

  const hasChanges = currentRole && JSON.stringify(editedPermissions[currentRole.id] || []) !== JSON.stringify(currentRole.permissions || []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              Role-Based Access Control (RBAC) Architecture
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed max-w-3xl">
              Inspect and configure granular authorization boundaries. Changes are recorded in immutable audit trails and enforced on all backend API requests.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20">
            4 SYSTEM ROLES
          </span>
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {roles.map((r) => {
          const isSelected = r.id === activeRole;
          const roleBadgeColor = {
            ADMIN: 'from-violet-600/20 to-purple-600/10 border-violet-500/40 text-violet-300',
            HR_LEAD: 'from-indigo-600/20 to-blue-600/10 border-indigo-500/40 text-indigo-300',
            HR_SPECIALIST: 'from-cyan-600/20 to-teal-600/10 border-cyan-500/40 text-cyan-300',
            EMPLOYEE: 'from-slate-600/20 to-zinc-600/10 border-slate-500/40 text-slate-300'
          }[r.id] || 'from-violet-600/20 to-purple-600/10 border-violet-500/40 text-violet-300';

          return (
            <div
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md bg-gradient-to-br ${
                isSelected
                  ? `${roleBadgeColor} shadow-lg shadow-violet-950/20 ring-1 ring-violet-500/30`
                  : 'border-slate-700/60 dark:border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-white">
                  {r.id}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <Users className="w-3.5 h-3.5" />
                  <span>{r.userCount} users</span>
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                {r.name}
              </p>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {r.description}
              </p>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-violet-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Permission Matrix for Selected Role */}
      {currentRole && (
        <div className="rounded-2xl p-5 bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Permission Matrix: {currentRole.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle capabilities granted to accounts with this role.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-xs text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revert</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveRole}
                disabled={isSaving || !hasChanges}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/50 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Permissions</span>
              </button>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ALL_SYSTEM_PERMISSIONS.map((perm) => {
              const isGranted = currentPermissions.includes(perm.id);
              const isLocked = currentRole.id === 'ADMIN' && (perm.id === 'manage_roles' || perm.id === 'manage_users');

              return (
                <div
                  key={perm.id}
                  onClick={() => !isLocked && togglePermission(perm.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 select-none ${
                    isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-violet-500/40'
                  } ${
                    isGranted
                      ? 'bg-violet-500/10 border-violet-500/30'
                      : 'bg-white/[0.02] border-slate-800 dark:border-white/5 opacity-60'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {perm.label}
                      </span>
                      {isLocked && (
                        <span className="text-[9px] font-mono text-violet-400 bg-violet-500/20 px-1.5 rounded">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-300 leading-snug">
                      {perm.desc}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 mt-0.5 transition-colors ${
                      isGranted
                        ? 'bg-violet-600 border-violet-500 text-white shadow-sm'
                        : 'border-slate-600 bg-black/20 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
