import { useState, useEffect } from 'react';
import { SpatialBackground } from './components/layout/SpatialBackground';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DashboardView } from './components/views/DashboardView';
import { RequestsView } from './components/views/RequestsView';
import { AITriageView } from './components/views/AITriageView';
import { AIAssistanceView } from './components/views/AIAssistanceView';
import { DeliverablesView } from './components/views/DeliverablesView';
import { HRActionsView } from './components/views/HRActionsView';
import { InsightsView } from './components/views/InsightsView';
import { BackendDocsView } from './components/views/BackendDocsView';
import { SettingsView } from './components/views/SettingsView';
import { ReportsView, HRProfileView } from './components/views/HRProfileAndReports';
import { CommandPalette } from './components/modals/CommandPalette';
import { NewActionModal } from './components/modals/NewActionModal';
import { ReviewDrawer } from './components/modals/ReviewDrawer';
import { LoginView } from './components/auth/LoginView';
import { EmployeePortal } from './components/views/EmployeePortal';
import { SplitWorkflowView } from './components/views/SplitWorkflowView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { hrService } from './services/hrService';
import {
  DashboardMetrics,
  VelocityData,
  RequestItem,
  AITriageItem,
  DeliverableItem,
  HRActionItem,
  InsightItem,
  CategoryVolume,
  ActivityEvent,
  Category
} from './types/hr';
import {
  initialMetrics,
  velocityDataset,
  initialRequests,
  initialTriageQueue,
  initialDeliverables,
  initialHRActions,
  initialInsights,
  initialCategoryVolumes,
  initialActivities
} from './services/mockData';

