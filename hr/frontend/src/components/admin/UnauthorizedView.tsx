import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

interface UnauthorizedViewProps {
  requiredRole?: string;
  title?: string;
  message?: string;
  onReturnToPortal?: () => void;
}

export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  requiredRole = 'ADMIN',
  title = 'Access Denied',
  message,
  onReturnToPortal
}) => {
  const { user, logout, userRoles } = useAuth();

  const handleReturn = () => {
    if (onReturnToPortal) {
      onReturnToPortal();
    } else {
      // Default to employee portal or clear query
      const url = new URL(window.location.href);
      url.searchParams.delete('portal');
      if (url.pathname.startsWith('/admin')) {
        url.pathname = '/';
      }
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const displayRoles = userRoles && userRoles.length > 0 ? userRoles.join(', ') : (user?.role || 'EMPLOYEE');

  return (
    <div className="min-h-screen w-screen bg-[#070913] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-md w-full rounded-3xl p-8 bg-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center space-y-5 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
            HTTP 403 FORBIDDEN
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight mt-2">
            {requiredRole === 'ADMIN' ? 'Administrator Access Required' : title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            {message || `Account ${user?.name || 'User'} (${displayRoles}) is not authorized to access this portal or resource.`}
          </p>
        </div>

        <div className="w-full p-3.5 rounded-xl bg-black/40 border border-white/5 text-left text-xs font-mono space-y-1 text-slate-400">
          <div className="flex justify-between">
            <span>Identity:</span>
            <span className="text-slate-200">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Your Assigned Roles:</span>
            <span className="text-amber-400 font-bold">{displayRoles}</span>
          </div>
          <div className="flex justify-between">
            <span>Required Role:</span>
            <span className="text-violet-400 font-bold">{requiredRole}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <button
            type="button"
            onClick={handleReturn}
            className="w-full sm:flex-1 h-11 px-4 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="w-full sm:w-auto h-11 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
