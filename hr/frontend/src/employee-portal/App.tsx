import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { AskHrView } from './views/AskHrView';
import { RaiseRequestView } from './views/RaiseRequestView';
import { MyRequestsView } from './views/MyRequestsView';
import { NotificationsView } from './views/NotificationsView';
import { KnowledgeHubView } from './views/KnowledgeHubView';
import { MyProfileView } from './views/MyProfileView';
import { HelpSupportView } from './views/HelpSupportView';

// Modals
import { RequestDetailsModal } from './components/RequestDetailsModal';
import { ApplyLeaveModal } from './components/ApplyLeaveModal';
import { PayslipModal } from './components/PayslipModal';
import { PolicyReaderModal } from './components/PolicyReaderModal';
import { UpdateBankModal } from './components/UpdateBankModal';
import { QuickSearchModal } from './components/QuickSearchModal';

import {
  HrRequest,
  NotificationItem,
  PolicyItem,
  ScreenId,
  LeaveBalance,
  RequestCategory,
} from './types';
import {
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
  UPCOMING_HOLIDAYS,
  INITIAL_LEAVE_BALANCE,
  POLICIES,
  CURRENT_USER,
  ASSETS,
} from './data/mockData';
import { useAuth } from '../context/AuthContext';
import { hrService } from '../services/hrService';

