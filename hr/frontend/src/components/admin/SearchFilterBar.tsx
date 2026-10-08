import React from 'react';
import { Search, X } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  filters?: FilterGroup[];
  actions?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = 'Search...',
  filters = [],
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md shadow-sm">
      {/* Search Input Box */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-9 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/15 focus:border-violet-500 focus:dark:border-violet-400 focus:ring-1 focus:ring-violet-500 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 outline-none transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Selects & Additional Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {filters.map((group) => (
          <div key={group.id} className="flex items-center gap-1.5">
            <select
              value={group.value}
              onChange={(e) => group.onChange(e.target.value)}
              className="h-10 px-3 pr-8 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-300 dark:border-white/15 focus:border-violet-500 focus:dark:border-violet-400 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none transition-all cursor-pointer shadow-inner appearance-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] hover:border-slate-400 dark:hover:border-white/25"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '12px'
              }}
            >
              {group.options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-slate-900 text-slate-100 dark:bg-slate-950 dark:text-slate-100"
                >
                  {group.label ? `${group.label}: ${opt.label}` : opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {actions && (
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
