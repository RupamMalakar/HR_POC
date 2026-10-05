import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { PolicyItem } from '../types';
import { KNOWLEDGE_FAQS } from '../data/mockData';

interface KnowledgeHubViewProps {
  policies: PolicyItem[];
  onSelectPolicy: (policy: PolicyItem) => void;
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({
  policies,
  onSelectPolicy,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    'All',
    'Leave & Family',
    'Payroll & Tax',
    'Workplace & IT',
    'Benefits & Wellness',
    'General Standards',
  ];

  const filtered = policies.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      (p.fileName && p.fileName.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-[1560px] mx-auto space-y-6">
      {/* Header & Search */}
      <div className="crystal-glass rounded-2xl p-6 shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-500/20 text-[#0D9488] dark:text-teal-400 border border-teal-200/60 dark:border-teal-500/30 flex items-center gap-1">
              <FileCheck2 className="w-3 h-3" />
              Official Policy Suite • 6-Page Standard
            </span>
          </div>
          <h1 className="text-[24px] font-bold text-[#0F172A] dark:text-white">Knowledge Hub & HR Policies</h1>
          <p className="text-[13px] text-[#334155] dark:text-slate-300 mt-0.5">
            Verified corporate guidelines, benefits documentation, and standard operating procedures directly sourced from <code className="text-teal-700 dark:text-teal-300 font-mono text-xs">resources/</code>.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policies or terms..."
            className="search-input-field w-full pl-10 pr-4 py-2 text-[13px] shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[13px]">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-xl font-medium border transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === c
                ? 'bg-[#0F172A] dark:bg-teal-600 text-white shadow-xs border-transparent'
                : 'bg-white/70 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-white dark:border-white/10 hover:bg-white dark:hover:bg-white/20'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pol) => {
          const pdfUrl = pol.pdfUrl || (pol.fileName ? `/policies/${pol.fileName}` : undefined);

          return (
            <div
              key={pol.id}
              className="crystal-glass-card rounded-2xl p-5 hover:bg-white/95 dark:hover:bg-slate-800/90 hover:shadow-glass hover:-translate-y-1 transition-all flex flex-col justify-between border border-white dark:border-white/10 group"
            >
              <div className="space-y-3">
                {pol.image && (
                  <div className="w-full h-40 rounded-xl overflow-hidden shadow-xs border border-white dark:border-white/10">
                    <img
                      src={pol.image}
                      alt={pol.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488] dark:text-teal-400 bg-teal-50 dark:bg-teal-500/20 px-2 py-0.5 rounded-md border border-teal-200/50 dark:border-teal-500/30">
                    {pol.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {pol.pageCount && (
                      <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-200/50 dark:border-rose-500/30 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        PDF • {pol.pageCount}p
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pol.readTime}
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    onClick={() => onSelectPolicy(pol)}
                    className="text-[16px] font-bold text-[#0F172A] dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors cursor-pointer leading-snug"
                  >
                    {pol.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] dark:text-slate-300 mt-1.5 line-clamp-2">
                    {pol.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPolicy(pol)}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="View PDF Document in embedded reader"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View PDF</span>
                </button>

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download={pol.fileName || 'policy.pdf'}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700/60 border border-slate-200/70 dark:border-white/10 transition-colors"
                    title={`Download ${pol.fileName || 'PDF'}`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-700/60 border border-slate-200/70 dark:border-white/10 transition-colors"
                    title="Open PDF in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="crystal-glass rounded-2xl shadow-glass p-6 space-y-4 border border-white dark:border-white/10 mt-8">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0D9488] dark:text-teal-400" />
          <h2 className="text-[18px] font-bold text-[#0F172A] dark:text-white">
            Frequently Asked HR Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {KNOWLEDGE_FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-white/80 dark:border-white/10 transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-semibold text-[14px] text-[#0F172A] dark:text-white cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <p className="mt-2.5 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/10 pt-2.5">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
