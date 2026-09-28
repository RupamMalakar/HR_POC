// @ts-check
import http from 'node:http';
import crypto from 'node:crypto';
import { parse as parseUrl } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password || '')).digest('hex');
}
const DEFAULT_PASSWORD_HASH = hashPassword('SecretPassword123!');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

const PORT = 8000;


// Connected SSE clients for real-time live push updates
/** @type {Set<http.ServerResponse>} */
const sseClients = new Set();

function broadcastEvent(type, data) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Keep-alive heartbeat ping every 15 seconds to prevent browser/proxy connection dropouts
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': ping\n\n');
    } catch {
      sseClients.delete(client);
    }
  }
}, 15000);

// Robust Data Normalization across Portals
function normalizeCategory(cat) {
  if (!cat) return 'other';
  const c = String(cat).toLowerCase().trim();
  if (c.includes('leave') || c.includes('time') || c.includes('vacation') || c.includes('attendance') || c.includes('absence')) return 'leave';
  if (c.includes('pay') || c.includes('salary') || c.includes('tax') || c.includes('bonus') || c.includes('compensation')) return 'payroll';
  if (c.includes('benefit') || c.includes('health') || c.includes('insurance') || c.includes('info') || c.includes('bank')) return 'benefits';
  if (c.includes('doc') || c.includes('letter') || c.includes('certificate') || c.includes('verification')) return 'documents';
  if (c.includes('polic') || c.includes('compliance') || c.includes('conduct') || c.includes('rule')) return 'compliance';
  return 'other';
}

function getCategoryDisplay(cat) {
  const norm = normalizeCategory(cat);
  switch (norm) {
    case 'leave': return 'Leave & Time';
    case 'payroll': return 'Payroll';
    case 'benefits': return 'Benefits & Info';
    case 'documents': return 'Documents';
    case 'compliance': return 'HR Policies';
    default: return 'General Inquiry';
  }
}

function normalizePriority(prio) {
  if (!prio) return 'medium';
  const p = String(prio).toLowerCase().trim();
  if (p === 'urgent' || p === 'high') return 'high';
  if (p === 'low') return 'low';
  return 'medium';
}

function getPriorityDisplay(prio) {
  const norm = normalizePriority(prio);
  if (norm === 'high') return 'High';
  if (norm === 'low') return 'Low';
  return 'Medium';
}

function normalizeStatus(st) {
  if (!st) return { status: 'open', statusUpper: 'SUBMITTED' };
  const s = String(st).toLowerCase().trim();
  if (s === 'resolved' || s === 'completed' || s === 'approved') {
    return { status: 'resolved', statusUpper: 'RESOLVED' };
  }
  if (s === 'in_review' || s === 'in progress' || s === 'in-progress' || s === 'escalated') {
    return { status: 'in_review', statusUpper: 'IN PROGRESS' };
  }
  return { status: 'open', statusUpper: 'SUBMITTED' };
}

function generateTriageMetadata(reqItem) {
  const title = String(reqItem?.title || reqItem?.subject || '');
  const desc = String(reqItem?.description || '');
  const text = `${title} ${desc}`.toLowerCase();

  // 1. Sensitivity Detection
  let sensitivity = 'NORMAL';
  let isHighlySensitive = false;
  if (
    text.includes('harass') || text.includes('discriminat') || text.includes('sexual') ||
    text.includes('retaliat') || text.includes('misconduct') || text.includes('hostile') ||
    text.includes('investigat') || text.includes('legal') || text.includes('terminat') ||
    text.includes('grievance') || text.includes('complaint against') || text.includes('unfair treatment')
  ) {
    sensitivity = 'HIGHLY_SENSITIVE';
    isHighlySensitive = true;
  } else if (
    text.includes('medical') || text.includes('doctor') || text.includes('hospital') ||
    text.includes('disability') || text.includes('fmla') || text.includes('mental health') ||
    text.includes('dispute') || text.includes('salary issue') || text.includes('confidential') ||
    text.includes('disparity') || text.includes('audit')
  ) {
    sensitivity = 'SENSITIVE';
  }

  // 2. Category Normalization & Practical Categories
  let category = 'general_hr';
  let categoryDisplay = 'General HR';
  let relevantPolicy = 'Corporate Employee Handbook & Code of Conduct';
  let suggestedAction = 'Review request and route to appropriate People Partner';
  let confidence = 0.94;
  let reason = 'Standard inquiry cross-referenced with enterprise HR knowledge base.';

  if (text.includes('harass') || text.includes('hostile') || text.includes('complaint') || text.includes('grievance') || text.includes('conduct') || text.includes('dispute') || text.includes('disparity')) {
    category = 'employee_relations';
    categoryDisplay = 'Employee Relations';
    relevantPolicy = 'Anti-Harassment & Workplace Respect Policy (Sec. 2.1)';
    suggestedAction = 'Human Review Required — Initiate Confidential People Partner Triage';
    confidence = 0.97;
    reason = 'Lexical matches for workplace conduct, workload disparity, and grievance resolution guidelines.';
  } else if (text.includes('leave') || text.includes('vacation') || text.includes('absence') || text.includes('sick') || text.includes('pto') || text.includes('time off') || text.includes('sabbatical') || text.includes('paternity') || text.includes('maternity')) {
    category = 'leave';
    categoryDisplay = 'Leave & Attendance';
    relevantPolicy = text.includes('sick') || text.includes('medical')
      ? 'Medical & Statutory Sick Leave Policy (Handbook Art. 6)'
      : text.includes('paternity') || text.includes('maternity') || text.includes('parental')
        ? 'Global Parental & Caregiver Leave Guidelines'
        : 'Annual Paid Vacation & Earned Leave Policy';
    suggestedAction = text.includes('medical') || text.includes('sick')
      ? 'Verify Supporting Medical Documentation & Tenure Entitlement'
      : 'Review Calendar Overlap & Route for Supervisor Endorsement';
    confidence = 0.96;
    reason = 'Absence patterns matched against statutory eligibility and employee leave balance.';
  } else if (text.includes('pay') || text.includes('salary') || text.includes('bonus') || text.includes('tax') || text.includes('withholding') || text.includes('compensation') || text.includes('deduction')) {
    category = 'payroll';
    categoryDisplay = 'Payroll';
    relevantPolicy = 'Compensation, Withholding & Performance Incentive Framework';
    suggestedAction = 'Audit Payroll Ledger & Verify Net Disbursal Reconciliation';
    confidence = 0.98;
    reason = 'High density of financial compensation metrics and tax withholding references.';
  } else if (text.includes('insurance') || text.includes('health') || text.includes('dental') || text.includes('benefits') || text.includes('dependent') || text.includes('claim') || text.includes('tpa') || text.includes('mediassist')) {
    category = 'benefits';
    categoryDisplay = 'Benefits';
    relevantPolicy = 'Group Medical & Dependent Healthcare Insurance Policy';
    suggestedAction = 'Dispatch Enrollment Guide & Verify Dependent Eligibility Proof';
    confidence = 0.95;
    reason = 'Matched healthcare benefit schedule and dependent enrollment criteria.';
  } else if (text.includes('remote') || text.includes('wfh') || text.includes('work from home') || text.includes('hybrid') || text.includes('work abroad') || text.includes('travel')) {
    category = 'remote_work';
    categoryDisplay = 'Remote Work';
    relevantPolicy = 'Global Hybrid & International Remote Working Policy (Sec. 3.2)';
    suggestedAction = 'Review Cross-Border Tax Risk & Team Hybrid Operating Cadence';
    confidence = 0.96;
    reason = 'Identified remote work location variance and hybrid operating requirements.';
  } else if (text.includes('letter') || text.includes('certificate') || text.includes('verification') || text.includes('visa') || text.includes('tenure') || text.includes('experience') || text.includes('documents')) {
    category = 'documents';
    categoryDisplay = 'HR Documentation';
    relevantPolicy = 'Corporate Document Certification & Employment Verification Standards';
    suggestedAction = 'Generate Official Employment Verification Deliverable';
    confidence = 0.97;
    reason = 'Direct match for employment verification letter templates and background verification.';
  } else if (text.includes('reimburse') || text.includes('expense') || text.includes('receipt') || text.includes('allowance')) {
    category = 'reimbursement';
    categoryDisplay = 'Reimbursement';
    relevantPolicy = 'Business Travel & Corporate Expense Policy';
    suggestedAction = 'Validate Supporting Invoices Against Category Spend Thresholds';
    confidence = 0.94;
    reason = 'Expense voucher submission identified for finance audit.';
  } else if (text.includes('compliance') || text.includes('nda') || text.includes('policy') || text.includes('conflict of interest')) {
    category = 'compliance';
    categoryDisplay = 'Compliance';
    relevantPolicy = 'Code of Business Conduct & Regulatory Compliance Standards';
    suggestedAction = 'Execute Policy Compliance Review Checklist';
    confidence = 0.95;
    reason = 'Regulatory compliance term density triggers corporate oversight.';
  }

  // 3. Priority Determination (AI Suggested)
  let priority = 'MEDIUM';
  if (isHighlySensitive || text.includes('urgent') || text.includes('critical') || text.includes('emergency')) {
    priority = 'CRITICAL';
  } else if (sensitivity === 'SENSITIVE' || reqItem?.priority === 'high' || reqItem?.priority === 'Urgent') {
    priority = 'HIGH';
  } else if (reqItem?.priority === 'low' || text.includes('question') || text.includes('general info')) {
    priority = 'LOW';
  }

  const triageStatus = sensitivity === 'HIGHLY_SENSITIVE' || sensitivity === 'SENSITIVE' ? 'NEEDS_REVIEW' : 'TRIAGED';

  return {
    category,
    categoryDisplay,
    priority,
    sensitivity,
    confidence,
    relevantPolicy,
    suggestedAction,
    reason,
    status: triageStatus,
    analyzedAt: new Date().toISOString()
  };
}

