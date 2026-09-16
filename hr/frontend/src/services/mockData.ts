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

export const initialMetrics: DashboardMetrics = {
  openRequests: {
    count: 128,
    changePercent: 12.0,
    comparisonText: "+12% this wk"
  },
  highPriority: {
    count: 17,
    requiresAttention: 5
  },
  pendingHRActions: {
    count: 24,
    waitingOver24h: 8
  },
  slaCompliance: {
    percent: 94.8,
    changePercent: 2.1,
    targetPercent: 92.0
  },
  avgSla: "38m",
  resolvedOvernight: 72,
  aiTriagedToday: 86,
  aiAssistedCases: 64,
  draftsGenerated: 38
};

export const velocityDataset: Record<'7D' | '30D' | '90D', VelocityData> = {
  '7D': {
    range: '7D',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    incoming: [45, 52, 68, 80, 55, 92, 102],
    resolved: [38, 44, 58, 70, 62, 78, 88],
    openTotal: 128,
    receivedToday: 86,
    resolvedToday: 72
  },
  '30D': {
    range: '30D',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    incoming: [310, 420, 390, 480],
    resolved: [290, 405, 380, 460],
    openTotal: 128,
    receivedToday: 86,
    resolvedToday: 72
  },
  '90D': {
    range: '90D',
    labels: ['August', 'September', 'October'],
    incoming: [1250, 1480, 1620],
    resolved: [1210, 1420, 1590],
    openTotal: 128,
    receivedToday: 86,
    resolvedToday: 72
  }
};

export const initialRequests: RequestItem[] = [
  {
    id: "HR-1028",
    title: "Payroll discrepancy in Q3 retention bonus payment",
    employee: {
      id: "EMP-410",
      name: "Alex Johnson",
      department: "Platform Engineering",
      email: "alex.johnson@enterprise.internal",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      title: "Senior Staff Engineer",
      tenure: "3.5 years"
    },
    category: "payroll",
    priority: "high",
    status: "in_review",
    waitingTime: "3h 42m",
    createdAt: "2026-10-24T06:15:00Z",
    aiTriage: {
      confidence: 0.98,
      classification: "Payroll Discrepancy / Bonus Adjustment",
      autoRouted: true
    },
    description: "October payslip reflects standard base but omits the agreed retention milestone payment documented in Addendum C. Requesting payroll reconciliation before the Nov 1 tax cut-off.",
    tags: ["Bonus", "Addendum C", "Withholding"]
  },
  {
    id: "HR-1025",
    title: "Benefits eligibility: Dependent coverage under global plan",
    employee: {
      id: "EMP-492",
      name: "Priya Sharma",
      department: "Product Design",
      email: "priya.sharma@enterprise.internal",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      title: "Lead Product Designer",
      tenure: "2.1 years"
    },
    category: "benefits",
    priority: "medium",
    status: "in_review",
    waitingTime: "5h 12m",
    createdAt: "2026-10-24T04:45:00Z",
    aiTriage: {
      confidence: 0.94,
      classification: "Health Insurance Tier Expansion",
      autoRouted: true
    },
    description: "Inquiring if legal guardianship extension allows primary dependent enrollment under our European cross-border healthcare provider tier without underwriting waiting periods.",
    tags: ["Healthcare", "Dependents", "Cross-border"]
  },
  {
    id: "HR-1022",
    title: "Leave policy issue: Carry-forward sabbatical balance query",
    employee: {
      id: "EMP-304",
      name: "Daniel Thomas",
      department: "Data Infrastructure",
      email: "daniel.thomas@enterprise.internal",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      title: "Principal Architect",
      tenure: "4.8 years"
    },
    category: "leave",
    priority: "medium",
    status: "in_review",
    waitingTime: "7h 20m",
    createdAt: "2026-10-24T02:37:00Z",
    aiTriage: {
      confidence: 0.96,
      classification: "Statutory Sabbatical Reconciliation",
      autoRouted: true
    },
    description: "System flagged an automatic forfeiture warning on 12 days accrued sabbatical time. Policy Section 6.4 allows written exception for active production rollouts.",
    tags: ["Sabbatical", "Carry-forward", "Exemption"]
  },
  {
    id: "HR-1019",
    title: "Urgent: Relocation allowance reimbursement verification",
    employee: {
      id: "EMP-612",
      name: "Elena Rostova",
      department: "AI Research",
      email: "elena.r@enterprise.internal",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      title: "Research Scientist",
      tenure: "0.8 years"
    },
    category: "payroll",
    priority: "high",
    status: "open",
    waitingTime: "1h 15m",
    createdAt: "2026-10-24T08:42:00Z",
    aiTriage: {
      confidence: 0.99,
      classification: "Relocation Tax Exemption Review",
      autoRouted: true
    },
    description: "Submitted receipts for international relocation package. Finance requires HR sign-off on the gross-up rate before issuing payment voucher.",
    tags: ["Relocation", "Tax Gross-up"]
  },
  {
    id: "HR-1015",
    title: "Standard Verification of Employment for Mortgage Lender",
    employee: {
      id: "EMP-522",
      name: "Marcus Vance",
      department: "Legal & Compliance",
      email: "marcus.v@enterprise.internal",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      title: "Corporate Counsel",
      tenure: "1.9 years"
    },
    category: "documents",
    priority: "low",
    status: "resolved",
    waitingTime: "12m",
    createdAt: "2026-10-24T01:10:00Z",
    aiTriage: {
      confidence: 0.99,
      classification: "Automated VOE Dispatch",
      autoRouted: true
    },
    description: "Bank pre-approval requires signed letter confirming employment continuity, annual base compensation, and good standing.",
    tags: ["VOE", "Automated"]
  },
  {
    id: "HR-1011",
    title: "Remote Work Equipment Stipend claim for ergonomic desk",
    employee: {
      id: "EMP-733",
      name: "Kavita Nair",
      department: "Quality Assurance",
      email: "kavita.n@enterprise.internal",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      title: "Senior QA Analyst",
      tenure: "1.4 years"
    },
    category: "benefits",
    priority: "low",
    status: "resolved",
    waitingTime: "45m",
    createdAt: "2026-10-23T22:00:00Z",
    aiTriage: {
      confidence: 0.97,
      classification: "Fringe Benefit Approval",
      autoRouted: true
    },
    description: "Annual ergonomics stipend claim of $750 with attached receipt from Herman Miller. Awaiting manager approval acknowledgement.",
    tags: ["Stipend", "Remote Work"]
  }
];