function HROperationsPortal() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);
  const [velocity, setVelocity] = useState<VelocityData>(velocityDataset['7D']);
  const [activeVelocityRange, setActiveVelocityRange] = useState<'7D' | '30D' | '90D'>('7D');
  const sanitizeRequestItem = (r: any): RequestItem => {
    if (!r) return r;
    const emp = typeof r.employee === 'object' && r.employee !== null ? r.employee : {
      name: typeof r.employee === 'string' ? r.employee : (r.employeeName || 'Alex Johnson'),
      email: r.employeeEmail || 'alex.johnson@enterprise.internal',
      department: r.department || 'Engineering',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      tenure: '2.5 yrs'
    };
    return {
      ...r,
      employee: {
        name: emp.name || 'Alex Johnson',
        email: emp.email || 'alex.johnson@enterprise.internal',
        department: emp.department || 'Engineering',
        avatar: emp.avatar || emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        tenure: emp.tenure || '2.5 yrs'
      },
      priority: (r.priority || 'medium').toLowerCase(),
      status: (r.status || 'open').toLowerCase(),
      category: (r.category || 'general').toLowerCase(),
      waitingTime: r.waitingTime || '12m',
      createdAt: r.createdAt || new Date().toISOString()
    };
  };

  const [requests, setRequests] = useState<RequestItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('hr_admin_requests');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(sanitizeRequestItem);
          }
        }
      } catch {}
    }
    return initialRequests.map(sanitizeRequestItem);
  });
  const [triageQueue, setTriageQueue] = useState<AITriageItem[]>(initialTriageQueue);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(initialDeliverables);
  const [hrActions, setHRActions] = useState<HRActionItem[]>(initialHRActions);
  const [insights, setInsights] = useState<InsightItem[]>(initialInsights);
  const [categories, setCategories] = useState<CategoryVolume[]>(initialCategoryVolumes);
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities);

  // Modals & Drawers state
  const [selectedReviewItem, setSelectedReviewItem] = useState<RequestItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewActionOpen, setIsNewActionOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial data loading
  useEffect(() => {
    async function loadData() {
      try {
        const [m, reqs, tQ, delivs, acts, ins, cats, actLogs] = await Promise.all([
          hrService.getMetrics(),
          hrService.getRequests(),
          hrService.getTriageQueue(),
          hrService.getDeliverables(),
          hrService.getHRActions(),
          hrService.getInsights(),
          hrService.getCategoryVolumes(),
          hrService.getActivities()
        ]);
        setMetrics(m);
        if (Array.isArray(reqs)) {
          const sanitized = reqs.map(sanitizeRequestItem);
          setRequests(sanitized);
          try { localStorage.setItem('hr_admin_requests', JSON.stringify(sanitized)); } catch {}
        }
        setTriageQueue(tQ);
        setDeliverables(delivs);
        setHRActions(acts);
        setInsights(ins);
        setCategories(cats);
        setActivities(actLogs);
      } catch (err) {
        console.warn('Using local fallback state:', err);
      }
    }
    loadData();
  }, []);

  // Real-time live synchronization across dual portals
  useEffect(() => {
    const unsubscribe = hrService.subscribe(async (event) => {
      try {
        const [m, reqs, tQ, actLogs, cats] = await Promise.all([
          hrService.getMetrics(),
          hrService.getRequests(),
          hrService.getTriageQueue(),
          hrService.getActivities(),
          hrService.getCategoryVolumes()
        ]);
        setMetrics(m);
        if (Array.isArray(reqs)) {
          const sanitized = reqs.map(sanitizeRequestItem);
          setRequests(sanitized);
          try { localStorage.setItem('hr_admin_requests', JSON.stringify(sanitized)); } catch {}
        }
        if (Array.isArray(tQ)) setTriageQueue(tQ);
        if (Array.isArray(actLogs)) setActivities(actLogs);
        if (Array.isArray(cats)) setCategories(cats);
      } catch (err) {
        console.warn('Real-time sync refresh error:', err);
      }
    });
    return unsubscribe;
  }, []);

  // Keyboard shortcut listener for Alt+T (Quick Triage) and Cmd+K
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setActiveTab('ai-triage');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Range changer for velocity chart
  const handleChangeVelocityRange = async (range: '7D' | '30D' | '90D') => {
    setActiveVelocityRange(range);
    const data = await hrService.getVelocity(range);
    setVelocity(data);
  };

  // Create new request
  const handleCreateRequest = async (newReq: Partial<RequestItem>) => {
    const created = await hrService.createRequest(newReq);
    setRequests(prev => {
      const next = [created, ...prev.filter(r => r.id !== created.id)];
      try { localStorage.setItem('hr_admin_requests', JSON.stringify(next)); } catch {}
      return next;
    });
    const updatedMetrics = await hrService.getMetrics();
    setMetrics(updatedMetrics);
    const updatedActivities = await hrService.getActivities();
    setActivities(updatedActivities);
  };

  // Resolve / Review request
  const handleResolveRequest = async (id: string, notes: string) => {
    await hrService.reviewRequest(id, notes, 'resolved');
    setRequests(prev => {
      const next = prev.map(r => 
        r.id === id || (r.id && id && r.id.toLowerCase() === id.toLowerCase())
          ? { ...r, status: 'resolved' as const, resolutionNotes: notes } 
          : r
      );
      try { localStorage.setItem('hr_admin_requests', JSON.stringify(next)); } catch {}
      return next;
    });
    const updatedMetrics = await hrService.getMetrics();
    setMetrics(updatedMetrics);
    const updatedActivities = await hrService.getActivities();
    setActivities(updatedActivities);
  };

  // Approve deliverable
  const handleApproveDeliverable = async (id: string) => {
    await hrService.approveDeliverable(id);
    setDeliverables(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d));
    const updatedActivities = await hrService.getActivities();
    setActivities(updatedActivities);
  };

  // Execute HR action
  const handleExecuteAction = async (id: string) => {
    await hrService.executeHRAction(id);
    setHRActions(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
    const updatedMetrics = await hrService.getMetrics();
    setMetrics(updatedMetrics);
    const updatedActivities = await hrService.getActivities();
    setActivities(updatedActivities);
  };

  // Override triage category
  const handleOverrideTriage = async (id: string, category: Category) => {
    await hrService.overrideTriage(id, category);
    setTriageQueue(prev => prev.map(t => t.id === id ? { ...t, predictedCategory: category, status: 'OVERRIDDEN' } : t));
  };

  // Urgent items for Dashboard attention queue
  const urgentRequests = requests.filter(r => {
    const p = (r.priority || '').toLowerCase();
    const s = (r.status || '').toLowerCase();
    return (p === 'high' || p === 'urgent' || s === 'in_review') && s !== 'resolved';
  }).slice(0, 5);

  return (
    <div className="h-screen w-screen overflow-hidden relative font-sans text-slate-200 selection:bg-cyan-500/20 selection:text-neon-cyan flex">
      {/* 1. Spatial Ambient Glow Background */}
      <SpatialBackground />

      {/* 2. Main Shell Layout: screen locked, sidebar stationary */}
      <div className="relative z-10 flex h-full w-full p-4 gap-4 lg:gap-6 overflow-hidden">
        {/* Floating Frosted Glass Sidebar (Desktop) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          openRequestsCount={metrics.openRequests.count}
          pendingActionsCount={metrics.pendingHRActions.count}
        />

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-72 h-full bg-[#070a1a] p-4 border-r border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                openRequestsCount={metrics.openRequests.count}
                pendingActionsCount={metrics.pendingHRActions.count}
              />
            </div>
          </div>
        )}

        {/* Main Viewport */}
        <div className={`flex-1 min-w-0 h-full flex flex-col ${
          activeTab === 'ai-assistance'
            ? 'overflow-hidden'
            : 'overflow-y-auto overflow-x-hidden pr-1.5 scroll-smooth'
        }`}>
          {/* Top Sticky Header */}
          <Header
            activeTab={activeTab}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenNewAction={() => setIsNewActionOpen(true)}
            onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          />

          {/* Active View Router */}
          <div className={`flex-1 min-h-0 flex flex-col ${
            activeTab === 'ai-assistance' ? 'overflow-hidden' : ''
          }`}>
            {activeTab === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                velocity={velocity}
                activeVelocityRange={activeVelocityRange}
                onChangeVelocityRange={handleChangeVelocityRange}
                urgentRequests={urgentRequests}
                insights={insights}
                categories={categories}
                activities={activities}
                onOpenNewAction={() => setIsNewActionOpen(true)}
                onReviewRequest={(item) => setSelectedReviewItem(item)}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'requests' && (
              <RequestsView
                requests={requests}
                onSelectRequest={(item) => setSelectedReviewItem(item)}
                onNewRequest={() => setIsNewActionOpen(true)}
                onResolveDirect={(id) => handleResolveRequest(id, 'Approved and resolved directly by HR Operations Lead.')}
              />
            )}

            {activeTab === 'ai-triage' && (
              <AITriageView
                triageQueue={triageQueue}
                onOverride={handleOverrideTriage}
              />
            )}

            {activeTab === 'ai-assistance' && (
              <AIAssistanceView
                onOpenNewAction={() => setIsNewActionOpen(true)}
              />
            )}

            {activeTab === 'deliverables' && (
              <DeliverablesView
                deliverables={deliverables}
                onApprove={handleApproveDeliverable}
              />
            )}

            {activeTab === 'hr-actions' && (
              <HRActionsView
                actions={hrActions}
                onExecute={handleExecuteAction}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsView
                insights={insights}
                categories={categories}
              />
            )}

            {activeTab === 'backend-docs' && (
              <BackendDocsView />
            )}

            {activeTab === 'reports' && (
              <ReportsView />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}

            {activeTab === 'hr-profile' && (
              <HRProfileView />
            )}
          </div>

          {/* Spatial Glass Footer */}
          {activeTab !== 'ai-assistance' && (
            <Footer
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onQuickTriage={() => setActiveTab('ai-triage')}
            />
          )}
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        requests={requests}
        onSelectRequest={(item) => setSelectedReviewItem(item)}
      />

      <NewActionModal
        isOpen={isNewActionOpen}
        onClose={() => setIsNewActionOpen(false)}
        onSubmit={handleCreateRequest}
      />

      <ReviewDrawer
        item={selectedReviewItem}
        onClose={() => setSelectedReviewItem(null)}
        onResolve={handleResolveRequest}
      />
    </div>
  );
}

function PortalRouter() {
  const { user, isLoading } = useAuth();

  const isSplitView = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('view') === 'split' ||
    window.location.pathname === '/split'
  );

  if (isSplitView) {
    return <SplitWorkflowView />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#050713] flex flex-col items-center justify-center text-white/60 font-sans gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span className="text-xs font-mono tracking-wider text-cyan-300/80">AUTHENTICATING HR AI ECOSYSTEM...</span>
      </div>
    );
  }

  // Not logged in -> Show Login view
  if (!user) {
    return <LoginView />;
  }

  const urlPortal = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('portal') : null;
  const isEmployeePort = typeof window !== 'undefined' && (
    window.location.port === '5174' ||
    window.location.port === '3000'
  );

  if (urlPortal === 'employee' || (isEmployeePort && user.role === 'EMPLOYEE')) {
    return <EmployeePortal />;
  }

  if (urlPortal === 'hr' && user.role !== 'EMPLOYEE') {
    return <HROperationsPortal />;
  }

  // Role: EMPLOYEE -> Show User / Employee Self-Service Portal
  if (user.role === 'EMPLOYEE') {
    return <EmployeePortal />;
  }

  // Role: HR_ADMIN or HR_SPECIALIST -> Show HR Operations Cockpit
  return <HROperationsPortal />;
}

export function App() {
  return (
    <AuthProvider>
      <PortalRouter />
    </AuthProvider>
  );
}

export default App;