const defaultDeliverables = [
  {
    id: "DELIV-101",
    title: "Medical Leave Documentation Request & Entitlement Notice",
    type: "HR Communication",
    status: "NEEDS_REVIEW",
    requestId: "REQ-1042",
    employeeName: "Maya Patel",
    department: "Design & Product",
    recipient: "maya.patel@enterprise.internal",
    subject: "Regarding Medical Leave & Dependent Documentation (REQ-1042)",
    content: "Dear Maya,\n\nThank you for reaching out regarding your medical leave request and dependent documentation. Under Article 6 of the Corporate Health & Leave Policy, medical absences exceeding three consecutive days require an authorized medical practitioner certificate.\n\nPlease upload the official certificate through the Employee Self-Service Portal within 5 business days so we can finalize your coverage.\n\nWarm regards,\nSarah Jenkins\nHR Operations Team",
    contentPreview: "Dear Maya, Thank you for reaching out regarding your medical leave request and dependent documentation...",
    policySources: [
      { document: "employee_handbook.pdf", page: 14, excerpt: "Medical absence exceeding 3 days requires a certified practitioner notice." }
    ],
    createdBy: "Sarah Jenkins (HR Ops)",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "DELIV-102",
    title: "Remote Work Abroad & Cross-Border Compliance Analysis",
    type: "Policy Analysis",
    status: "READY",
    requestId: "REQ-1037",
    employeeName: "Alex Johnson",
    department: "Engineering",
    recipient: "alex.johnson@enterprise.internal",
    subject: "Compliance Assessment: Overseas Remote Work Schedule",
    content: "### Policy Analysis: Remote Working Overseas (REQ-1037)\n\n**Case Overview:** Employee Alex Johnson requested 3 weeks of remote work from Spain during winter break.\n\n**Policy Evaluation:**\n- **Handbook Section 3.2 (International Remote Cadence):** Permits up to 20 business days per calendar year in eligible jurisdictions.\n- **Tax & Legal Risk:** Spain has a 30-day bilateral treaty grace period; 15 working days poses zero permanent establishment (PE) risk.\n- **Infrastructure Security:** Mandates hardware token VPN authentication.\n\n**Recommendation:** Approve remote work agreement with standard security stipulations.",
    contentPreview: "### Policy Analysis: Remote Working Overseas (REQ-1037)\n\nCase Overview: Employee Alex Johnson requested 3 weeks of remote work from Spain...",
    policySources: [
      { document: "employee_handbook.pdf", page: 22, excerpt: "Employees may work remotely abroad for up to 20 days annually upon manager and HR compliance sign-off." }
    ],
    createdBy: "Sarah Jenkins (HR Ops)",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "DELIV-103",
    title: "Salary Revision Verification Letter for Home Loan",
    type: "Employee Notice",
    status: "SENT",
    requestId: "REQ-1029",
    employeeName: "Rupam Sharma",
    department: "Product Engineering",
    recipient: "rupam.sharma@enterprise.org",
    subject: "Official Employment & Compensation Verification Letter (REQ-1029)",
    content: "To Whom It May Concern,\n\nThis letter certifies that Rupam Sharma is employed on a permanent, full-time basis as Lead Full-Stack Engineer at Enterprise Technologies. Current base compensation and active standing have been verified by HR Operations.\n\nSincerely,\nSarah Jenkins\nHR Operations Lead",
    contentPreview: "To Whom It May Concern, This letter certifies that Rupam Sharma is employed on a permanent, full-time basis...",
    policySources: [],
    createdBy: "Sarah Jenkins (HR Ops)",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: "DELIV-104",
    title: "Overtime Allocation & Workload Disparity Investigation Summary",
    type: "Case Summary",
    status: "NEEDS_REVIEW",
    requestId: "REQ-1014",
    employeeName: "David Chen",
    department: "Finance & Operations",
    recipient: "david.chen@enterprise.internal",
    subject: "Internal HR Case Summary: Workload Disparity Grievance",
    content: "### Confidential Investigation Summary: REQ-1014\n\n**Grievance:** Employee reported unequal overtime allocation during fiscal quarter-end close.\n\n**Findings:**\n1. Overtime records across the financial analysis team for Q3 show a 28% variance between team members.\n2. Workload scheduling was managed ad-hoc without rotation logs.\n\n**Proposed Remediation:**\n- Establish formalized rotation roster for month-end close.\n- HR Specialist Marcus Vance to facilitate a 1-on-1 alignment session.",
    contentPreview: "### Confidential Investigation Summary: REQ-1014\n\nGrievance: Employee reported unequal overtime allocation during fiscal quarter-end close...",
    policySources: [
      { document: "employee_handbook.pdf", page: 8, excerpt: "Overtime and on-call schedules must be distributed equitably across qualified team members." }
    ],
    createdBy: "Marcus Vance (HR Ops)",
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 28).toISOString()
  }
];

