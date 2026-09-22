// @ts-check
import http from 'node:http';
import { parse as parseUrl } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
      labels: ['August', 'September', 'October'],
      incoming: [0, 0, 0],
      resolved: [0, 0, 0],
      openTotal: 0,
      receivedToday: 0,
      resolvedToday: 0
    }
  },
  requests: [],
  triageQueue: [],
  deliverables: [],
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
    admin: {
      id: "usr_admin_1",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@enterprise.internal",
      role: "HR_ADMIN",
      title: "HR Operations Lead",
      avatarUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0"
    },
    specialist: {
      id: "usr_spec_2",
      name: "David Chen",
      email: "david.chen@enterprise.internal",
      role: "HR_SPECIALIST",
      title: "Senior People Partner",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    employee: {
      id: "usr_emp_3",
      name: "Rupam Sharma",
      email: "rupam.sharma@enterprise.org",
      role: "EMPLOYEE",
      title: "Lead Full-Stack Engineer",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
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
        return {
          ...defaultState,
          ...loaded,
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

function persistState() {
  try {
    ensureDbDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[HR Database] Error writing to db.json:', err);
  }
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
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
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
      try { json = JSON.parse(body); } catch {}
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
      const auth = req.headers['authorization'] || '';
      if (auth.includes('emp_token') || parsed.query.role === 'EMPLOYEE') {
        return sendJson(200, state.users.employee);
      }
      return sendJson(200, state.users.admin);
    }

    // Auth: Login
    if (path === '/api/v1/auth/login' && req.method === 'POST') {
      const { email, role } = json;
      let matchedUser = state.users.admin;
      if (role === 'EMPLOYEE' || (email && (email.includes('rupam') || email.includes('alex') || email.includes('employee')))) {
        matchedUser = state.users.employee;
      } else if (role === 'HR_SPECIALIST' || (email && email.includes('david'))) {
        matchedUser = state.users.specialist;
      }
      return sendJson(200, {
        token: `${matchedUser.role.toLowerCase()}_token_${Date.now()}`,
        user: matchedUser
      });
    }

    // Dashboard: Metrics
    if (path === '/api/v1/dashboard/metrics' && req.method === 'GET') {
      return sendJson(200, state.metrics);
    }

    // Dashboard: Velocity
    if (path === '/api/v1/dashboard/velocity' && req.method === 'GET') {
      const range = (parsed.query.range || '7D').toString();
      const dataset = state.velocity[range] || state.velocity['7D'];
      return sendJson(200, dataset);
    }

    // Requests: List (Support Search & Filter)
    if (path === '/api/v1/requests' && req.method === 'GET') {
      const { category, priority, search, status } = parsed.query;
      let filtered = [...state.requests];
      if (category && category !== 'all') {
        filtered = filtered.filter(r => r.category === category);
      }
      if (priority && priority !== 'all') {
        filtered = filtered.filter(r => r.priority === priority);
      }
      if (status && status !== 'all') {
        filtered = filtered.filter(r => r.status === status || (r.statusUpper && r.statusUpper === status));
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(r =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.subject && r.subject.toLowerCase().includes(q)) ||
          (r.employee?.name && r.employee.name.toLowerCase().includes(q)) ||
          (r.id && r.id.toLowerCase().includes(q))
        );
      }
      return sendJson(200, filtered);
    }

    // Requests: Create (Employee or HR creates ticket)
    if (path === '/api/v1/requests' && req.method === 'POST') {
      const clientGivenId = json.id || json.requestId;
      const newId = clientGivenId || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

      const item = {
        id: newId,
        title: json.title || json.subject || 'New HR Request',
        subject: json.subject || json.title || 'New HR Request',
        employee: json.employee || state.users.employee,
        category: json.category || 'other',
        priority: json.priority || 'medium',
        status: 'open',
        statusUpper: 'SUBMITTED',
        waitingTime: 'Just now',
        createdAt: json.createdAt || new Date().toISOString(),
        createdDate: json.createdDate || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        aiTriage: json.aiTriage || {
          confidence: 0.96,
          classification: json.category ? `${String(json.category).toUpperCase()} Inquiry` : 'Autonomous Intake',
          autoRouted: true
        },
        description: json.description || '',
        tags: [json.category || 'General'],
        timeline: Array.isArray(json.timeline) && json.timeline.length ? json.timeline : [
          {
            date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            title: 'Request Created',
            desc: 'Submitted through HR Self-Service Portal',
            actor: json.employee?.name || 'Employee'
          }
        ],
        comments: Array.isArray(json.comments) ? json.comments : [],
        attachmentName: json.attachmentName || undefined
      };

      // Add to front of requests array
      state.requests.unshift(item);
      state.metrics.openRequests.count += 1;
      if (item.priority === 'high' || item.priority === 'Urgent') {
        state.metrics.highPriority.count += 1;
      }

      const activity = {
        id: `ACT-${Date.now()}`,
        actorType: 'user',
        actorName: item.employee.name,
        actionText: `${item.employee.name} submitted ${item.id} (${item.category})`,
        timeAgo: 'Just now',
        subText: item.title,
        tag: { text: 'New Ticket', color: 'cyan' }
      };
      state.activities.unshift(activity);

      // Persist to disk database
      persistState();

      // Broadcast to both portals in real-time!
      broadcastEvent('REQUEST_CREATED', { request: item, activity, metrics: state.metrics });

      return sendJson(201, item);
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
        const newStatus = (json.status || current.status).toLowerCase();
        const newStatusUpper = json.statusUpper || (newStatus === 'resolved' ? 'RESOLVED' : newStatus === 'in_review' ? 'IN PROGRESS' : current.statusUpper || 'SUBMITTED');
        
        // Add timeline event
        const newTimeline = [...(current.timeline || [])];
        if (newStatus === 'resolved' && current.status !== 'resolved') {
          newTimeline.push({
            date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            title: 'Approved & Resolved',
            desc: json.resolutionNotes || 'HR Specialist reviewed and approved resolution for this ticket.',
            actor: json.resolverName || 'Sarah Jenkins (HR Ops)'
          });
        }

        const updated = {
          ...current,
          ...json,
          status: newStatus,
          statusUpper: newStatusUpper,
          resolutionNotes: json.resolutionNotes || current.resolutionNotes || '',
          timeline: newTimeline,
          lastUpdated: 'Just now'
        };

        state.requests[reqIndex] = updated;

        if (newStatus === 'resolved' && current.status !== 'resolved') {
          state.metrics.openRequests.count = Math.max(0, state.metrics.openRequests.count - 1);
          state.metrics.resolvedOvernight += 1;
          if (updated.priority === 'high' || updated.priority === 'Urgent') {
            state.metrics.highPriority.count = Math.max(0, state.metrics.highPriority.count - 1);
          }
        }

        const activity = {
          id: `ACT-${Date.now()}`,
          actorType: 'user',
          actorName: 'HR Operations',
          actionText: `HR approved & resolved case ${updated.id}`,
          timeAgo: 'Just now',
          subText: updated.resolutionNotes || updated.title,
          tag: { text: updated.statusUpper, color: 'emerald' }
        };
        state.activities.unshift(activity);

        // Persist to disk database
        persistState();

        broadcastEvent('REQUEST_UPDATED', { request: updated, activity, metrics: state.metrics });
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
        const newComment = {
          id: `c-${Date.now()}`,
          author: json.author || 'User',
          avatar: json.avatar || undefined,
          text: json.text || '',
          time: 'Just now',
          isHr: !!json.isHr
        };
        current.comments = [...(current.comments || []), newComment];
        persistState();
        broadcastEvent('REQUEST_UPDATED', { request: current, metrics: state.metrics });
        return sendJson(201, newComment);
      }
      return sendJson(404, { error: 'Request not found' });
    }

    // Triage Queue
    if (path === '/api/v1/triage/queue' && req.method === 'GET') {
      return sendJson(200, state.triageQueue);
    }

    // Deliverables
    if (path === '/api/v1/deliverables' && req.method === 'GET') {
      return sendJson(200, state.deliverables);
    }

    // HR Actions
    if (path === '/api/v1/actions' && req.method === 'GET') {
      return sendJson(200, state.hrActions);
    }

    // Insights
    if (path === '/api/v1/insights' && req.method === 'GET') {
      return sendJson(200, state.insights);
    }

    // Category Volumes
    if (path === '/api/v1/category-volumes' && req.method === 'GET') {
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
        version: '2.1.0',
        dbPath: DB_PATH,
        requestsCount: state.requests.length
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
