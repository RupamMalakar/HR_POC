import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Shield,
  Sliders,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Layers,
  Cpu
} from 'lucide-react';
import { AdminTab } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onSwitchPortal?: (portal: 'hr' | 'employee') => void;
  defaultCollapsed?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onSwitchPortal,
  defaultCollapsed = false
}) => {
  const { user, hasEmployeeRole, hasHrRole } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Admin Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'roles',
      label: 'Role Management',
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: <Sliders className="w-4 h-4" />
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'ai-telemetry',
      label: 'AI Telemetry',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      badge: 'TOKENS'
    },
    {
      id: 'profile',
      label: 'Admin Profile',
      icon: <User className="w-4 h-4" />
    }
  ];

  const handlePortalClick = (target: 'hr' | 'employee') => {
    if (onSwitchPortal) {
      onSwitchPortal(target);
    } else if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.pathname = '/';
      url.searchParams.set('portal', target);
      url.searchParams.delete('tab');
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new Event('portal-navigation'));
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out flex-shrink-0 h-full rounded-2xl bg-white/[0.04] dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-700/60 dark:border-white/10 shadow-glass flex flex-col justify-between z-30 hidden md:flex overflow-x-hidden ${
        isCollapsed ? 'w-20 p-2 overflow-hidden' : 'w-64 p-3'
      }`}
    >
      <div className={`flex flex-col ${isCollapsed ? 'gap-2 overflow-hidden' : 'gap-4 overflow-y-auto pr-1'}`}>
        {/* Brand & Logo Container */}
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2 pb-2 border-b border-white/10' : 'justify-between gap-2 pb-1'}`}>
          <div
            onClick={() => onSelectTab('dashboard')}
            className={`flex items-center rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md cursor-pointer hover:bg-white/[0.08] transition-all ${
              isCollapsed ? 'w-10 h-10 justify-center p-0 mx-auto' : 'gap-3 p-2.5 flex-1'
            }`}
            title="Admin Governance Portal"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden p-1 bg-gradient-to-tr from-violet-600/40 via-purple-500/30 to-fuchsia-400/30 border border-violet-400/30 shadow-inner flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px] text-violet-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
                admin_panel_settings
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Admin Portal
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                </span>
                <span className="text-[10px] font-mono text-violet-400/90 tracking-wider">
                  SECURITY &amp; CONTROL
                </span>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className={`rounded-xl bg-white/[0.03] hover:bg-white/[0.1] border border-slate-700/40 dark:border-white/10 text-slate-400 hover:text-slate-100 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 ${
              isCollapsed ? 'w-10 h-7 mx-auto' : 'p-2'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-violet-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>

        {/* Administration Navigation Items */}
        <div className="flex flex-col">
          {!isCollapsed && (
            <p className="px-3 mb-1.5 font-mono text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-semibold">
              Administration
            </p>
          )}
          <nav className={`flex flex-col ${isCollapsed ? 'gap-1' : 'gap-1.5'}`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`rounded-xl transition-all duration-200 text-left relative group cursor-pointer flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 gap-3'
                  } ${
                    isActive
                      ? 'bg-violet-600/15 border border-violet-500/40 text-violet-300 dark:text-violet-200 shadow-[0_0_15px_rgba(168,85,247,0.15)] font-semibold'
                      : 'border border-transparent text-slate-400 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-white/[0.04]'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={`${isActive ? 'text-violet-400' : 'text-slate-400 group-hover:text-violet-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="text-xs font-medium tracking-wide flex-1 truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold uppercase tracking-wider">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0c1024] border border-white/15 rounded-lg text-xs text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.badge && <span className="text-[9px] font-mono text-cyan-400">• {item.badge}</span>}
                    </div>
                  )}
                  {isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l bg-violet-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Dynamic Multi-Role "MY PORTALS" Section */}
      <div className="pt-3 border-t border-slate-700/60 dark:border-white/10 flex flex-col gap-1.5">
        {!isCollapsed && (
          <p className="px-3 mb-1 font-mono text-[9px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-semibold">
            MY PORTALS
          </p>
        )}

        {/* My Employee Portal (Visible ONLY if current user possesses EMPLOYEE role) */}
        {hasEmployeeRole && (
          <button
            type="button"
            onClick={() => handlePortalClick('employee')}
            className={`rounded-xl text-left transition-all duration-200 flex items-center border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 ${
              isCollapsed ? 'justify-center p-2.5 mx-auto w-10 h-10' : 'px-3 py-2.5 gap-2.5 w-full'
            }`}
            title="My Employee Portal"
            aria-label="Switch to My Employee Portal"
          >
            <User className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs font-mono font-medium truncate">My Employee Portal</span>}
          </button>
        )}

        {/* My HR Operations (Visible ONLY if current user possesses HR role) */}
        {hasHrRole && (
          <button
            type="button"
            onClick={() => handlePortalClick('hr')}
            className={`rounded-xl text-left transition-all duration-200 flex items-center border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
              isCollapsed ? 'justify-center p-2.5 mx-auto w-10 h-10' : 'px-3 py-2.5 gap-2.5 w-full'
            }`}
            title="My HR Operations"
            aria-label="Switch to My HR Operations"
          >
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs font-mono font-medium truncate">My HR Operations</span>}
          </button>
        )}

        {/* If user possesses ADMIN role only (no additional portals assigned) */}
        {!hasEmployeeRole && !hasHrRole && !isCollapsed && (
          <p className="px-3 py-1.5 text-[11px] text-slate-500 dark:text-white/40 italic">
            No additional portals assigned
          </p>
        )}
      </div>
    </aside>
  );
};