export const initialTriageQueue: AITriageItem[] = [
  {
    id: "TR-904",
    requestId: "HR-1028",
    title: "Payroll discrepancy in Q3 retention bonus payment",
    employeeName: "Alex Johnson",
    predictedCategory: "payroll",
    confidenceScore: 0.98,
    urgencyScore: "HIGH",
    reasoning: "Keyword matching: 'withholding', 'retention bonus', 'Addendum C'. Scanned payroll ledger delta exceeds $3,000 threshold.",
    suggestedAction: "Route to Senior Payroll Specialist; run automated gross compensation recalculator tool.",
    status: "AUTO_ROUTED",
    timestamp: "2 mins ago"
  },
  {
    id: "TR-903",
    requestId: "HR-1025",
    title: "Benefits eligibility: Dependent coverage under global plan",
    employeeName: "Priya Sharma",
    predictedCategory: "benefits",
    confidenceScore: 0.94,
    urgencyScore: "MEDIUM",
    reasoning: "Matched European cross-border healthcare underwriter guideline #41. Dependent legal status requires proof of guardianship.",
    suggestedAction: "Request notarized legal custody decree from employee and dispatch carrier rider form.",
    status: "NEEDS_VERIFICATION",
    timestamp: "14 mins ago"
  },
  {
    id: "TR-902",
    requestId: "HR-1022",
    title: "Leave policy issue: Carry-forward sabbatical balance query",
    employeeName: "Daniel Thomas",
    predictedCategory: "leave",
    confidenceScore: 0.96,
    urgencyScore: "MEDIUM",
    reasoning: "Detected sabbatical forfeiture notification trigger. Tenure is > 3 years (eligible under section 6.4 handbook).",
    suggestedAction: "Generate automatic 6-month extension authorization voucher with VP Engineering approval tag.",
    status: "AUTO_ROUTED",
    timestamp: "32 mins ago"
  },
  {
    id: "TR-901",
    requestId: "HR-1019",
    title: "Urgent: Relocation allowance reimbursement verification",
    employeeName: "Elena Rostova",
    predictedCategory: "payroll",
    confidenceScore: 0.99,
    urgencyScore: "HIGH",
    reasoning: "Tax equalization policy applied. Cross-referenced immigration visa type O-1 with mobility tax credit table.",
    suggestedAction: "Apply tax gross-up rate of 38.2% and forward to Global Mobility Payroll batch.",
    status: "AUTO_ROUTED",
    timestamp: "1 hour ago"
  }
];

