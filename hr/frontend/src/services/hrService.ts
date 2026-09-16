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
  CopilotMessage
} from '../types/hr';
import {
  initialMetrics,
  velocityDataset,
  initialRequests,
  initialTriageQueue,
  initialDeliverables,
  initialHRActions,
  initialInsights,
  initialCategoryVolumes,
  initialActivities,
  initialCopilotMessages
} from './mockData';
import { request, IS_MOCK_MODE } from './apiClient';

// In-memory state for reactive local mock mode
let state = {
  metrics: { ...initialMetrics },
  requests: [...initialRequests],
  triageQueue: [...initialTriageQueue],
  deliverables: [...initialDeliverables],
  hrActions: [...initialHRActions],
  insights: [...initialInsights],
  categoryVolumes: [...initialCategoryVolumes],
  activities: [...initialActivities],
  copilotMessages: [...initialCopilotMessages]
};

// Simulate network delay in mock mode for realistic enterprise UI feedback
const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

export const hrService = {
  async getMetrics(): Promise<DashboardMetrics> {
    if (IS_MOCK_MODE) {
      await delay();
      return { ...state.metrics };
    }
    return request<DashboardMetrics>('/dashboard/metrics');
  },

  async getVelocity(range: '7D' | '30D' | '90D'): Promise<VelocityData> {
    if (IS_MOCK_MODE) {
      await delay(120);
      return velocityDataset[range];
    }
    return request<VelocityData>(`/dashboard/velocity?range=${range}`);
  },

  async getRequests(category?: string, priority?: string, search?: string): Promise<RequestItem[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return state.requests.filter(req => {
        if (category && category !== 'all' && req.category !== category) return false;
        if (priority && priority !== 'all' && req.priority !== priority) return false;
        if (search) {
          const q = search.toLowerCase();
          const matchTitle = req.title.toLowerCase().includes(q);
          const matchEmp = req.employee.name.toLowerCase().includes(q);
          const matchId = req.id.toLowerCase().includes(q);
          return matchTitle || matchEmp || matchId;
        }
        return true;
      });
    }
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);
    return request<RequestItem[]>(`/requests?${params.toString()}`);
  },

  async createRequest(newReq: Partial<RequestItem>): Promise<RequestItem> {
    if (IS_MOCK_MODE) {
      await delay(250);
      const id = `HR-${1000 + state.requests.length + 1}`;
      const item: RequestItem = {
        id,
        title: newReq.title || 'New HR Inquiry',
        employee: newReq.employee || {
          id: 'EMP-999',
          name: 'Sarah Jenkins',
          department: 'HR Operations',
          email: 'sarah.j@enterprise.internal',
          avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0'
        },
        category: newReq.category || 'other',
        priority: newReq.priority || 'medium',
        status: 'open',
        waitingTime: 'Just now',
        createdAt: new Date().toISOString(),
        aiTriage: {
          confidence: 0.95,
          classification: 'Autonomous Intake',
          autoRouted: true
        },
        description: newReq.description || ''
      };
      state.requests.unshift(item);
      state.metrics.openRequests.count += 1;
      state.activities.unshift({
        id: `ACT-${Date.now()}`,
        actorType: 'user',
        actorName: 'Sarah',
        actionText: `Sarah created ${item.id} (${item.category})`,
        timeAgo: 'Just now',
        subText: item.title,
        tag: { text: 'New', color: 'cyan' }
      });
      return item;
    }
    return request<RequestItem>('/requests', {
      method: 'POST',
      body: JSON.stringify(newReq)
    });
  },

  async reviewRequest(id: string, notes: string, status: 'resolved' | 'in_review' = 'resolved'): Promise<RequestItem> {
    if (IS_MOCK_MODE) {
      await delay(200);
      const req = state.requests.find(r => r.id === id);
      if (req) {
        req.status = status;
        req.resolutionNotes = notes;
        if (status === 'resolved') {
          state.metrics.resolvedOvernight += 1;
          state.metrics.openRequests.count = Math.max(0, state.metrics.openRequests.count - 1);
        }
        state.activities.unshift({
          id: `ACT-${Date.now()}`,
          actorType: 'user',
          actorName: 'Sarah',
          actionText: `Sarah reviewed & marked ${id} ${status}`,
          timeAgo: 'Just now',
          subText: notes,
          tag: { text: status.toUpperCase(), color: 'emerald' }
        });
      }
      return req!;
    }
    return request<RequestItem>(`/requests/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ notes, status })
    });
  },

  async getTriageQueue(): Promise<AITriageItem[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return [...state.triageQueue];
    }
    return request<AITriageItem[]>('/ai/triage/queue');
  },

  async overrideTriage(triageId: string, newCategory: any): Promise<void> {
    if (IS_MOCK_MODE) {
      await delay(200);
      const item = state.triageQueue.find(t => t.id === triageId);
      if (item) {
        item.predictedCategory = newCategory;
        item.status = 'OVERRIDDEN';
      }
      return;
    }
    return request<void>('/ai/triage/override', {
      method: 'POST',
      body: JSON.stringify({ triageId, newCategory })
    });
  },

  async getDeliverables(): Promise<DeliverableItem[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return [...state.deliverables];
    }
    return request<DeliverableItem[]>('/deliverables');
  },

  async approveDeliverable(id: string): Promise<DeliverableItem> {
    if (IS_MOCK_MODE) {
      await delay(200);
      const item = state.deliverables.find(d => d.id === id);
      if (item) {
        item.status = 'approved';
        state.activities.unshift({
          id: `ACT-${Date.now()}`,
          actorType: 'user',
          actorName: 'Sarah',
          actionText: `Sarah approved ${id}`,
          timeAgo: 'Just now',
          subText: item.title,
          tag: { text: 'Approved', color: 'emerald' }
        });
      }
      return item!;
    }
    return request<DeliverableItem>(`/deliverables/${id}/approve`, { method: 'POST' });
  },

  async getHRActions(): Promise<HRActionItem[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return [...state.hrActions];
    }
    return request<HRActionItem[]>('/actions');
  },

  async executeHRAction(id: string): Promise<HRActionItem> {
    if (IS_MOCK_MODE) {
      await delay(250);
      const item = state.hrActions.find(a => a.id === id);
      if (item) {
        item.status = 'completed';
        state.metrics.pendingHRActions.count = Math.max(0, state.metrics.pendingHRActions.count - 1);
        state.activities.unshift({
          id: `ACT-${Date.now()}`,
          actorType: 'user',
          actorName: 'Sarah',
          actionText: `Executed Action ${id}: ${item.title}`,
          timeAgo: 'Just now',
          subText: item.employeeName,
          tag: { text: 'Executed', color: 'cyan' }
        });
      }
      return item!;
    }
    return request<HRActionItem>(`/actions/${id}/execute`, { method: 'POST' });
  },

  async getInsights(): Promise<InsightItem[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return [...state.insights];
    }
    return request<InsightItem[]>('/insights/trends');
  },

  async getCategoryVolumes(): Promise<CategoryVolume[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return [...state.categoryVolumes];
    }
    return request<CategoryVolume[]>('/insights/categories');
  },

  async getActivities(): Promise<ActivityEvent[]> {
    if (IS_MOCK_MODE) {
      await delay();
      return [...state.activities];
    }
    return request<ActivityEvent[]>('/dashboard/recent-activity');
  },

  async queryCopilot(prompt: string): Promise<CopilotMessage> {
    if (IS_MOCK_MODE) {
      await delay(400);
      let reply = `Based on the Enterprise HR Handbook (Section 4 & 6), here is the verified protocol for your query: "${prompt}".`;
      let citations = [
        { title: 'Global Employee Handbook 2026', section: 'Policy 6.4: Sabbatical & Extended Leave', page: 42 },
        { title: 'Compensation Governance Manual', section: 'Section 3.2: Incentive & Bonus Timelines' }
      ];

      if (prompt.toLowerCase().includes('bonus') || prompt.toLowerCase().includes('payroll')) {
        reply = "Regarding payroll discrepancies: Under company policy Section 3.2, all off-cycle bonus adjustments approved by the 25th of the month are automatically scheduled for the next immediate payroll disbursement run. Retroactive tax reconciliation will be reflected on the W-2 / P60 schedule.";
      } else if (prompt.toLowerCase().includes('leave') || prompt.toLowerCase().includes('sabbatical')) {
        reply = "Regarding sabbatical leave: Full-time employees with 3+ years of continuous service are entitled to apply for up to 90 consecutive days of unpaid sabbatical leave. Health insurance coverage remains active with the standard employee cost share.";
      }

      const assistantMsg: CopilotMessage = {
        id: `COP-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        suggestedActions: [
          "Generate Official Resolution Addendum",
          "Notify Payroll Operations",
          "Send Employee Confirmation Email"
        ]
      };
      state.copilotMessages.push(assistantMsg);
      return assistantMsg;
    }
    return request<CopilotMessage>('/ai/assist/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
  }
};
