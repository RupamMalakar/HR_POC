import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AdminSettings } from '../../types/admin';
import { useAdminToast } from './AdminToast';
import {
  Sliders,
  Clock,
  Tag,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Radio,
  Bell,
  FileBarChart
} from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { showToast } = useAdminToast();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Local editable draft state
  const [standardSla, setStandardSla] = useState<number>(24);
  const [highPrioSla, setHighPrioSla] = useState<number>(12);
  const [sensitiveSla, setSensitiveSla] = useState<number>(4);
  const [categories, setCategories] = useState<{ id: string; name: string; enabled: boolean }[]>([]);
  const [features, setFeatures] = useState<{
    aiCopilot: boolean;
    aiTriage: boolean;
    reports: boolean;
    notifications: boolean;
    realtimeSse: boolean;
  }>({
    aiCopilot: true,
    aiTriage: true,
    reports: true,
    notifications: true,
    realtimeSse: true
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAdminSettings();
      setSettings(data);
      if (data.slaSettings) {
        setStandardSla(data.slaSettings.standardHours);
        setHighPrioSla(data.slaSettings.highPriorityHours);
        setSensitiveSla(data.slaSettings.sensitiveCaseHours);
      }
      if (data.ticketCategories) {
        setCategories(data.ticketCategories);
      }
      if (data.featureToggles) {
        setFeatures(data.featureToggles);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load system settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleCategory = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleToggleFeature = (key: keyof typeof features) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await adminService.updateAdminSettings({
        slaSettings: {
          standardHours: Number(standardSla),
          highPriorityHours: Number(highPrioSla),
          sensitiveCaseHours: Number(sensitiveSla)
        },
        ticketCategories: categories,
        featureToggles: features
      });
      setSettings(updated.settings);
      showToast('System configuration & SLA settings updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update system settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!settings) return;
    setStandardSla(settings.slaSettings.standardHours);
    setHighPrioSla(settings.slaSettings.highPriorityHours);
    setSensitiveSla(settings.slaSettings.sensitiveCaseHours);
    setCategories(settings.ticketCategories);
    setFeatures(settings.featureToggles);
    showToast('Reset settings to current server state.', 'info');
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin text-violet-400" />
        <span className="font-mono text-xs">LOADING SYSTEM CONFIGURATION...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header Bar with Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-violet-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Enterprise System Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Configure global SLA response targets, enabled ticket categories, and platform feature flags.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-slate-700/60 dark:border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-950/50 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Section A: SLA Thresholds */}
      <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60 dark:border-white/10">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            A. Service Level Agreement (SLA) Thresholds
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Standard SLA */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Standard Request SLA</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              General inquiries, leave applications, documents.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="1"
                max="120"
                value={standardSla}
                onChange={(e) => setStandardSla(Number(e.target.value))}
                className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-slate-700 dark:border-white/15 text-xs text-white font-mono text-center outline-none focus:border-violet-500"
              />
              <span className="text-xs font-mono text-slate-400">hours</span>
            </div>
          </div>

          {/* High Priority SLA */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">High Priority SLA</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Payroll discrepancies, urgent leave, escalated issues.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="1"
                max="72"
                value={highPrioSla}
                onChange={(e) => setHighPrioSla(Number(e.target.value))}
                className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-slate-700 dark:border-white/15 text-xs text-white font-mono text-center outline-none focus:border-violet-500"
              />
              <span className="text-xs font-mono text-slate-400">hours</span>
            </div>
          </div>

          {/* Sensitive Case SLA */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-slate-800 dark:border-white/5 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Sensitive Case SLA</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Harassment, grievances, legal or compliance flags.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="1"
                max="24"
                value={sensitiveSla}
                onChange={(e) => setSensitiveSla(Number(e.target.value))}
                className="w-20 h-9 px-2 rounded-lg bg-black/40 border border-slate-700 dark:border-white/15 text-xs text-white font-mono text-center outline-none focus:border-violet-500"
              />
              <span className="text-xs font-mono text-slate-400">hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: Ticket Categories */}
      <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60 dark:border-white/10">
          <Tag className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            B. Inbound Request Categories
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleToggleCategory(cat.id)}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                cat.enabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-900 dark:text-white'
                  : 'bg-white/[0.02] border-slate-800 dark:border-white/5 opacity-50 text-slate-400'
              }`}
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold block truncate">{cat.name}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">{cat.id}</span>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  cat.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    cat.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section C: Feature Toggles */}
      <div className="p-5 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60 dark:border-white/10">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            C. Platform Engine &amp; Feature Flags
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { key: 'aiCopilot' as const, label: 'AI Policy Copilot', desc: 'RAG policy grounded assistant for HR & employees', icon: <Sparkles className="w-4 h-4 text-violet-400" /> },
            { key: 'aiTriage' as const, label: 'Autonomous AI Triage', desc: 'Classification and intent routing engine', icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" /> },
            { key: 'reports' as const, label: 'Reports & Export Engine', desc: 'PDF, CSV, and compliance data exports', icon: <FileBarChart className="w-4 h-4 text-emerald-400" /> },
            { key: 'notifications' as const, label: 'Live Notifications', desc: 'In-app ticket lifecycle activity updates', icon: <Bell className="w-4 h-4 text-amber-400" /> },
            { key: 'realtimeSse' as const, label: 'Real-time SSE Push', desc: 'Server-Sent Events synchronization stream', icon: <Radio className="w-4 h-4 text-rose-400" /> }
          ].map((item) => {
            const isEnabled = features[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleToggleFeature(item.key)}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer select-none ${
                  isEnabled
                    ? 'bg-violet-500/10 border-violet-500/30'
                    : 'bg-white/[0.02] border-slate-800 dark:border-white/5 opacity-50'
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                </div>

                <div
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 flex-shrink-0 mt-0.5 ${
                    isEnabled ? 'bg-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