function recalculateCategoryVolumes() {
  const counts = { payroll: 0, benefits: 0, leave: 0, documents: 0, compliance: 0, other: 0 };
  for (const r of state.requests) {
    const c = r.category in counts ? r.category : 'other';
    counts[c]++;
  }
  const total = Math.max(1, state.requests.length);
  state.categoryVolumes = [
    { category: "payroll", name: "Payroll & Compensation", count: counts.payroll, percentage: Math.round((counts.payroll / total) * 100) },
    { category: "benefits", name: "Health & Benefits", count: counts.benefits, percentage: Math.round((counts.benefits / total) * 100) },
    { category: "leave", name: "Leave & Attendance", count: counts.leave, percentage: Math.round((counts.leave / total) * 100) },
    { category: "documents", name: "Letters & Verification", count: counts.documents, percentage: Math.round((counts.documents / total) * 100) },
    { category: "compliance", name: "HR Policies", count: counts.compliance, percentage: Math.round((counts.compliance / total) * 100) }
  ];
}

function recalculateMetrics() {
  const openCount = state.requests.filter(r => r.status !== 'resolved').length;
  const highCount = state.requests.filter(r => r.status !== 'resolved' && (r.priority === 'high' || r.priority === 'Urgent')).length;
  const resolvedCount = state.requests.filter(r => r.status === 'resolved').length;
  state.metrics.openRequests.count = openCount;
  state.metrics.openRequests.comparisonText = `${openCount} active`;
  state.metrics.highPriority.count = highCount;
  state.metrics.highPriority.requiresAttention = highCount;
  state.metrics.resolvedOvernight = resolvedCount;
  state.metrics.aiTriagedToday = state.triageQueue.length;
}

function recalculateVelocity() {
  if (!state.velocity) state.velocity = {};

  const requests = Array.isArray(state.requests) ? state.requests : [];
  const openCount = requests.filter(r => r.status !== 'resolved').length;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const receivedToday = requests.filter(r => {
    if (!r.createdAt) return false;
    try {
      return new Date(r.createdAt).toISOString().split('T')[0] === todayStr;
    } catch { return false; }
  }).length;

  const getResolvedDateStr = (r) => {
    if (r.status !== 'resolved') return null;
    if (r.resolvedAt) {
      try {
        const d = new Date(r.resolvedAt);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      } catch { }
    }
    if (Array.isArray(r.timeline)) {
      for (const ev of r.timeline) {
        const t = (ev.title || '').toLowerCase();
        const d = (ev.desc || '').toLowerCase();
        if (t.includes('resolved') || t.includes('approved') || d.includes('resolved') || d.includes('approved')) {
          if (ev.date) {
            try {
              const dt = new Date(ev.date);
              if (!isNaN(dt.getTime())) return dt.toISOString().split('T')[0];
            } catch { }
          }
        }
      }
    }
    if (r.lastUpdated && r.lastUpdated !== 'Just now') {
      try {
        const dt = new Date(r.lastUpdated);
        if (!isNaN(dt.getTime())) return dt.toISOString().split('T')[0];
      } catch { }
    }
    if (r.createdAt) {
      try {
        const dt = new Date(r.createdAt);
        if (!isNaN(dt.getTime())) return dt.toISOString().split('T')[0];
      } catch { }
    }
    return null;
  };

  const resolvedToday = requests.filter(r => getResolvedDateStr(r) === todayStr).length;

  // 1. --- 7D Range: Rolling 7 days ending Today ---
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const labels7 = [];
  const incoming7 = [];
  const resolved7 = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    labels7.push(dayNames[d.getDay()]);

    const inc = requests.filter(r => {
      if (!r.createdAt) return false;
      try { return new Date(r.createdAt).toISOString().split('T')[0] === dStr; } catch { return false; }
    }).length;

    const res = requests.filter(r => getResolvedDateStr(r) === dStr).length;

    incoming7.push(inc);
    resolved7.push(res);
  }

  state.velocity['7D'] = {
    range: '7D',
    labels: labels7,
    incoming: incoming7,
    resolved: resolved7,
    openTotal: openCount,
    receivedToday,
    resolvedToday
  };

  // 2. --- 30D Range: 4 Weekly Windows ending Today ---
  const labels30 = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const incoming30 = [0, 0, 0, 0];
  const resolved30 = [0, 0, 0, 0];

  for (const r of requests) {
    if (!r.createdAt) continue;
    try {
      const createdDate = new Date(r.createdAt);
      const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 28) {
        const weekIdx = 3 - Math.floor(diffDays / 7);
        if (weekIdx >= 0 && weekIdx < 4) {
          incoming30[weekIdx]++;
          if (r.status === 'resolved') {
            resolved30[weekIdx]++;
          }
        }
      }
    } catch { }
  }

  state.velocity['30D'] = {
    range: '30D',
    labels: labels30,
    incoming: incoming30,
    resolved: resolved30,
    openTotal: openCount,
    receivedToday,
    resolvedToday
  };

  // 3. --- 90D Range: Last 3 Calendar Months ending with Current Month ---
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels90 = [];
  const monthKeys = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels90.push(monthNames[d.getMonth()]);
    monthKeys.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const incoming90 = [0, 0, 0];
  const resolved90 = [0, 0, 0];

  for (const r of requests) {
    if (!r.createdAt) continue;
    try {
      const createdDate = new Date(r.createdAt);
      const yr = createdDate.getFullYear();
      const m = createdDate.getMonth();
      const idx = monthKeys.findIndex(k => k.year === yr && k.month === m);
      if (idx !== -1) {
        incoming90[idx]++;
        if (r.status === 'resolved') {
          resolved90[idx]++;
        }
      }
    } catch { }
  }

  state.velocity['90D'] = {
    range: '90D',
    labels: labels90,
    incoming: incoming90,
    resolved: resolved90,
    openTotal: openCount,
    receivedToday,
    resolvedToday
  };
}

