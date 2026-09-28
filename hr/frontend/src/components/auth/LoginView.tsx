import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HR_USERS, EMPLOYEE_USERS } from '../../data/mockUsers';
import {
  ShieldCheck,
  User,
  ArrowRight,
  Lock,
  Building2,
  Split,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Check,
  Briefcase
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, loginAsUser, isLoading } = useAuth();

  // Detect current server port or query param to default to appropriate portal
  const isEmployeePort = typeof window !== 'undefined' && (
    window.location.port === '5174' ||
    window.location.port === '3000' ||
    new URLSearchParams(window.location.search).get('portal') === 'employee'
  );

  const [activePortalTab, setActivePortalTab] = useState<'hr' | 'employee'>(
    isEmployeePort ? 'employee' : 'hr'
  );

  // Sign In credentials state
  const [email, setEmail] = useState(
    isEmployeePort ? 'alex.johnson@enterprise.internal' : 'sarah.jenkins@enterprise.internal'
  );
  const [password, setPassword] = useState('SecretPassword123!');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign Up form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDepartment, setSignupDepartment] = useState('');
  const [signupRole, setSignupRole] = useState('');
  const [signupUserType, setSignupUserType] = useState<'EMPLOYEE' | 'HR'>('EMPLOYEE');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);

  // Memoized user personas for instant access
  const activePersonas = useMemo(() => {
    return activePortalTab === 'employee' ? EMPLOYEE_USERS : HR_USERS;
  }, [activePortalTab]);

  const handlePortalSwitch = useCallback((tab: 'hr' | 'employee') => {
    setActivePortalTab(tab);
    setError(null);
    setSuccessMsg(null);
    if (tab === 'employee') {
      setEmail('alex.johnson@enterprise.internal');
    } else {
      setEmail('sarah.jenkins@enterprise.internal');
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setSuccessMsg(null);

    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please verify your credentials.');
    }
  };

  const handleSelectPersona = async (userId: string) => {
    if (isLoading) return;
    setError(null);
    setSuccessMsg(null);

    try {
      await loginAsUser(userId);
    } catch (err: any) {
      setError(err.message || 'Persona switch failed');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmittingSignup(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim(),
          department: signupDepartment.trim(),
          role: signupRole.trim(),
          userType: signupUserType,
          password: signupPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Signup failed.');
      }

      setIsSignUp(false);
      setEmail(signupEmail.trim());
      setPassword(signupPassword);
      setSuccessMsg('Account created successfully! You can now sign in.');

      // Reset signup fields
      setSignupName('');
      setSignupEmail('');
      setSignupDepartment('');
      setSignupRole('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmittingSignup(false);
    }
  };

  const currentPort = typeof window !== 'undefined' ? (window.location.port || '80') : '5173';
  const otherPort = currentPort === '5174' ? '5173' : '5174';
  const otherPortLabel = currentPort === '5174' ? 'HR Operations Cockpit (:5173)' : 'Employee Self-Service (:5174)';

  return (
    <div className="min-h-screen w-screen bg-[#050713] text-slate-100 flex items-center justify-center p-3 sm:p-6 overflow-y-auto selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Lightweight background ambient glow without heavy filter lag */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 transition-all duration-700 ${
          activePortalTab === 'employee'
            ? 'bg-gradient-to-br from-teal-500/30 to-emerald-500/10'
            : 'bg-gradient-to-br from-cyan-500/30 to-blue-600/10'
        }`} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 bg-gradient-to-tl from-purple-600/30 to-indigo-600/10" />
      </div>

      {/* Main Dual-Column Authentication Container */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-[#090d20]/95 border border-white/10 shadow-2xl overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12 transform-gpu">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: System Identity & Instant Demo Persona Access (5 cols)*/}
        {/* ================================================================= */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between gap-6">
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
                activePortalTab === 'employee'
                  ? 'bg-gradient-to-tr from-teal-500 to-emerald-500 text-white shadow-teal-500/20'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/20'
              }`}>
                {activePortalTab === 'employee' ? (
                  <Building2 className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h1 className="font-display text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  {activePortalTab === 'employee' ? 'Employee Self-Service' : 'HR Operations Cockpit'}
                </h1>
                <p className="text-[11px] font-mono text-cyan-300/80">Enterprise AI Ecosystem</p>
              </div>
            </div>

            {/* Portal Switcher Tabs */}
            <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 mb-6">
              <button
                type="button"
                onClick={() => handlePortalSwitch('hr')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activePortalTab === 'hr'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HR Ops</span>
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch('employee')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activePortalTab === 'employee'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Employee</span>
              </button>
            </div>

            {/* Demo Personas Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                1-Click Demo Personas
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                Instant Access
              </span>
            </div>

            {/* Compact Persona List */}
            <div className="space-y-2">
              {activePersonas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSelectPersona(persona.id)}
                  disabled={isLoading}
                  className="w-full p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-400/30 flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      loading="lazy"
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {persona.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                          persona.isHr
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        }`}>
                          {persona.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 truncate">
                        {persona.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded-md bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all shrink-0">
                    Login →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick links & dual split screen option */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <a
              href={`http://localhost:${otherPort}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-mono"
            >
              <span>{otherPortLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </a>

            <a
              href="?view=split"
              className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
              title="Open dual split view"
            >
              <Split className="w-3 h-3" />
              <span>Split View</span>
            </a>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: Interactive Form (Sign In / Sign Up) (7 cols)       */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          
          {/* Segment Tabs: Sign In vs Sign Up */}
          <div className="flex rounded-xl bg-black/40 border border-white/10 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Sign In with Credentials
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Create New Account (Sign Up)
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {!isSignUp ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5 uppercase tracking-wider">
                  {activePortalTab === 'employee' ? 'Work Email or Employee ID' : 'HR Email or Specialist ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activePortalTab === 'employee' ? 'alex.johnson@enterprise.internal' : 'sarah.jenkins@enterprise.internal'}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-white/70 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] font-mono text-white/40">Demo: SecretPassword123!</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activePortalTab === 'employee'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 shadow-teal-500/25'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/25'
                }`}
              >
                {isLoading ? (
                  <span className="animate-spin text-sm">◌ Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to {activePortalTab === 'employee' ? 'Employee Portal' : 'HR Cockpit'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* 2. SIGN UP FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="rachel.adams@enterprise.internal"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={signupDepartment}
                    onChange={(e) => setSignupDepartment(e.target.value)}
                    placeholder="Engineering"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value)}
                    placeholder="Senior Engineer"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Account Type
                  </label>
                  <select
                    value={signupUserType}
                    onChange={(e) => setSignupUserType(e.target.value as 'EMPLOYEE' | 'HR')}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/60"
                  >
                    <option value="EMPLOYEE" className="bg-[#0b0f19]">Employee</option>
                    <option value="HR" className="bg-[#0b0f19]">HR Specialist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingSignup}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                {isSubmittingSignup ? 'Creating Account...' : 'Register Account & Return to Login'}
              </button>
            </form>
          )}

          {/* Security & Multi-User Persistence Notice */}
          <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-white/40 pt-3 border-t border-white/5">
            <span>Security Level: Enterprise Tier-3</span>
            <span>Real-time Port :8000 Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;