export default function EmployeePortalApp() {
  const { user } = useAuth();

  // Navigation State
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync user name if available
  useEffect(() => {
    if (user?.name) {
      CURRENT_USER.name = user.name;
      CURRENT_USER.email = user.email || CURRENT_USER.email;
    }
  }, [user]);

  // Core Data State
  const [requests, setRequests] = useState<HrRequest[]>(INITIAL_REQUESTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>(INITIAL_LEAVE_BALANCE);
  const [policies, setPolicies] = useState<PolicyItem[]>(POLICIES);

  // Modal States
  const [selectedRequest, setSelectedRequest] = useState<HrRequest | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyItem | null>(null);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showUpdateBankModal, setShowUpdateBankModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Pre-fill state for Raise Request
  const [raiseRequestTopic, setRaiseRequestTopic] = useState<{
    subject: string;
    category: RequestCategory;
  }>({
    subject: '',
    category: 'Leave & Time',
  });

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Handlers
  const handleAddRequest = (newReqData: Partial<HrRequest>) => {
    const fullReq: HrRequest = {
      id: newReqData.id || `REQ-${Math.floor(1024 + Math.random() * 800)}`,
      subject: newReqData.subject || 'Untitled Request',
      category: newReqData.category || 'Leave & Time',
      status: newReqData.status || 'SUBMITTED',
      priority: newReqData.priority || 'Medium',
      lastUpdated: 'Just now',
      createdDate: '17 Sep 2026',
      description: newReqData.description || '',
      assignedTo: 'Triage Queue (HR Operations)',
      timeline: [
        {
          date: '17 Sep 2026, 09:30 AM',
          title: 'Request Created',
          desc: 'Submitted through HR Service Desk self-service portal.',
          actor: user?.name || CURRENT_USER.name,
        },
      ],
      comments: [],
      attachmentName: newReqData.attachmentName,
    };

    setRequests((prev) => [fullReq, ...prev]);

    // Synchronize to Enterprise HR Service Desk
    hrService
      .createRequest({
        title: fullReq.subject,
        category:
          fullReq.category === 'Leave & Time'
            ? 'leave'
            : fullReq.category === 'Payroll'
            ? 'payroll'
            : fullReq.category === 'Employee Info'
            ? 'benefits'
            : 'other',
        priority:
          fullReq.priority === 'Urgent'
            ? 'high'
            : (fullReq.priority.toLowerCase() as 'low' | 'medium' | 'high') ||
              'medium',
        description: fullReq.description,
        employee: {
          id: user?.id || CURRENT_USER.employeeId,
          name: user?.name || CURRENT_USER.name,
          department: CURRENT_USER.department,
          email: user?.email || CURRENT_USER.email,
          avatar: user?.avatarUrl || ASSETS.avatar,
        },
      })
      .catch((err) => console.warn('Could not sync request to HR service:', err));

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Ticket ${fullReq.id} logged: "${fullReq.subject}"`,
      time: 'Just now',
      read: false,
      requestId: fullReq.id,
      type: 'request',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Request ${fullReq.id} submitted successfully!`);
  };

  const handleAddCommentToRequest = (requestId: string, commentText: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updatedComments = [
            ...r.comments,
            {
              id: `comm-${Date.now()}`,
              author: user?.name || CURRENT_USER.name,
              avatar: user?.avatarUrl || ASSETS.avatar,
              text: commentText,
              time: 'Just now',
              isHr: false,
            },
          ];
          const updatedReq = {
            ...r,
            lastUpdated: 'Just now',
            comments: updatedComments,
          };
          if (selectedRequest && selectedRequest.id === requestId) {
            setSelectedRequest(updatedReq);
          }
          return updatedReq;
        }
        return r;
      })
    );
    showToast('Response posted to ticket thread');
  };

  const handleApplyLeaveSubmit = (
    newRequest: Partial<HrRequest>,
    daysCount: number,
    leaveType: 'casual' | 'sick' | 'earned'
  ) => {
    // Deduct leave balance
    setLeaveBalance((prev) => {
      const current = prev[leaveType];
      const remaining = Math.max(0, current.remaining - daysCount);
      return {
        ...prev,
        [leaveType]: {
          ...current,
          remaining,
        },
      };
    });

    handleAddRequest(newRequest);
    setShowApplyLeaveModal(false);
  };

  const handleBankUpdateSubmit = (bankRequest: Partial<HrRequest>) => {
    handleAddRequest(bankRequest);
    setShowUpdateBankModal(false);
    showToast('Bank details submitted for HR & Payroll validation');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleMarkSingleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleRaiseRequestFromPrompt = (topic: string, category: string) => {
    setRaiseRequestTopic({
      subject: topic,
      category: category as RequestCategory,
    });
    setActiveScreen('raise-request');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#070b19] font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-500 selection:text-white p-2.5 sm:p-3.5 md:gap-3.5 gap-0">
      {/* 1. SIDEBAR (Dedicated Left Column) */}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={(screen) => {
          setActiveScreen(screen);
          setIsMobileSidebarOpen(false);
        }}
        unreadCount={unreadCount}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
        onOpenPayslip={() => setShowPayslipModal(true)}
        onOpenBankUpdate={() => setShowUpdateBankModal(true)}
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* TOP HEADER */}
        <Header
          activeScreen={activeScreen}
          unreadCount={unreadCount}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={(screen) => setActiveScreen(screen)}
        />

        {/* SCROLLABLE MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-1 sm:px-3 pb-6">
          {activeScreen === 'dashboard' && (
            <DashboardView
              requests={requests}
              notifications={notifications}
              holidays={UPCOMING_HOLIDAYS}
              leaveBalance={leaveBalance}
              policies={policies}
              onSelectRequest={(req) => setSelectedRequest(req)}
              onSelectPolicy={(pol) => setSelectedPolicy(pol)}
              onNavigate={(s) => setActiveScreen(s)}
              onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
              onOpenPayslip={() => setShowPayslipModal(true)}
              onOpenBankUpdate={() => setShowUpdateBankModal(true)}
            />
          )}

          {activeScreen === 'ask-hr' && (
            <AskHrView
              onRaiseRequestWithTopic={handleRaiseRequestFromPrompt}
              onNavigate={(s) => setActiveScreen(s)}
              onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
              onOpenPayslip={() => setShowPayslipModal(true)}
              onSelectPolicy={(pol) => setSelectedPolicy(pol)}
              policies={policies}
              leaveBalance={leaveBalance}
            />
          )}

          {activeScreen === 'raise-request' && (
            <RaiseRequestView
              initialSubject={raiseRequestTopic.subject}
              initialCategory={raiseRequestTopic.category}
              onSubmitRequest={handleAddRequest}
              onNavigate={(s) => setActiveScreen(s)}
            />
          )}

          {activeScreen === 'my-requests' && (
            <MyRequestsView
              requests={requests}
              onSelectRequest={(req) => setSelectedRequest(req)}
              onNavigate={(s) => setActiveScreen(s)}
            />
          )}

          {activeScreen === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              requests={requests}
              policies={policies}
              onSelectRequest={(req) => setSelectedRequest(req)}
              onSelectPolicy={(pol) => setSelectedPolicy(pol)}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onMarkSingleAsRead={handleMarkSingleNotificationRead}
            />
          )}

          {activeScreen === 'knowledge-hub' && (
            <KnowledgeHubView
              policies={policies}
              onSelectPolicy={(pol) => setSelectedPolicy(pol)}
            />
          )}

          {activeScreen === 'my-profile' && (
            <MyProfileView
              leaveBalance={leaveBalance}
              onOpenBankUpdate={() => setShowUpdateBankModal(true)}
              onOpenApplyLeave={() => setShowApplyLeaveModal(true)}
              onNavigate={(s) => setActiveScreen(s)}
            />
          )}

          {activeScreen === 'help-support' && (
            <HelpSupportView onNavigate={(s) => setActiveScreen(s)} />
          )}
        </main>
      </div>

      {/* 3. MODALS */}
      {/* Request Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAddComment={(comment) =>
            handleAddCommentToRequest(selectedRequest.id, comment)
          }
        />
      )}

      {/* Apply Leave Modal */}
      {showApplyLeaveModal && (
        <ApplyLeaveModal
          balance={leaveBalance}
          onClose={() => setShowApplyLeaveModal(false)}
          onSubmitLeave={handleApplyLeaveSubmit}
        />
      )}

      {/* Payslip Modal */}
      {showPayslipModal && (
        <PayslipModal onClose={() => setShowPayslipModal(false)} />
      )}

      {/* Update Bank Modal */}
      {showUpdateBankModal && (
        <UpdateBankModal
          onClose={() => setShowUpdateBankModal(false)}
          onSubmitBankUpdate={handleBankUpdateSubmit}
        />
      )}

      {/* Policy Reader Modal */}
      {selectedPolicy && (
        <PolicyReaderModal
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}

      {/* Quick Search (⌘K) Modal */}
      {showSearchModal && (
        <QuickSearchModal
          onClose={() => setShowSearchModal(false)}
          requests={requests}
          policies={policies}
          onSelectRequest={(req) => setSelectedRequest(req)}
          onSelectPolicy={(pol) => setSelectedPolicy(pol)}
          onNavigate={(screen) => setActiveScreen(screen)}
          onOpenQuickAction={(action) => {
            if (action === 'leave') setShowApplyLeaveModal(true);
            if (action === 'payslip') setShowPayslipModal(true);
            if (action === 'bank') setShowUpdateBankModal(true);
          }}
        />
      )}

      {/* 4. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F172A] text-white text-[13px] shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white text-[11px]"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
