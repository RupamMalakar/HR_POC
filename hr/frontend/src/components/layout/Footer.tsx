import React from 'react';

interface FooterProps {
  onOpenCommandPalette: () => void;
  onQuickTriage: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCommandPalette,
  onQuickTriage
}) => {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono text-white/40 mb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenCommandPalette}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Command Bar:</span>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15 text-white">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={onQuickTriage}
          className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Quick Triage:</span>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15 text-white">
            Alt + T
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span>Encrypted &amp; HIPAA/SOC2 Compliant Enclave</span>
      </div>
    </footer>
  );
};