export const initialDeliverables: DeliverableItem[] = [
  {
    id: "DEL-1024",
    title: "Alex Johnson - Q3 Retention Bonus Reconciliation Addendum",
    type: "compensation_letter",
    employeeName: "Alex Johnson",
    department: "Platform Engineering",
    status: "pending_approval",
    generatedAt: "Today, 08:30 AM",
    contentPreview: "Official confirmation of adjusted retention milestone payout of $5,000 to be reflected on November 1st payroll cycle with retroactive tax adjustment."
  },
  {
    id: "DEL-1021",
    title: "Priya Sharma - Cross-Border Dependent Health Rider Notice",
    type: "policy_acknowledgement",
    employeeName: "Priya Sharma",
    department: "Product Design",
    status: "pending_approval",
    generatedAt: "Today, 07:45 AM",
    contentPreview: "Underwriter acceptance document specifying supplemental dependent healthcare coverage terms across UK & EU locations effective Dec 1st."
  },
  {
    id: "DEL-1018",
    title: "Daniel Thomas - Sabbatical Carryover Exemption Letter",
    type: "sabbatical_approval",
    employeeName: "Daniel Thomas",
    department: "Data Infrastructure",
    status: "approved",
    generatedAt: "Today, 05:20 AM",
    contentPreview: "Formal notice approving a 6-month extension to utilize 12 accrued sabbatical days through June 30, 2027 due to production infrastructure release."
  },
  {
    id: "DEL-1015",
    title: "Marcus Vance - Standard Verification of Employment",
    type: "verification_of_employment",
    employeeName: "Marcus Vance",
    department: "Legal & Compliance",
    status: "dispatched",
    generatedAt: "Today, 01:12 AM",
    contentPreview: "Encrypted verifiable digital credential confirming current employment status, job title, and tenure sent directly to Chase Mortgage Underwriting."
  }
];

export const initialHRActions: HRActionItem[] = [
  {
    id: "ACT-841",
    title: "Approve Off-Cycle Payroll Adjustment",
    type: "salary_adjustment",
    employeeName: "Alex Johnson",
    department: "Platform Engineering",
    urgency: "HIGH",
    status: "pending",
    timestamp: "Waiting 3h 42m",
    effectiveDate: "Nov 01, 2026",
    summary: "Execute $5,000 bonus disbursement and retroactive tax withholding correction."
  },
  {
    id: "ACT-840",
    title: "Sign-off Cross-Border Dependent Rider",
    type: "leave_signoff",
    employeeName: "Priya Sharma",
    department: "Product Design",
    urgency: "NORMAL",
    status: "pending",
    timestamp: "Waiting 5h 12m",
    effectiveDate: "Dec 01, 2026",
    summary: "Validate legal guardianship certificate and authorize supplemental insurance premium tier."
  },
  {
    id: "ACT-839",
    title: "Approve Sabbatical Carry-Forward Exception",
    type: "leave_signoff",
    employeeName: "Daniel Thomas",
    department: "Data Infrastructure",
    urgency: "NORMAL",
    status: "pending",
    timestamp: "Waiting 7h 20m",
    effectiveDate: "Immediately",
    summary: "Grant 180-day grace period on 12 sabbatical days before forfeiture calculation."
  },
  {
    id: "ACT-838",
    title: "Execute Senior Staff Promotion Workflow",
    type: "role_transition",
    employeeName: "Elena Rostova",
    department: "AI Research",
    urgency: "HIGH",
    status: "pending",
    timestamp: "Waiting 1h 15m",
    effectiveDate: "Nov 15, 2026",
    summary: "Update job code to RES-L6, adjust equity tranche schedule, and notify department lead."
  }
];

