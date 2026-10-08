import React, { useState, useEffect } from 'react';
import { AdminTab } from '../../types/admin';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { SystemSettings } from './SystemSettings';
import { AuditLogs } from './AuditLogs';
import { AdminProfile } from './AdminProfile';
import { AITelemetryView } from '../views/AITelemetryView';
import { ToastProvider } from './AdminToast';
import { SpatialBackground } from '../layout/SpatialBackground';

interface AdminPortalProps {
  onSwitchPortal?: (portal: 'hr' | 'employee') => void;
}

export const AdminPortalContent: React.FC<AdminPortalProps> = ({ onSwitchPortal }) => {
  // Read initial tab from URL pathname or query
  const getInitialTab = (): AdminTab => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin/users' || path === '/admin/user-management') return 'users';
      if (path === '/admin/roles') return 'roles';
      if (path === '/admin/settings') return 'settings';
      if (path === '/admin/audit-logs' || path === '/admin/audit') return 'audit-logs';
      if (path === '/admin/ai-telemetry' || path === '/admin/telemetry') return 'ai-telemetry';
      if (path === '/admin/profile') return 'profile';

      const qTab = new URLSearchParams(window.location.search).get('tab') as AdminTab;
      if (qTab && ['dashboard', 'users', 'roles', 'settings', 'audit-logs', 'ai-telemetry', 'profile'].includes(qTab)) {
        return qTab;
      }
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update browser history when tab changes without full reload
  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('portal', 'admin');
      url.searchParams.set('tab', tab);
      if (url.pathname.startsWith('/admin')) {
        url.pathname = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  // Sync back button / popstate
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative min-h-screen w-screen bg-[#060814] text-slate-100 flex overflow-hidden font-sans">
      {/* Background Ambience */}
      <SpatialBackground />

      {/* Main Layout Container */}
      <div className="relative z-10 flex w-full h-screen p-3 md:p-4 gap-4 overflow-hidden">
        {/* Desktop Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onSwitchPortal={onSwitchPortal}
        />

        {/* Mobile Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-[#080B18] h-full p-4 border-r border-white/10 shadow-2xl flex flex-col z-10">
              <AdminSidebar
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                onSwitchPortal={onSwitchPortal}
              />
            </div>
          </div>
        )}

        {/* Center Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header */}
          <AdminHeader
            activeTab={activeTab}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            onSwitchPortal={onSwitchPortal}
          />

          {/* Tab Views Body with Scroll */}
          <main className="flex-1 overflow-y-auto pr-1 pb-6 space-y-6 no-scrollbar">
            {activeTab === 'dashboard' && (
              <AdminDashboard onNavigateTab={handleSelectTab} />
            )}

            {activeTab === 'users' && (
              <UserManagement />
            )}

            {activeTab === 'roles' && (
              <RoleManagement />
            )}

            {activeTab === 'settings' && (
              <SystemSettings />
            )}

            {activeTab === 'audit-logs' && (
              <AuditLogs />
            )}

            {activeTab === 'ai-telemetry' && (
              <AITelemetryView />
            )}

            {activeTab === 'profile' && (
              <AdminProfile />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export const AdminPortal: React.FC<AdminPortalProps> = (props) => {
  return (
    <ToastProvider>
      <AdminPortalContent {...props} />
    </ToastProvider>
  );
};

export default AdminPortal;
