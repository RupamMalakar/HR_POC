import React from 'react';
import { NavTab } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeTab: NavTab;
  onOpenCommandPalette: () => void;
  onOpenNewAction: () => void;
  onToggleMobileMenu?: () => void;
}

const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: "HR Dashboard",
    subtitle: "Enterprise Operations & Autonomous AI Cockpit"
  },
  requests: {
    title: "Service Requests Queue",
    subtitle: "Real-time employee cases, classification, & ticket lifecycles"
  },
  'ai-triage': {
    title: "Autonomous AI Triage Engine",
    subtitle: "Automated intent classification, routing models, & confidence scores"
  },
  'ai-assistance': {
    title: "HR Copilot & Policy Grounding",
    subtitle: "RAG-assisted policy query, handbook citations, & deliverable drafting"
  },
  deliverables: {
    title: "Deliverables & Official Documents",
    subtitle: "Cryptographically verified employee letters, contracts, and addendums"
  },
  'hr-actions': {
    title: "Operational HR Actions",
    subtitle: "One-click approval workflows for salary, leave, and transitions"
  },
  insights: {
    title: "Process Improvement & Analytics",
    subtitle: "Continuous discovery of HR operational bottlenecks & SLA trends"
  },
  reports: {
    title: "Executive Reports & Audit Logs",
    subtitle: "SOC2 and HIPAA compliant telemetry, SLA summaries, and export tools"
  },
  settings: {
    title: "System & AI Model Settings",
    subtitle: "Routing thresholds, vector store parameters, and notification policies"
  },
  'hr-profile': {
    title: "HR Operations Profile",
    subtitle: "Specialist credentials, assigned jurisdictions, and shift schedule"
  },
  'backend-docs': {
    title: "Backend API Integration Specification",
    subtitle: "REST endpoints, WebSocket events, and live backend connection guide"
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenCommandPalette,
  onToggleMobileMenu
}) => {
  const current = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-40 rounded-2xl bg-[#060814]/85 backdrop-blur-2xl border border-white/15 shadow-glass px-4 md:px-6 py-3 flex items-center justify-between specular-border mb-6 transition-all duration-200">
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-bold text-white tracking-tight leading-tight">
              {current.title}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              LIVE FEED
            </span>
          </div>
          <p className="text-xs text-white/50 hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Glass Search Input - Click opens command palette */}
        <div
          onClick={onOpenCommandPalette}
          className="relative hidden sm:flex items-center cursor-pointer group"
        >
          <span className="material-symbols-outlined absolute left-3 text-white/40 group-hover:text-neon-cyan text-[18px] pointer-events-none transition-colors">
            search
          </span>
          <div className="w-56 md:w-64 pl-9 pr-14 py-2 bg-black/30 border border-white/10 group-hover:border-neon-cyan/50 rounded-xl text-xs text-white/50 backdrop-blur-md flex items-center transition-all">
            <span>Search cases, employees...</span>
          </div>
          <span className="absolute right-2.5 text-[10px] font-mono text-white/40 border border-white/10 rounded px-1.5 py-0.5 bg-white/5">
            ⌘K
          </span>
        </div>

        {/* Date Pill */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-xs font-mono backdrop-blur-md">
          <span className="material-symbols-outlined text-[16px] text-cyan-400">
            calendar_today
          </span>
          <span className="hidden sm:inline">Today, Oct 24</span>
          <span className="material-symbols-outlined text-[14px] text-white/40">
            expand_more
          </span>
        </div>

        {/* Theme Toggle (Dark / Light) */}
        <ThemeToggle />

        {/* Glass Notification Bell */}
        <button
          aria-label="Notifications"
          onClick={() => alert("3 high-priority notifications: Alex Johnson bonus reconciliation, Priya Sharma dependent tier, Daniel Thomas sabbatical.")}
          className="relative p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.09] transition-all backdrop-blur-md"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]" />
        </button>

        <div className="h-6 w-px bg-white/15 mx-1 hidden sm:block" />

        {/* Sarah's Frosted Avatar Profile */}
        <div className="flex items-center gap-3 pl-1 bg-white/[0.03] border border-white/10 py-1.5 px-3 rounded-xl backdrop-blur-md">
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="text-xs text-white font-semibold leading-tight tracking-tight">
              Sarah Jenkins
            </span>
            <span className="text-[10px] font-mono text-cyan-300/70 leading-none mt-0.5">
              HR Operations Lead
            </span>
          </div>
          <div className="relative">
            <img
              alt="Sarah Jenkins Headshot"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/25 shadow-lg"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Xtd_6Zzb5GlqZHxkO20YhGWUIh5W6zeXIQMhT-wo_XWwgwVuROluO2YbW2xoNMM9EX4rSJ9HfXVhPfo0-FHKC9ypn5YpZDfKfjsev9tVACXOmHmujbKFBPnxdIa0mK0Il1qM1GRlo1u2Phyfe_WS_DSjxP_VA-_CcPCooGoexaXN5JJnUeX6ce0c_p78M6YXoqa2h8-dvIVVZUElaP5exk5NPsZxfpbZryLSyTPFga3mLVWeRTcUTS_B0"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-obsidian" />
          </div>
        </div>
      </div>
    </header>
  );
};
