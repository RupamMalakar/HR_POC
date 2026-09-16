import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [modelTemp, setModelTemp] = useState('0.2');
  const [autoRouteThreshold, setAutoRouteThreshold] = useState('92');
  const [enableSlackSync, setEnableSlackSync] = useState(true);
  const [enableEmailDigest, setEnableEmailDigest] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-4xl">
      <div className="rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass specular-border">
        <h2 className="font-display text-xl font-bold text-white tracking-tight mb-1">
          System &amp; AI Engine Configuration
        </h2>
        <p className="text-xs text-white/50 mb-6">
          Fine-tune vector search confidence margins, auto-dispatch triggers, and appearance preferences.
        </p>

        <div className="space-y-6">
          {/* Interface Appearance Theme */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
            <h3 className="text-xs font-mono uppercase text-cyan-300 font-semibold tracking-wider">
              Spatial Interface Appearance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white/10 border-cyan-400 text-white shadow-neon-cyan'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[22px] text-cyan-300">dark_mode</span>
                  <div>
                    <span className="text-xs font-bold block">Deep Spatial Dark (Obsidian)</span>
                    <span className="text-[11px] text-white/40 font-mono">Neon accents &amp; dark frosted glass</span>
                  </div>
                </div>
                {theme === 'dark' && <span className="material-symbols-outlined text-cyan-300 text-[18px]">check_circle</span>}
              </button>

              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-sky-500/15 border-sky-400 text-slate-900 shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[22px] text-amber-500">light_mode</span>
                  <div>
                    <span className="text-xs font-bold block">Crystalline Frosted Light</span>
                    <span className="text-[11px] text-white/40 font-mono">Pearl canvas &amp; soft ambient glows</span>
                  </div>
                </div>
                {theme === 'light' && <span className="material-symbols-outlined text-sky-500 text-[18px]">check_circle</span>}
              </button>
            </div>
          </div>

          {/* AI Settings */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-cyan-300 font-semibold tracking-wider">
              Autonomous AI Triage Engine
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Confidence Threshold for Auto-Routing (%):
                </label>
                <input
                  type="number"
                  value={autoRouteThreshold}
                  onChange={(e) => setAutoRouteThreshold(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Model Generation Temperature:
                </label>
                <input
                  type="text"
                  value={modelTemp}
                  onChange={(e) => setModelTemp(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-purple-300 font-semibold tracking-wider">
              Integrations &amp; Telemetry
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">Slack HR Incident Channel Mirroring</span>
                  <span className="text-[11px] text-white/40">Posts high-priority ticket alerts into #hr-leads-urgent</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableSlackSync}
                  onChange={(e) => setEnableSlackSync(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">Daily SLA &amp; Autonomous Digest</span>
                  <span className="text-[11px] text-white/40">Email overnight triage metrics report at 08:00 AM</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableEmailDigest}
                  onChange={(e) => setEnableEmailDigest(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            {saved && (
              <span className="text-xs font-mono text-emerald-300 animate-fadeIn">
                Settings saved successfully!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-neon-cyan transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