export const initialInsights: InsightItem[] = [
  {
    id: "INS-1",
    title: "Payroll requests ↑ 23%",
    description: "Increase in payroll-related requests over the last 30 days due to tax deduction queries.",
    icon: "payments",
    type: "info",
    changeText: "+23% last 30d"
  },
  {
    id: "INS-2",
    title: "Leave requests taking longer",
    description: "Resolution time is 31% above the HR average. Suggest updating self-service sabbatical guidelines.",
    icon: "timelapse",
    type: "warning",
    changeText: "+31% resolution lag"
  },
  {
    id: "INS-3",
    title: "Insurance FAQ recurring",
    description: "Frequently repeated employee question on annual dental coverage limits.",
    icon: "quiz",
    type: "emerald",
    changeText: "82 query citations"
  }
];

export const initialCategoryVolumes: CategoryVolume[] = [
  {
    name: "Payroll",
    count: 42,
    percent: 32,
    colorGradient: "from-blue-500 to-cyan-400 shadow-[0_0_8px_#00f0ff]",
    barWidthPercent: 40
  },
  {
    name: "Benefits",
    count: 28,
    percent: 22,
    colorGradient: "from-purple-500 to-indigo-400 shadow-[0_0_8px_#a855f7]",
    barWidthPercent: 27
  },
  {
    name: "Leave & Attendance",
    count: 24,
    percent: 19,
    colorGradient: "from-emerald-500 to-teal-400 shadow-[0_0_8px_#10b981]",
    barWidthPercent: 23
  },
  {
    name: "Documents",
    count: 18,
    percent: 14,
    colorGradient: "bg-cyan-400",
    barWidthPercent: 17
  },
  {
    name: "Policy & Compliance",
    count: 14,
    percent: 11,
    colorGradient: "bg-amber-400",
    barWidthPercent: 13
  },
  {
    name: "Other",
    count: 8,
    percent: 6,
    colorGradient: "bg-white/30",
    barWidthPercent: 8
  }
];

export const initialActivities: ActivityEvent[] = [
  {
    id: "ACT-LOG-1",
    actorType: "ai",
    actorName: "AI",
    actionText: "AI triaged HR-1028 Payroll",
    timeAgo: "2 min ago",
    subText: "Autonomous confidence 98%",
    tag: {
      text: "High priority",
      color: "rose"
    }
  },
  {
    id: "ACT-LOG-2",
    actorType: "user",
    actorName: "Sarah",
    actionText: "Sarah approved deliverable HR-1024",
    timeAgo: "18 min ago",
    subText: "Employee response letter generated",
    tag: {
      text: "Approved",
      color: "cyan"
    }
  },
  {
    id: "ACT-LOG-3",
    actorType: "resolved",
    actorName: "Resolved",
    actionText: "HR-1021 resolved Benefits",
    timeAgo: "32 min ago",
    subText: "Priya Sharma dependent tier confirmed",
    tag: {
      text: "Completed",
      color: "emerald"
    }
  }
];

export const initialCopilotMessages: CopilotMessage[] = [
  {
    id: "COP-1",
    sender: "assistant",
    text: "Hello Sarah. I am your HR AI Assistant grounded in enterprise policies, statutory labor laws, and live employee rosters. How can I assist you with operations today?",
    timestamp: "09:00 AM",
    suggestedActions: [
      "Review Alex Johnson's Q3 retention bonus addendum",
      "Check sabbatical carry-forward policy limits",
      "Draft Verification of Employment for Elena Rostova"
    ]
  }
];
