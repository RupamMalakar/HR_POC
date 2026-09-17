import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldCheck, User, Sparkles, KeyRound, ArrowRight, Lock, Building2, Split, CheckCircle2 } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, demoLogin, isLoading } = useAuth();

  // Detect current server port or query param to default to appropriate portal
  const isEmployeePort = typeof window !== 'undefined' && (
    window.location.port === '5174' ||
    window.location.port === '3000' ||
    new URLSearchParams(window.location.search).get('portal') === 'employee'
  );

  const [activePortalTab, setActivePortalTab] = useState<'hr' | 'employee'>(
    isEmployeePort ? 'employee' : 'hr'
  );

  const [email, setEmail] = useState(
    isEmployeePort ? 'alex.johnson@enterprise.internal' : 'sarah.jenkins@enterprise.internal'
  );
  const [password, setPassword] = useState('SecretPassword123!');
  const [error, setError] = useState<string | null>(null);

  // When tab changes, update default email
  const handleTabSwitch = (tab: 'hr' | 'employee') => {
    setActivePortalTab(tab);
    setError(null);
    if (tab === 'employee') {
      setEmail('alex.johnson@enterprise.internal');
    } else {
      setEmail('sarah.jenkins@enterprise.internal');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check credentials.');
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setError(null);
    await demoLogin(role);
  };

  const currentPort = typeof window !== 'undefined' ? (window.location.port || '80') : '5173';
  const otherPort = currentPort === '5174' ? '5173' : '5174';
  const otherPortLabel = currentPort === '5174' ? 'HR Operations Cockpit (:5173)' : 'Employee Self-Service (:5174)';

  return (
    <div className={`relative min-h-screen w-screen overflow-hidden flex items-center justify-center p-4 transition-colors duration-500 ${
      activePortalTab === 'employee' ? 'bg-slate-900 text-slate-100' : 'bg-[#050713] text-slate-100'
    }`}>
      {/* Dynamic ambient spatial gradient blobs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
        activePortalTab === 'employee' ? 'bg-teal-500/15' : 'bg-cyan-500/15'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
        activePortalTab === 'employee' ? 'bg-emerald-500/15' : 'bg-indigo-500/15'
      }`} />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#0a0f26]/85 backdrop-blur-2xl border border-white/15 p-7 sm:p-8 shadow-2xl">
        
        {/* Portal Type Switcher Tabs */}
        <div className="flex rounded-xl bg-white/[0.06] border border-white/10 p-1 mb-6">
          <button
            type="button"
            onClick={() => handleTabSwitch('hr')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activePortalTab === 'hr'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>HR Operations</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('employee')}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activePortalTab === 'employee'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Employee Portal</span>
          </button>
        </div>

        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-3 ring-1 ring-white/20 transition-all ${
            activePortalTab === 'employee'
              ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-teal-500/25'
              : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-cyan-500/25'
          }`}>
            {activePortalTab === 'employee' ? (
              <Building2 className="w-7 h-7 text-white" />
            ) : (
              <Sparkles className="w-7 h-7 text-white" />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
              {activePortalTab === 'employee' ? 'Employee Self-Service Desk' : 'Enterprise HR Operations'}
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1 max-w-xs">
            {activePortalTab === 'employee'
              ? 'Submit inquiries, apply for leave, and view live benefits & payslips'
              : 'Autonomous triage, approvals, deliverables, and service desk operations'}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-emerald-300/90">
              Live Server on Port {currentPort}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Instant Quick Role Demo */}
        <div className="mb-6">
          <div className="text-center mb-2.5">
            <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
              activePortalTab === 'employee'
                ? 'text-teal-300 bg-teal-950/40 border-teal-500/30'
                : 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30'
            }`}>
              1-Click Instant Sign In
            </span>
          </div>

          {activePortalTab === 'employee' ? (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-teal-400/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/15 text-teal-400 group-hover:bg-teal-500/25">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Alex Johnson</div>
                    <div className="text-[10px] text-white/50">Senior Staff Engineer (Platform)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-teal-300 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/25">
                  Sign In →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('EMPLOYEE')}
                className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-emerald-400/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Rupam Sharma</div>
                    <div className="text-[10px] text-white/50">Senior Software Engineer (Cloud)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25">
                  Sign In →
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('HR_ADMIN')}
                className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-cyan-400/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 group-hover:bg-cyan-500/25">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Sarah Jenkins</div>
                    <div className="text-[10px] text-white/50">HR Administrator (Full Cockpit)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/25">
                  Sign In →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('HR_SPECIALIST')}
                className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-purple-400/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">David Chen</div>
                    <div className="text-[10px] text-white/50">HR Specialist (Triage & Reviews)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-400/25">
                  Sign In →
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0a0f26] px-2 text-white/40 font-mono">
              Or sign in with password
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono text-white/70 mb-1 uppercase tracking-wider">
              {activePortalTab === 'employee' ? 'Work Email / Employee ID' : 'HR Admin Email'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
              placeholder={activePortalTab === 'employee' ? 'alex.johnson@enterprise.internal' : 'sarah.jenkins@enterprise.internal'}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/70 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 py-2.5 px-4 rounded-xl text-white font-medium text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
              activePortalTab === 'employee'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-teal-500/25'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25'
            }`}
          >
            {isLoading ? (
              <span className="animate-spin text-lg">◌</span>
            ) : (
              <>
                <span>Sign In to {activePortalTab === 'employee' ? 'Employee Portal' : 'HR Cockpit'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & cross-server links */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <a
            href={`http://localhost:${otherPort}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span>Open {otherPortLabel}</span>
            <ArrowRight className="w-3 h-3" />
          </a>

          <a
            href="?view=split"
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 bg-cyan-500/10 px-2 py-1 rounded-lg border border-cyan-500/20"
            title="Open side-by-side split screen to test both portals simultaneously"
          >
            <Split className="w-3.5 h-3.5" />
            <span>Dual Split View</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