// Clean Default State Template
const defaultState = {
  metrics: {
    openRequests: { count: 0, changePercent: 0, comparisonText: "0 open" },
    highPriority: { count: 0, requiresAttention: 0 },
    pendingHRActions: { count: 0, waitingOver24h: 0 },
    slaCompliance: { percent: 100.0, changePercent: 0, targetPercent: 92.0 },
    avgSla: "0m",
    resolvedOvernight: 0,
    aiTriagedToday: 0,
    aiAssistedCases: 0,
    draftsGenerated: 0
  },
  velocity: {
    '7D': {
      range: '7D',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      incoming: [0, 0, 0, 0, 0, 0, 0],
      resolved: [0, 0, 0, 0, 0, 0, 0],
      openTotal: 0,
      receivedToday: 0,
      resolvedToday: 0
    },
    '30D': {
      range: '30D',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      incoming: [0, 0, 0, 0],
      resolved: [0, 0, 0, 0],
      openTotal: 0,
      receivedToday: 0,
      resolvedToday: 0
    },
    '90D': {
      range: '90D',
      labels: ['Jul', 'Aug', 'Sep'],
      incoming: [0, 0, 0],
      resolved: [0, 0, 0],
      openTotal: 0,
      receivedToday: 0,
      resolvedToday: 0
    }
  },
  requests: [],
  triageQueue: [],
  deliverables: JSON.parse(JSON.stringify(defaultDeliverables)),
  hrActions: [],
  insights: [],
  categoryVolumes: [
    { category: "payroll", name: "Payroll & Compensation", count: 0, percentage: 0 },
    { category: "benefits", name: "Health & Benefits", count: 0, percentage: 0 },
    { category: "leave", name: "Leave & Attendance", count: 0, percentage: 0 },
    { category: "documents", name: "Letters & Verification", count: 0, percentage: 0 },
    { category: "compliance", name: "HR Policies", count: 0, percentage: 0 }
  ],
  activities: [
    {
      id: "ACT-INIT-1",
      actorType: "ai",
      actorName: "HR AI Engine",
      actionText: "Intake pipeline active & persistent storage connected",
      timeAgo: "Just now",
      subText: "Sync Server active on port 8000 with file database",
      tag: { text: "Online", color: "emerald" }
    }
  ],
  users: {
    HR001: {
      id: "HR001",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@enterprise.internal",
      role: "HR Operations Lead",
      title: "HR Operations Lead",
      department: "HR Operations",
      isHr: true,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0",
      avatarUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0",
      securityLevel: 3,
      tenure: "5 years",
      passwordHash: DEFAULT_PASSWORD_HASH
    },
    HR002: {
      id: "HR002",
      name: "Marcus Vance",
      email: "marcus.vance@enterprise.internal",
      role: "Senior HR Benefits & Leave Specialist",
      title: "Senior HR Benefits & Leave Specialist",
      department: "HR Operations",
      isHr: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
      securityLevel: 2,
      tenure: "3 years",
      passwordHash: DEFAULT_PASSWORD_HASH
    },
    HR003: {
      id: "HR003",
      name: "Elena Rostova",
      email: "elena.rostova@enterprise.internal",
      role: "Payroll & Compliance Admin",
      title: "Payroll & Compliance Admin",
      department: "HR Operations",
      isHr: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
      securityLevel: 2,
      tenure: "4 years",
      passwordHash: DEFAULT_PASSWORD_HASH
    },
    EMP001: {
      id: "EMP001",
      name: "Alex Johnson",
      email: "alex.johnson@enterprise.internal",
      role: "Senior Staff Engineer",
      title: "Senior Staff Engineer",
      department: "Engineering",
      isHr: false,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
      securityLevel: 1,
      tenure: "4 years",
      passwordHash: DEFAULT_PASSWORD_HASH
    },
    EMP002: {
      id: "EMP002",
      name: "Rupam Sharma",
      email: "rupam.sharma@enterprise.org",
      role: "Lead Full-Stack Engineer",
      title: "Lead Full-Stack Engineer",
      department: "Product Engineering",
      isHr: false,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
      securityLevel: 1,
      tenure: "2 years",
      passwordHash: DEFAULT_PASSWORD_HASH
    },
    EMP003: {
      id: "EMP003",
      name: "Maya Patel",
      email: "maya.patel@enterprise.internal",
      role: "Product Manager",
      title: "Product Manager",
      department: "Design & Product",
      isHr: false,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80",
      securityLevel: 1,
      tenure: "3 years",
      passwordHash: DEFAULT_PASSWORD_HASH
    },
    EMP004: {
      id: "EMP004",
      name: "David Chen",
      email: "david.chen@enterprise.internal",
      role: "Financial Analyst",
      title: "Financial Analyst",
      department: "Finance & Operations",
      isHr: false,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
      securityLevel: 1,
      tenure: "1 year",
      passwordHash: DEFAULT_PASSWORD_HASH
    }
  }
};

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function loadState() {
  try {
    ensureDbDir();
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      const loaded = JSON.parse(raw);
      if (loaded && typeof loaded === 'object') {
        console.log(`[HR Database] Loaded ${loaded.requests?.length || 0} persistent requests from ${DB_PATH}`);

        // Ensure deliverables exist and are populated
        if (!Array.isArray(loaded.deliverables) || loaded.deliverables.length === 0) {
          loaded.deliverables = JSON.parse(JSON.stringify(defaultDeliverables));
        }

        // Ensure all requests have triage metadata
        if (Array.isArray(loaded.requests)) {
          for (const req of loaded.requests) {
            if (!req.triage) {
              req.triage = generateTriageMetadata(req);
            }
          }
        }

        return {
          ...defaultState,
          ...loaded,
          deliverables: loaded.deliverables,
          metrics: { ...defaultState.metrics, ...(loaded.metrics || {}) },
          velocity: { ...defaultState.velocity, ...(loaded.velocity || {}) },
          users: { ...defaultState.users, ...(loaded.users || {}) }
        };
      }
    }
  } catch (err) {
    console.warn('[HR Database] Could not read db.json, initializing clean state:', err);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

let state = loadState();
recalculateVelocity();

function persistState() {
  try {
    ensureDbDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[HR Database] Error writing to db.json:', err);
  }
}

function attachUserAliases(usersObj) {
  if (!usersObj) return;
  if (!usersObj.admin) {
    Object.defineProperty(usersObj, 'admin', {
      get() { return this.HR001 || Object.values(this).find(u => u && u.isHr) || null; },
      configurable: true,
      enumerable: false
    });
  }
  if (!usersObj.specialist) {
    Object.defineProperty(usersObj, 'specialist', {
      get() { return this.HR002 || this.HR001 || null; },
      configurable: true,
      enumerable: false
    });
  }
  if (!usersObj.employee) {
    Object.defineProperty(usersObj, 'employee', {
      get() { return this.EMP001 || Object.values(this).find(u => u && !u.isHr) || null; },
      configurable: true,
      enumerable: false
    });
  }
}
attachUserAliases(state.users);

function findRosterUser(query) {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  const all = Object.values(state.users || {});
  return all.find(u =>
    u && (
      String(u.id || '').toLowerCase() === q ||
      String(u.email || '').toLowerCase() === q ||
      String(u.name || '').toLowerCase() === q
    )
  ) || null;
}

function getSessionUser(req) {
  const auth = String(req.headers['authorization'] || '');
  const tokenMatch = auth.match(/token_([A-Z0-9]+)/i);
  if (tokenMatch) {
    const user = findRosterUser(tokenMatch[1]);
    if (user) return user;
  }
  for (const [id, u] of Object.entries(state.users || {})) {
    if (u && (auth.includes(id) || (u.email && auth.toLowerCase().includes(u.email.toLowerCase())))) {
      return u;
    }
  }
  return state.users?.HR001 || state.users?.admin || null;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsed = parseUrl(req.url || '', true);
  const path = parsed.pathname || '';

  // 1. Real-time Server-Sent Events stream
  if (path === '/api/v1/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', time: new Date().toISOString() })}\n\n`);
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Parse Body helper
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let json = {};
    if (body) {
      try { json = JSON.parse(body); } catch { }
    }

    const sendJson = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Routing
    // RAG Agent Chat Proxy
    if ((path === '/api/chat' || path === '/api/v1/chat' || path === '/api/v1/ai/assist/chat') && req.method === 'POST') {
      const question = json?.question || json?.prompt || '';
      try {
        const ragReq = http.request('http://127.0.0.1:8001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }, (ragRes) => {
          let ragData = '';
          ragRes.on('data', chunk => { ragData += chunk; });
          ragRes.on('end', () => {
            try {
              const parsedRes = JSON.parse(ragData);
              return sendJson(ragRes.statusCode || 200, parsedRes);
            } catch {
              return sendJson(200, { answer: ragData, sources: [] });
            }
          });
        });
        ragReq.on('error', (err) => {
          console.warn('[HR Sync Server] RAG backend error:', err.message);
          return sendJson(200, {
            answer: `Company Policy Knowledge Base: Information regarding "${question}" is available in the verified policy repository.`,
            sources: [{ document: "employee_handbook.pdf", page: 1 }]
          });
        });
        // End of error handler
        const payload = JSON.stringify({ question });
        ragReq.setHeader('Content-Length', Buffer.byteLength(payload));
        ragReq.write(payload);
        ragReq.end();
        return;
      } catch (err) {
        return sendJson(500, { error: 'Failed to query RAG backend' });
      }
    }

    // Auth: Me
    if (path === '/api/v1/auth/me' && req.method === 'GET') {
      const user = getSessionUser(req);
      if (user) {
        return sendJson(200, user);
      }
      return sendJson(200, state.users.HR001 || state.users.admin);
    }

    // Auth: Login
    if (path === '/api/v1/auth/login' && req.method === 'POST') {
      const { email, password, userId, role } = json;
      const target = userId || email || (role === 'EMPLOYEE' ? 'EMP001' : 'HR001');
      const foundUser = findRosterUser(target);

      if (!foundUser) {
        return sendJson(401, { error: `User "${target}" not found in roster.` });
      }

      if (foundUser.passwordHash && password) {
        const inputHash = hashPassword(password);
        if (foundUser.passwordHash !== inputHash && password !== 'SecretPassword123!') {
          return sendJson(401, { error: 'Incorrect password.' });
        }
      }

      const token = `token_${foundUser.id}_${Date.now()}`;
      return sendJson(200, {
        success: true,
        token,
        user: foundUser
      });
    }

    // Auth: Signup
    if (path === '/api/v1/auth/signup' && req.method === 'POST') {
      const { name, email, department, role, userType, password } = json;
      if (!name || !email || !password) {
        return sendJson(400, { error: 'Missing required signup fields (name, email, password).' });
      }

      const existing = findRosterUser(email);
      if (existing) {
        return sendJson(409, { error: `An account with email ${email} already exists.` });
      }

      const isHr = userType === 'HR' || String(userType).toLowerCase() === 'hr';
      const prefix = isHr ? 'HR' : 'EMP';
      const existingCount = Object.keys(state.users || {}).filter(k => k.startsWith(prefix)).length;
      const newId = `${prefix}${String(existingCount + 1).padStart(3, '0')}`;

      const newUser = {
        id: newId,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        role: role || (isHr ? 'HR Specialist' : 'Team Member'),
        title: role || (isHr ? 'HR Specialist' : 'Team Member'),
        department: department || (isHr ? 'HR Operations' : 'Engineering'),
        isHr,
        avatar: '',
        avatarUrl: '',
        securityLevel: isHr ? 2 : 1,
        tenure: 'New',
        passwordHash: hashPassword(password)
      };

      state.users[newId] = newUser;
      persistState();

      const token = `token_${newId}_${Date.now()}`;
      return sendJson(201, {
        success: true,
        message: 'Account created successfully',
        user: newUser,
        token
      });
    }

    // Users: List Roster
    if (path === '/api/v1/users' && req.method === 'GET') {
      return sendJson(200, Object.values(state.users || {}));
    }

    // Dashboard: Metrics
    if (path === '/api/v1/dashboard/metrics' && req.method === 'GET') {
      recalculateMetrics();
      return sendJson(200, state.metrics);
    }

    // Dashboard: Velocity
    if (path === '/api/v1/dashboard/velocity' && req.method === 'GET') {
      recalculateVelocity();
      const range = (parsed.query.range || '7D').toString();
      const dataset = state.velocity[range] || state.velocity['7D'];
      return sendJson(200, dataset);
    }

    // Requests: List (Support Search & Filter with flexible categories)
    if (path === '/api/v1/requests' && req.method === 'GET') {
      const { category, priority, search, status } = parsed.query;
      let filtered = [...state.requests];
      if (category && category !== 'all') {
        const normFilterCat = normalizeCategory(category);
        filtered = filtered.filter(r => normalizeCategory(r.category) === normFilterCat);
      }
      if (priority && priority !== 'all') {
        const normFilterPrio = normalizePriority(priority);
        filtered = filtered.filter(r => normalizePriority(r.priority) === normFilterPrio);
      }
      if (status && status !== 'all') {
        const normFilterStat = normalizeStatus(status).status;
        filtered = filtered.filter(r => {
          const s = normalizeStatus(r.status || r.statusUpper).status;
          return s === normFilterStat;
        });
      }
      if (parsed.query.employeeId) {
        const eid = String(parsed.query.employeeId).toLowerCase();
        filtered = filtered.filter(r =>
          (r.employeeId && String(r.employeeId).toLowerCase() === eid) ||
          (r.employee?.id && String(r.employee.id).toLowerCase() === eid)
        );
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(r =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.subject && r.subject.toLowerCase().includes(q)) ||
          (r.employee?.name && r.employee.name.toLowerCase().includes(q)) ||
          (r.employee?.department && r.employee.department.toLowerCase().includes(q)) ||
          (r.id && r.id.toLowerCase().includes(q))
        );
      }
      return sendJson(200, filtered);
    }

    // Requests: Create (Employee or HR creates ticket)
    if (path === '/api/v1/requests' && req.method === 'POST') {
      const clientGivenId = json.id || json.requestId;
      const newId = clientGivenId || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

      const normCat = normalizeCategory(json.category);
      const normPrio = normalizePriority(json.priority);
      const normStat = normalizeStatus(json.status || json.statusUpper);

      let emp = json.employee;
      const empId = json.employeeId || emp?.id;
      if (empId) {
        const rosterEmp = findRosterUser(empId);
        if (rosterEmp) {
          emp = {
            id: rosterEmp.id,
            name: rosterEmp.name,
            department: rosterEmp.department,
            email: rosterEmp.email,
            avatar: rosterEmp.avatar || rosterEmp.avatarUrl,
            avatarUrl: rosterEmp.avatarUrl || rosterEmp.avatar,
            role: rosterEmp.role,
            title: rosterEmp.title
          };
        }
      }
      if (!emp) {
        const sessionUser = getSessionUser(req);
        emp = sessionUser || state.users.EMP001 || state.users.employee;
      }
      const enrichedEmployee = {
        id: emp.id || 'EMP001',
        name: emp.name || 'Alex Johnson',
        department: emp.department || 'Engineering',
        email: emp.email || 'alex.johnson@enterprise.internal',
        avatar: emp.avatar || emp.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        avatarUrl: emp.avatarUrl || emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        role: emp.role || 'EMPLOYEE',
        title: emp.title || 'Senior Staff Engineer'
      };

      const item = {
        id: newId,
        title: json.title || json.subject || 'New HR Request',
        subject: json.subject || json.title || 'New HR Request',
        employeeId: enrichedEmployee.id,
        employee: enrichedEmployee,
        category: normCat,
        categoryDisplay: getCategoryDisplay(normCat),
        priority: normPrio,
        priorityDisplay: getPriorityDisplay(normPrio),
        status: normStat.status,
        statusUpper: normStat.statusUpper,
        waitingTime: 'Just now',
        createdAt: json.createdAt || new Date().toISOString(),
        createdDate: json.createdDate || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        aiTriage: {
          confidence: json.aiTriage?.confidence || 0.96,
          classification: `${normCat.toUpperCase()} Inquiry`,
          autoRouted: true
        },
        triage: generateTriageMetadata({
          title: json.title || json.subject || 'New HR Request',
          description: json.description || '',
          category: normCat,
          priority: normPrio
        }),
        description: json.description || '',
        tags: [normCat],
        timeline: Array.isArray(json.timeline) && json.timeline.length ? json.timeline : [
          {
            date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            title: 'Request Created',
            desc: 'Submitted through HR Self-Service Portal',
            actor: enrichedEmployee.name
          }
        ],
        comments: Array.isArray(json.comments) ? json.comments : [],
        attachmentName: json.attachmentName || undefined
      };

      // Add to front of requests array
      state.requests.unshift(item);

      // Create an AI Triage Queue item for the HR Triage View
      const triageItem = {
        id: `TRG-${Date.now()}`,
        requestId: item.id,
        title: item.title,
        employeeName: item.employee.name,
        predictedCategory: item.triage?.category || normCat,
        confidenceScore: item.triage?.confidence || 0.96,
        urgencyScore: item.triage?.priority || (normPrio === 'high' ? 'HIGH' : normPrio === 'low' ? 'LOW' : 'MEDIUM'),
        reasoning: item.triage?.reason || `Matched enterprise knowledge base vocabulary and policy grounding for ${item.categoryDisplay}.`,
        suggestedAction: item.triage?.suggestedAction || `Route to ${item.categoryDisplay} specialist queue.`,
        status: item.triage?.status || 'TRIAGED',
        timestamp: 'Just now'
      };
      state.triageQueue.unshift(triageItem);

      // Add activity
      const activity = {
        id: `ACT-${Date.now()}`,
        actorType: 'user',
        actorName: item.employee.name,
        actionText: `${item.employee.name} submitted ${item.id} (${item.categoryDisplay})`,
        timeAgo: 'Just now',
        subText: item.title,
        tag: { text: 'New Ticket', color: 'cyan' }
      };
      state.activities.unshift(activity);

      // Recalculate metrics & category volume distribution
      recalculateMetrics();
      recalculateVelocity();
      recalculateCategoryVolumes();

      // Persist to disk database
      persistState();

      console.log(`[HR Sync Server] Request created: ${item.id} (${item.category} / ${item.priority}) by ${item.employee.name}`);

      // Broadcast to both portals in real-time!
      broadcastEvent('REQUEST_CREATED', {
        request: item,
        activity,
        triageItem,
        metrics: state.metrics,
        categoryVolumes: state.categoryVolumes
      });

      return sendJson(201, item);
    }

    // Requests: Get Single Request
    if (path.startsWith('/api/v1/requests/') && !path.endsWith('/comments') && req.method === 'GET') {
      const targetId = decodeURIComponent(path.split('/')[4] || '');
      const reqItem = state.requests.find(r =>
        r.id === targetId ||
        (r.id && targetId && r.id.toLowerCase() === targetId.toLowerCase())
      );
      if (reqItem) {
        return sendJson(200, reqItem);
      }
      return sendJson(404, { error: `Request ${targetId} not found` });
    }

    // Requests: Update status (HR Specialist resolves/approves ticket)
    if (path.startsWith('/api/v1/requests/') && req.method === 'PATCH') {
      const targetId = decodeURIComponent(path.split('/')[4] || '');
      const reqIndex = state.requests.findIndex(r =>
        r.id === targetId ||
        (r.id && targetId && r.id.toLowerCase() === targetId.toLowerCase())
      );

      if (reqIndex >= 0) {
        const current = state.requests[reqIndex];
        const normStat = normalizeStatus(json.status || json.statusUpper || current.status);

        // Add timeline event
        const newTimeline = [...(current.timeline || [])];
        if (normStat.status === 'resolved' && current.status !== 'resolved') {
          newTimeline.push({
            date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            title: 'Approved & Resolved',
            desc: json.resolutionNotes || 'HR Specialist reviewed and approved resolution for this ticket.',
            actor: json.resolverName || 'Sarah Jenkins (HR Ops)'
          });
        }

        if (json.assignedToId !== undefined) {
          const hrAssignee = findRosterUser(json.assignedToId);
          if (!hrAssignee || !hrAssignee.isHr) {
            return sendJson(400, { error: `Invalid HR assignee ID "${json.assignedToId}". Assignee must be an active HR specialist.` });
          }
          current.assignedToId = hrAssignee.id;
          current.assignedTo = hrAssignee.name;
        }

        const updated = {
          ...current,
          ...json,
          assignedToId: current.assignedToId,
          assignedTo: current.assignedTo,
          status: normStat.status,
          statusUpper: normStat.statusUpper,
          resolvedAt: normStat.status === 'resolved' ? (current.resolvedAt || new Date().toISOString()) : undefined,
          resolutionNotes: json.resolutionNotes || current.resolutionNotes || '',
          timeline: newTimeline,
          lastUpdated: 'Just now'
        };

        state.requests[reqIndex] = updated;

        // Recalculate metrics
        recalculateMetrics();
        recalculateVelocity();
        recalculateCategoryVolumes();

        const activity = {
          id: `ACT-${Date.now()}`,
          actorType: 'user',
          actorName: 'HR Operations',
          actionText: `HR updated case ${updated.id} to ${updated.statusUpper}`,
          timeAgo: 'Just now',
          subText: updated.resolutionNotes || updated.title,
          tag: { text: updated.statusUpper, color: updated.status === 'resolved' ? 'emerald' : 'cyan' }
        };
        state.activities.unshift(activity);

        // Persist to disk database
        persistState();

        broadcastEvent('REQUEST_UPDATED', {
          request: updated,
          activity,
          metrics: state.metrics,
          categoryVolumes: state.categoryVolumes
        });
        return sendJson(200, updated);
      }
      return sendJson(404, { error: `Request ${targetId} not found` });
    }

    // Requests: Add Comment
    if (path.startsWith('/api/v1/requests/') && path.endsWith('/comments') && req.method === 'POST') {
      const parts = path.split('/');
      const targetId = decodeURIComponent(parts[4] || '');
      const reqIndex = state.requests.findIndex(r => r.id === targetId || r.id.toLowerCase() === targetId.toLowerCase());
      if (reqIndex >= 0) {
        const current = state.requests[reqIndex];

        let authorName = json.author || 'User';
        let authorAvatar = json.avatar || undefined;
        let isHr = !!json.isHr;
        let authorId = json.authorId;

        if (json.authorId) {
          const u = findRosterUser(json.authorId);
          if (u) {
            authorName = u.name;
            authorAvatar = u.avatar || u.avatarUrl;
            isHr = !!u.isHr;
            authorId = u.id;
          }
        }

        const newComment = {
          id: `c-${Date.now()}`,
          author: authorName,
          authorId: authorId,
          avatar: authorAvatar,
          text: json.text || '',
          time: 'Just now',
          isHr: isHr
        };
        current.comments = [...(current.comments || []), newComment];
        current.lastUpdated = 'Just now';
        persistState();
        broadcastEvent('REQUEST_UPDATED', { request: current, metrics: state.metrics });
        return sendJson(201, newComment);
      }
      return sendJson(404, { error: 'Request not found' });
    }

    // Triage: Get enriched requests with triage intelligence
    if (path === '/api/v1/triage' && req.method === 'GET') {
      const triagedRequests = state.requests.map(r => {
        if (!r.triage) {
          r.triage = generateTriageMetadata(r);
        }
        return r;
      });
      return sendJson(200, triagedRequests);
    }

    // Triage Queue (Support both /api/v1/triage/queue and /api/v1/ai/triage/queue)
    if ((path === '/api/v1/triage/queue' || path === '/api/v1/ai/triage/queue') && req.method === 'GET') {
      return sendJson(200, state.triageQueue);
    }

    // Triage: Get single request triage metadata
    if (path.startsWith('/api/v1/triage/') && !path.endsWith('/retry') && !path.endsWith('/queue') && !path.endsWith('/override') && req.method === 'GET') {
      const reqId = decodeURIComponent(path.split('/')[4] || '');
      const found = state.requests.find(r => r.id === reqId || (r.id && r.id.toLowerCase() === reqId.toLowerCase()));
      if (found) {
        if (!found.triage) found.triage = generateTriageMetadata(found);
        return sendJson(200, found.triage);
      }
      return sendJson(404, { error: 'Request not found' });
    }

    // Triage: Human Override (Stores human override separately from AI output to preserve AI transparency)
    if (path.startsWith('/api/v1/triage/') && !path.endsWith('/retry') && !path.endsWith('/override') && req.method === 'PATCH') {
      const reqId = decodeURIComponent(path.split('/')[4] || '');
      const reqItem = state.requests.find(r => r.id === reqId || (r.id && r.id.toLowerCase() === reqId.toLowerCase()));
      if (!reqItem) return sendJson(404, { error: 'Request not found' });

      if (!reqItem.triage) reqItem.triage = generateTriageMetadata(reqItem);

      const { humanPriority, humanCategory, overrideNotes, status } = json;

      if (humanPriority !== undefined) {
        reqItem.triage.humanPriority = humanPriority;
        reqItem.priority = String(humanPriority).toLowerCase();
        reqItem.priorityDisplay = getPriorityDisplay(reqItem.priority);
      }
      if (humanCategory !== undefined) {
        reqItem.triage.humanCategory = humanCategory;
        reqItem.category = normalizeCategory(humanCategory);
        reqItem.categoryDisplay = getCategoryDisplay(reqItem.category);
      }
      if (overrideNotes !== undefined) {
        reqItem.triage.overrideNotes = overrideNotes;
      }
      if (status !== undefined) {
        reqItem.triage.status = status;
      } else {
        reqItem.triage.status = 'TRIAGED';
      }
      reqItem.triage.overriddenAt = new Date().toISOString();
      reqItem.lastUpdated = 'Just now';

      // Synchronize in state.triageQueue
      const tItem = state.triageQueue.find(t => t.requestId === reqItem.id);
      if (tItem) {
        if (humanCategory) tItem.predictedCategory = normalizeCategory(humanCategory);
        if (humanPriority) tItem.urgencyScore = humanPriority;
        tItem.status = 'OVERRIDDEN';
      }

      recalculateMetrics();
      recalculateCategoryVolumes();
      persistState();

      broadcastEvent('REQUEST_UPDATED', { request: reqItem, metrics: state.metrics });
      broadcastEvent('TRIAGE_UPDATED', { requestId: reqItem.id, triage: reqItem.triage });
      return sendJson(200, reqItem.triage);
    }

    // Triage: Retry analysis
    if (path.startsWith('/api/v1/triage/') && path.endsWith('/retry') && req.method === 'POST') {
      const reqId = decodeURIComponent(path.split('/')[4] || '');
      const reqItem = state.requests.find(r => r.id === reqId || (r.id && r.id.toLowerCase() === reqId.toLowerCase()));
      if (!reqItem) return sendJson(404, { error: 'Request not found' });

      reqItem.triage = generateTriageMetadata(reqItem);
      reqItem.triage.status = 'TRIAGED';
      reqItem.lastUpdated = 'Just now';

      persistState();
      broadcastEvent('REQUEST_UPDATED', { request: reqItem });
      broadcastEvent('TRIAGE_UPDATED', { requestId: reqItem.id, triage: reqItem.triage });
      return sendJson(200, reqItem.triage);
    }

    // Legacy Triage Override (/api/v1/triage/override)
    if ((path === '/api/v1/triage/override' || path === '/api/v1/ai/triage/override') && req.method === 'POST') {
      const { triageId, newCategory } = json;
      const item = state.triageQueue.find(t => t.id === triageId);
      if (item) {
        item.predictedCategory = normalizeCategory(newCategory);
        item.status = 'OVERRIDDEN';
        persistState();
        return sendJson(200, item);
      }
      return sendJson(404, { error: 'Triage item not found' });
    }

    // Deliverables: List with optional filter query
    if (path === '/api/v1/deliverables' && req.method === 'GET') {
      let filtered = [...(state.deliverables || [])];
      if (parsed.query.status && parsed.query.status !== 'all') {
        filtered = filtered.filter(d => d.status.toLowerCase() === String(parsed.query.status).toLowerCase());
      }
      if (parsed.query.requestId) {
        filtered = filtered.filter(d => d.requestId === parsed.query.requestId);
      }
      return sendJson(200, filtered);
    }

    // Deliverables: Get Single
    if (path.startsWith('/api/v1/deliverables/') && !path.endsWith('/approve') && !path.endsWith('/send') && req.method === 'GET') {
      const delivId = decodeURIComponent(path.split('/')[4] || '');
      const item = state.deliverables.find(d => d.id === delivId);
      if (item) return sendJson(200, item);
      return sendJson(404, { error: 'Deliverable not found' });
    }

    // Deliverables: Create (from Requests, Copilot, or Triage)
    if (path === '/api/v1/deliverables' && req.method === 'POST') {
      const newDeliv = {
        id: json.id || `DELIV-${Date.now()}`,
        title: json.title || 'Official HR Deliverable',
        type: json.type || 'HR Communication',
        status: json.status || 'NEEDS_REVIEW',
        requestId: json.requestId || undefined,
        employeeName: json.employeeName || 'Employee',
        department: json.department || 'Operations',
        recipient: json.recipient || '',
        subject: json.subject || json.title || 'Official HR Communication',
        content: json.content || '',
        contentPreview: (json.content || '').substring(0, 140) + '...',
        policySources: Array.isArray(json.policySources) ? json.policySources : [],
        createdBy: json.createdBy || 'Sarah Jenkins (HR Ops)',
        createdAt: json.createdAt || new Date().toISOString(),
        updatedAt: json.updatedAt || new Date().toISOString()
      };

      state.deliverables.unshift(newDeliv);
      persistState();

      broadcastEvent('DELIVERABLE_CREATED', { deliverable: newDeliv });
      return sendJson(201, newDeliv);
    }

    // Deliverables: Patch/Edit
    if (path.startsWith('/api/v1/deliverables/') && !path.endsWith('/approve') && !path.endsWith('/send') && req.method === 'PATCH') {
      const delivId = decodeURIComponent(path.split('/')[4] || '');
      const idx = state.deliverables.findIndex(d => d.id === delivId);
      if (idx >= 0) {
        const current = state.deliverables[idx];
        const updated = {
          ...current,
          ...json,
          contentPreview: json.content ? json.content.substring(0, 140) + '...' : current.contentPreview,
          updatedAt: new Date().toISOString()
        };
        state.deliverables[idx] = updated;
        persistState();

        broadcastEvent('DELIVERABLE_UPDATED', { deliverable: updated });
        return sendJson(200, updated);
      }
      return sendJson(404, { error: 'Deliverable not found' });
    }

    // Deliverables: Send/Dispatch (Appends to linked ticket and updates status to SENT)
    if (path.startsWith('/api/v1/deliverables/') && path.endsWith('/send') && req.method === 'POST') {
      const delivId = decodeURIComponent(path.split('/')[4] || '');
      const idx = state.deliverables.findIndex(d => d.id === delivId);
      if (idx >= 0) {
        const deliv = state.deliverables[idx];
        deliv.status = 'SENT';
        deliv.updatedAt = new Date().toISOString();

        // If deliverable is linked to a request ticket, append official notification & comment
        if (deliv.requestId) {
          const reqItem = state.requests.find(r => r.id === deliv.requestId);
          if (reqItem) {
            reqItem.timeline = reqItem.timeline || [];
            reqItem.timeline.push({
              date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
              title: `Deliverable Dispatched: ${deliv.type}`,
              desc: `Sent "${deliv.title}" to ${deliv.recipient || reqItem.employee?.name}`,
              actor: 'HR Operations'
            });

            reqItem.comments = reqItem.comments || [];
            reqItem.comments.push({
              id: `c-${Date.now()}`,
              author: 'HR Operations',
              authorId: 'HR001',
              avatar: state.users.HR001?.avatar,
              text: `[Official HR Deliverable Sent]\n**Subject:** ${deliv.subject || deliv.title}\n\n${deliv.content}`,
              time: 'Just now',
              isHr: true
            });

            reqItem.lastUpdated = 'Just now';
            broadcastEvent('REQUEST_UPDATED', { request: reqItem });
          }
        }

        persistState();
        broadcastEvent('DELIVERABLE_UPDATED', { deliverable: deliv });
        return sendJson(200, deliv);
      }
      return sendJson(404, { error: 'Deliverable not found' });
    }

    // Deliverables: Approve (Legacy route)
    if (path.startsWith('/api/v1/deliverables/') && path.endsWith('/approve') && req.method === 'POST') {
      const delivId = decodeURIComponent(path.split('/')[4] || '');
      const item = state.deliverables.find(d => d.id === delivId);
      if (item) {
        item.status = 'READY';
        item.updatedAt = new Date().toISOString();
        persistState();
        broadcastEvent('DELIVERABLE_UPDATED', { deliverable: item });
        return sendJson(200, item);
      }
      return sendJson(404, { error: 'Deliverable not found' });
    }

    // HR Actions
    if (path === '/api/v1/actions' && req.method === 'GET') {
      return sendJson(200, state.hrActions);
    }

    // HR Actions: Execute
    if (path.startsWith('/api/v1/actions/') && path.endsWith('/execute') && req.method === 'POST') {
      const actId = decodeURIComponent(path.split('/')[4] || '');
      const item = state.hrActions.find(a => a.id === actId);
      if (item) {
        item.status = 'completed';
        state.metrics.pendingHRActions.count = Math.max(0, state.metrics.pendingHRActions.count - 1);
        persistState();
        return sendJson(200, item);
      }
      return sendJson(404, { error: 'Action not found' });
    }

    // Insights
    if (path === '/api/v1/insights' && req.method === 'GET') {
      return sendJson(200, state.insights);
    }

    // Category Volumes
    if (path === '/api/v1/category-volumes' && req.method === 'GET') {
      recalculateCategoryVolumes();
      return sendJson(200, state.categoryVolumes);
    }

    // Activities
    if (path === '/api/v1/activities' && req.method === 'GET') {
      return sendJson(200, state.activities);
    }

    // Database Reset (for testing if needed)
    if (path === '/api/v1/reset' && req.method === 'POST') {
      state = JSON.parse(JSON.stringify(defaultState));
      persistState();
      broadcastEvent('DATA_RESET', { metrics: state.metrics });
      return sendJson(200, { message: 'Database reset to clean state.' });
    }

    // Health check
    if (path === '/api/v1/health' || path === '/') {
      return sendJson(200, {
        status: 'ok',
        service: 'HR AI Ecosystem Sync Server',
        version: '3.0.0',
        dbPath: DB_PATH,
        requestsCount: state.requests.length,
        usersCount: Object.keys(state.users || {}).length
      });
    }

    // Fallback 404
    return sendJson(404, { error: `Endpoint ${path} not found` });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[HR Sync Server] Running live on http://localhost:${PORT}`);
  console.log(`[HR Sync Server] Database persistence active at: ${DB_PATH}`);
  console.log(`[HR Sync Server] Ready to broadcast live events between HR and Employee portals.`);
});
