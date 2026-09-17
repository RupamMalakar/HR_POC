import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldCheck, User, Sparkles, KeyRound, ArrowRight, Lock } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('sarah.jenkins@enterprise.internal');
  const [password, setPassword] = useState('SecretPassword123!');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setError(null);
    await demoLogin(role);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center p-4 bg-[#050713]">
      {/* Dynamic ambient spatial gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-[#090d24]/80 backdrop-blur-2xl border border-white/15 p-8 shadow-2xl specular-border">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4 ring-1 ring-white/20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Enterprise HR AI
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              v3.4
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1 max-w-xs">
            Autonomous Triage, Policy Grounding & Dual Portal Experience
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
              Work Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
                placeholder="name@enterprise.internal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="animate-spin text-lg">◌</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Fast Role-Based 1-Click Demo Logins */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400/80 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20">
              1-Click Instant Role Demo
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('HR_ADMIN')}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/40 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Sarah Jenkins</div>
                  <div className="text-[10px] text-white/50">HR Administrator (Full Cockpit)</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20">
                HR Portal →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('HR_SPECIALIST')}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/40 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">David Chen</div>
                  <div className="text-[10px] text-white/50">HR Specialist (Reviews & Approvals)</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-400/20">
                HR Portal →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('EMPLOYEE')}
              className="w-full p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/40 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Alex Johnson</div>
                  <div className="text-[10px] text-white/50">Employee / User (Self-Service)</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/20">
                User Portal →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
