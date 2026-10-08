import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { useAdminToast } from './AdminToast';
import {
  Shield,
  User,
  Mail,
  Building,
  Key,
  Clock,
  Save,
  Loader2,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { user, loginAsUser } = useAuth();
  const { showToast } = useAdminToast();

  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [department, setDepartment] = useState(user?.department || 'HR Operations');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await adminService.updateAdminUser(user.id, {
        name: name.trim(),
        department: department.trim()
      });
      showToast('Admin profile details updated successfully.', 'success');
      // Refresh local auth state
      await loginAsUser(user.id);
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc = user?.avatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80';

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={avatarSrc}
            alt={user?.name || 'Admin'}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/50 shadow-lg"
          />
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight truncate">
                {user?.name || 'Sarah Jenkins'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ROOT ADMINISTRATOR
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400 truncate">
              {user?.email || 'sarah.jenkins@enterprise.internal'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">ID: {user?.id || 'HR001'}</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Security Tier {user?.securityLevel || 3}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">STATUS: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md space-y-5">
        <div className="pb-3 border-b border-slate-700/60 dark:border-white/10">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Administrative Identity Details
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Update your public administrative contact and division attributes.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-slate-700 dark:border-white/15 focus:border-violet-500 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">DEPARTMENT / DIVISION</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-white/5 border border-slate-700 dark:border-white/15 focus:border-violet-500 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">EMAIL ADDRESS (READ-ONLY)</label>
              <input
                type="email"
                disabled
                value={user?.email || 'sarah.jenkins@enterprise.internal'}
                className="w-full h-10 px-3.5 rounded-xl bg-black/30 border border-slate-800 dark:border-white/5 text-xs text-slate-400 font-mono outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">SYSTEM ROLE BOUNDARY</label>
              <input
                type="text"
                disabled
                value="ADMIN (System Administrator)"
                className="w-full h-10 px-3.5 rounded-xl bg-black/30 border border-slate-800 dark:border-white/5 text-xs text-violet-400 font-mono outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-950/50 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Clearance & SOC2 Audit Information */}
      <div className="p-6 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60 dark:border-white/10">
          <Lock className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Security &amp; Session Credentials
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Authentication</span>
            <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bearer Token Verified</span>
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Admin Session</span>
            <p className="font-semibold text-slate-900 dark:text-white font-mono">Port 8000 Sync</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Audit Scope</span>
            <p className="font-semibold text-violet-400 font-mono">Full Ledger Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};
