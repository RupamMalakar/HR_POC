import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hrService } from '../../services/hrService';
import { RequestItem, DeliverableItem, Category, CopilotMessage } from '../../types/hr';
import {
  Sparkles, PlusCircle, CheckCircle2, Clock, AlertCircle, FileText,
  MessageSquare, User, LogOut, ArrowRight, ShieldCheck, Send, ExternalLink
} from 'lucide-react';

type EmployeeTab = 'my-requests' | 'new-request' | 'ai-assistant' | 'my-documents' | 'my-profile';

export const EmployeePortal: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<EmployeeTab>('my-requests');
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Request Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('payroll');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Copilot Chat State
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I am your AI HR Assistant grounded in the 2026 Enterprise Handbook. Ask me anything about your leave eligibility, benefits enrollment, bonus schedules, or company policies.`,
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Load employee's data
  useEffect(() => {
    async function loadEmployeeData() {
      try {
        setLoading(true);
        const [reqs, delivs] = await Promise.all([
          hrService.getRequests(),
          hrService.getDeliverables()
        ]);
        setRequests(reqs);
        setDeliverables(delivs);
      } catch (err) {
        console.warn('Error loading employee data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEmployeeData();
  }, [user]);

  // Handle new request submission
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const created = await hrService.createRequest({
        title: newTitle,
        category: newCategory,
        priority: newPriority,
        description: newDescription,
        employee: {
          id: user?.id || 'EMP-410',
          name: user?.name || 'Alex Johnson',
          department: 'Platform Engineering',
          email: user?.email || 'alex.johnson@enterprise.internal',
          avatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
        }
      });
      setRequests(prev => [created, ...prev]);
      setSubmitSuccess(true);
      setNewTitle('');
      setNewDescription('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('my-requests');
      }, 1400);
    } catch (err) {
      alert('Error submitting inquiry: ' + err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle chat submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const assistantMsg = await hrService.queryCopilot(userText);
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'According to our 2026 Enterprise Guidelines, your inquiry has been logged. Full handbook sections are available in your portal.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#060814] text-slate-200 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#090d24]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Employee Self-Service Desk</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                USER PORTAL
              </span>
            </div>
            <p className="text-xs text-white/50">Autonomous ticket tracking & AI policy assistance</p>
          </div>
        </div>

        {/* User Badge & Role Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
              alt="User Avatar"
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
            />
            <div className="text-left">
              <div className="text-xs font-semibold text-white">{user?.name}</div>
              <div className="text-[10px] text-cyan-300/70 font-mono">{user?.title || 'Staff Member'}</div>
            </div>
          </div>

          <button
            onClick={() => demoLogin('HR_ADMIN')}
            className="text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center gap-1.5 transition-all"
            title="Switch to HR Administrator Cockpit"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Switch to</span> HR Portal →
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 hover:text-white transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              activeTab === 'my-requests'
                ? 'bg-cyan-500/15 border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold">My Requests</div>
              <div className="text-[10px] text-white/40">Status lifecycle & tickets</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              {requests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('new-request')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              activeTab === 'new-request'
                ? 'bg-cyan-500/15 border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold">Submit Request</div>
              <div className="text-[10px] text-white/40">Instant AI intake & triage</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-cyan-500/15 border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold">AI HR Copilot</div>
              <div className="text-[10px] text-white/40">Handbook & policy guidance</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('my-documents')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              activeTab === 'my-documents'
                ? 'bg-cyan-500/15 border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold">My Documents</div>
              <div className="text-[10px] text-white/40">Letters & verified addendums</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {deliverables.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my-profile')}
            className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              activeTab === 'my-profile'
                ? 'bg-cyan-500/15 border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10'
                : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-amber-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold">My Profile</div>
              <div className="text-[10px] text-white/40">Tenure & coverage tier</div>
            </div>
          </button>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 min-w-0">
          {/* TAB 1: MY REQUESTS */}
          {activeTab === 'my-requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">My Active Requests</h2>
                  <p className="text-xs text-white/50">Tracking your inquiries with real-time AI autonomous classification</p>
                </div>
                <button
                  onClick={() => setActiveTab('new-request')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Inquiry</span>
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-white/40 text-xs">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                  <Clock className="w-8 h-8 text-white/30 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-white">No active requests</h3>
                  <p className="text-xs text-white/50 mt-1">Submit a new inquiry to get autonomous assistance.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-[#090e24]/70 backdrop-blur-xl border border-white/10 hover:border-cyan-400/30 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-cyan-300 font-bold">{req.id}</span>
                          <span className="text-xs text-white/30">•</span>
                          <span className="text-xs font-semibold text-white">{req.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-medium ${
                            req.status === 'resolved'
                              ? 'bg-emerald-500/15 border border-emerald-400/30 text-emerald-300'
                              : req.status === 'in_review'
                              ? 'bg-amber-500/15 border border-amber-400/30 text-amber-300'
                              : 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-300'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded bg-white/5">
                            {req.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed">{req.description}</p>

                      {/* AI Triage Banner */}
                      {req.aiTriage && (
                        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs flex items-center gap-2 text-cyan-300">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-mono text-[10px] text-white/50">AI Triage:</span>
                          <span className="text-xs font-medium">{req.aiTriage.classification}</span>
                          <span className="text-[10px] font-mono text-cyan-400/70 ml-auto">
                            {(req.aiTriage.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      )}

                      {/* Resolution Notes if Resolved */}
                      {req.resolutionNotes && (
                        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>HR Specialist Resolution Notes</span>
                          </div>
                          <p className="text-white/80 text-xs">{req.resolutionNotes}</p>
                        </div>
                      )}

                      {/* Live Lifecycle Progress Tracker */}
                      <div className="pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1.5">
                          <span>1. Intake</span>
                          <span>2. AI Triaged</span>
                          <span>3. HR Review</span>
                          <span>4. Resolved</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                          <div className="h-full bg-cyan-400 w-1/4" />
                          <div className="h-full bg-cyan-400 w-1/4" />
                          <div className={`h-full ${req.status === 'in_review' || req.status === 'resolved' ? 'bg-cyan-400' : 'bg-transparent'} w-1/4`} />
                          <div className={`h-full ${req.status === 'resolved' ? 'bg-emerald-400' : 'bg-transparent'} w-1/4`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBMIT NEW REQUEST */}
          {activeTab === 'new-request' && (
            <div className="max-w-2xl mx-auto rounded-3xl bg-[#090e24]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Submit New HR Inquiry</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  Our Autonomous Triage Engine will instantly analyze policy requirements and route your case.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ticket successfully created and triaged! Redirecting to queue...</span>
                </div>
              )}

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Inquiry Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="payroll">Payroll & Compensation</option>
                    <option value="benefits">Benefits & Health Insurance</option>
                    <option value="leave">Leave & Sabbatical</option>
                    <option value="documents">Official Documents & Verification</option>
                    <option value="compliance">Policy & Compliance</option>
                    <option value="other">Other General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Subject / Summary</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Q3 bonus withholding clarification"
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                          newPriority === p
                            ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                            : 'bg-white/5 border border-white/10 text-white/50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Detailed Inquiry</label>
                  <textarea
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    placeholder="Provide full context, dates, or relevant appendices..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                {/* Live Preview Box */}
                {newTitle && (
                  <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant AI Autonomous Classification Simulation</span>
                    </div>
                    <div className="text-white/80 text-xs">
                      Category target: <span className="text-cyan-300 font-semibold">{newCategory}</span> ({newPriority} priority)
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {submitting ? 'Submitting & Triaging...' : 'Submit Inquiry to HR Queue'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: AI HR COPILOT */}
          {activeTab === 'ai-assistant' && (
            <div className="h-[640px] flex flex-col rounded-3xl bg-[#090e24]/80 backdrop-blur-xl border border-white/10 overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">HR Policy Assistant (Copilot)</h3>
                    <p className="text-[10px] text-white/50">Grounded in the 2026 Enterprise Employee Handbook</p>
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500/20 border border-cyan-400/30 text-white rounded-br-none'
                          : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                            Policy Citations:
                          </span>
                          {msg.citations.map((c, i) => (
                            <div key={i} className="text-[11px] text-white/60 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <span>{c.title} — {c.section} {c.page ? `(p. ${c.page})` : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-white/30 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 max-w-xs text-xs text-white/50 flex items-center gap-2">
                    <span className="animate-spin text-sm">◌</span>
                    <span>Consulting policy handbook...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 bg-black/30 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about sabbatical rules, bonus payment timelines, dependent coverage..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: MY DOCUMENTS */}
          {activeTab === 'my-documents' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-white/10">
                <h2 className="text-lg font-bold text-white tracking-tight">My Official HR Documents</h2>
                <p className="text-xs text-white/50">Cryptographically signed verification letters and agreements</p>
              </div>

              {deliverables.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10">
                  <FileText className="w-8 h-8 text-white/30 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-white">No documents generated yet</h3>
                  <p className="text-xs text-white/50 mt-1">
                    Request an Employment Verification Letter or resolution in the requests tab.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deliverables.map((deliv) => (
                    <div
                      key={deliv.id}
                      className="p-5 rounded-2xl bg-[#090e24]/70 backdrop-blur-xl border border-white/10 hover:border-blue-400/30 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-400/20">
                          {deliv.id}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          deliv.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-400/30'
                        }`}>
                          {deliv.status}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white">{deliv.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-3">{deliv.contentPreview}</p>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-white/40">{deliv.type}</span>
                        <a
                          href={deliv.pdfUrl || deliv.previewUrl || '#'}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading official PDF for ${deliv.title}`);
                          }}
                          className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                        >
                          <span>View Official PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MY PROFILE */}
          {activeTab === 'my-profile' && (
            <div className="max-w-2xl mx-auto rounded-3xl bg-[#090e24]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-400/40 shadow-xl"
                />
                <div>
                  <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                  <p className="text-xs text-cyan-300 font-mono">{user?.title || 'Senior Staff Engineer'}</p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Department</div>
                  <div className="text-white font-medium mt-0.5">Platform Engineering</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Tenure</div>
                  <div className="text-white font-medium mt-0.5">3.5 years (Eligible for Sabbatical)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Assigned HR Specialist</div>
                  <div className="text-white font-medium mt-0.5">Sarah Jenkins (HR Operations Lead)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase">Healthcare Tier</div>
                  <div className="text-white font-medium mt-0.5">Global Tier 1 (Cigna Executive Cross-Border)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
