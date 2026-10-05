import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Clock,
  ShieldCheck,
  Check,
  FileCheck2,
} from 'lucide-react';
import { PolicyItem } from '../types';

interface PolicyReaderModalProps {
  policy: PolicyItem | null;
  onClose: () => void;
  initialMode?: 'pdf' | 'summary';
}

export const PolicyReaderModal: React.FC<PolicyReaderModalProps> = ({
  policy,
  onClose,
  initialMode = 'pdf',
}) => {
  if (!policy) return null;

  const pdfUrl = policy.pdfUrl || (policy.fileName ? `/resources/${policy.fileName}` : undefined);

  const [viewMode, setViewMode] = useState<'pdf' | 'summary'>(
    pdfUrl ? initialMode : 'summary'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      setViewMode(initialMode);
    }
  }, [policy?.id, pdfUrl, initialMode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${
          isFullscreen
            ? 'h-[96vh] max-w-[96vw]'
            : 'max-w-4xl h-[88vh]'
        } crystal-glass rounded-2xl shadow-2xl border border-white dark:border-white/10 p-4 sm:p-6 z-10 flex flex-col overflow-hidden transition-all duration-200`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/70 dark:border-white/10 gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488] dark:text-teal-400 bg-teal-50 dark:bg-teal-500/20 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-500/30">
                {policy.category}
              </span>
              {policy.pageCount && (
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-200/60 dark:border-rose-500/30 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  PDF • {policy.pageCount} Pages
                </span>
              )}
              {policy.fileSize && (
                <span className="text-[11px] text-slate-400 dark:text-slate-400 font-mono">
                  {policy.fileSize}
                </span>
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {policy.readTime}
              </span>
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0F172A] dark:text-white leading-snug truncate">
              {policy.title}
            </h3>
            <p className="text-[11px] sm:text-[12px] text-[#64748B] dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Official Authoritative Resource • Last revised {policy.lastUpdated}</span>
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center shrink-0">
            {/* View Mode Toggle Buttons */}
            {pdfUrl && (
              <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-white/10 mr-1">
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-3 py-1 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'pdf'
                      ? 'bg-white dark:bg-teal-600 text-[#0F172A] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="View Embedded PDF Document"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Document</span>
                </button>
                <button
                  onClick={() => setViewMode('summary')}
                  className={`px-3 py-1 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'summary'
                      ? 'bg-white dark:bg-teal-600 text-[#0F172A] dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title="View Policy Highlights & Summary"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </button>
              </div>
            )}

            {/* Open in New Window */}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-500 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 hover:bg-white/80 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                title="Open PDF in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Direct Download */}
            {pdfUrl && (
              <a
                href={pdfUrl}
                download={policy.fileName || 'policy-document.pdf'}
                className="p-2 rounded-xl text-slate-500 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 hover:bg-white/80 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                title="Download PDF Document"
              >
                <Download className="w-4 h-4" />
              </a>
            )}

            {/* Fullscreen Expand */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-colors hidden md:inline-flex cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 py-3 sm:py-4 flex flex-col overflow-hidden">
          {viewMode === 'pdf' && pdfUrl ? (
            /* Interactive PDF Viewer Section */
            <div className="relative flex-1 w-full h-full rounded-xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-inner bg-slate-900/5 dark:bg-slate-950 flex flex-col">
              <object
                data={`${pdfUrl}#toolbar=1&navpanes=1&view=FitH`}
                type="application/pdf"
                className="w-full h-full rounded-xl bg-white"
              >
                <iframe
                  src={`${pdfUrl}#toolbar=1&navpanes=1&view=FitH`}
                  title={policy.title}
                  className="w-full h-full border-0 rounded-xl bg-white"
                >
                  <div className="p-6 text-center text-slate-600">
                    <p>Your browser could not preview the PDF file directly.</p>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block px-4 py-2 bg-teal-600 text-white rounded-lg"
                    >
                      Open PDF in New Window
                    </a>
                  </div>
                </iframe>
              </object>
            </div>
          ) : (
            /* Structured Clause Summary Mode */
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {policy.image && (
                <div className="w-full h-44 rounded-xl overflow-hidden shadow-xs border border-white dark:border-white/10">
                  <img
                    src={policy.image}
                    alt={policy.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-500/30 text-[13.5px] text-teal-900 dark:text-teal-200 leading-relaxed font-medium">
                {policy.summary}
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Key Policy Clauses & Provisions
                  </h4>
                  {pdfUrl && (
                    <button
                      onClick={() => setViewMode('pdf')}
                      className="text-[12px] font-semibold text-[#0D9488] dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>View Full 6-Page PDF</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2.5">
                  {policy.content.map((clause, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-white/90 dark:border-white/10 text-[13.5px] text-[#0F172A] dark:text-slate-100 leading-relaxed flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-[#0D9488] dark:text-teal-400 flex items-center justify-center text-[11px] font-bold mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="pt-3 border-t border-white/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
            {policy.fileName && (
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-600 dark:text-slate-300">
                resources/{policy.fileName}
              </span>
            )}
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Need clarification? Inquire with{' '}
              <strong className="text-[#0D9488] dark:text-teal-400">Ask HR</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pdfUrl && (
              <a
                href={pdfUrl}
                download={policy.fileName || 'policy.pdf'}
                className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 text-[12px] font-semibold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-[#0F172A] dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-[12px] font-semibold transition-all shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
