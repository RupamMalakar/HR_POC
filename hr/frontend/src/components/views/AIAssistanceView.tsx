import React, { useState } from 'react';
import { CopilotMessage } from '../../types/hr';
import { hrService } from '../../services/hrService';

interface AIAssistanceViewProps {
  initialMessages?: CopilotMessage[];
  onOpenNewAction?: () => void;
}

export const AIAssistanceView: React.FC<AIAssistanceViewProps> = ({
  onOpenNewAction
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'COP-0',
      sender: 'assistant',
      text: 'Hello Sarah. I am your HR AI Assistant grounded in enterprise policies, statutory labor laws, and live employee rosters. How can I assist you with operations today?',
      timestamp: '09:00 AM',
      suggestedActions: [
        "Review Alex Johnson's Q3 retention bonus addendum",
        "Check sabbatical carry-forward policy limits",
        "Draft Verification of Employment for Elena Rostova"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: `USR-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await hrService.queryCopilot(query);
      setMessages(prev => [...prev, response]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Top Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 backdrop-blur-2xl border border-white/15 shadow-glass-elevated flex items-center justify-between specular-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-neon-cyan border border-white/20">
            <span className="material-symbols-outlined text-[26px]">smart_toy</span>
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white tracking-tight">
              Enterprise HR AI Copilot
            </h2>
            <p className="text-xs text-white/50">
              Grounded in 14 internal handbooks, compliance codes, and live payroll matrices
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span>RAG Vector DB Connected</span>
        </div>
      </div>

      {/* Chat Canvas */}
      <div className="rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass flex flex-col h-[560px] overflow-hidden specular-border">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                    isUser
                      ? 'bg-blue-600 border border-white/20'
                      : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-neon-violet'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isUser ? 'person' : 'smart_toy'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2.5 ${isUser ? 'text-right' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed text-left inline-block ${
                      isUser
                        ? 'bg-blue-600/30 border border-blue-400/30 text-white'
                        : 'bg-white/[0.05] border border-white/10 text-slate-100'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left space-y-1.5">
                      <p className="font-mono text-[10px] uppercase text-cyan-300 font-semibold tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">menu_book</span>
                        Verified Citations:
                      </p>
                      {msg.citations.map((c, i) => (
                        <div key={i} className="text-[11px] text-white/70">
                          <span className="font-semibold text-white">{c.title}</span> — {c.section} {c.page ? `(p. ${c.page})` : ''}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {msg.suggestedActions && (
                    <div className="flex flex-wrap gap-2 pt-1 text-left">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(act)}
                          className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono transition-all cursor-pointer"
                        >
                          + {act}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-white/40 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 max-w-xl">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-300">
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 text-xs text-cyan-300 font-mono flex items-center gap-2">
                <span>Grounding policy knowledge &amp; drafting response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about enterprise HR handbook, leave quotas, or case resolutions..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-neon-cyan transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-neon-cyan transition-all disabled:opacity-50 cursor-pointer"
          >
            Send Query
          </button>
        </div>
      </div>
    </div>
  );
};
