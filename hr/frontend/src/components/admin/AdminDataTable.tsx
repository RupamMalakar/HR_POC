import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Inbox, Loader2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  pageSize?: number;
  onRowClick?: (item: T) => void;
}

export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  error = null,
  emptyMessage = 'No records found',
  pageSize = 10,
  onRowClick
}: AdminDataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;
      const compare = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortOrder === 'asc' ? compare : -compare;
    });
  }, [data, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  return (
    <div className="flex flex-col rounded-2xl bg-white/[0.03] dark:bg-slate-900/40 border border-slate-700/60 dark:border-white/10 backdrop-blur-md shadow-sm overflow-hidden">
      {/* Table responsive container */}
      <div className="w-full overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-700/60 dark:border-white/10 bg-black/20 text-slate-400 dark:text-white/60 font-mono uppercase tracking-wider text-[11px]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3.5 px-4 font-semibold select-none ${col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''} ${col.headerClassName || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-white/40">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-violet-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 dark:divide-white/5 text-slate-800 dark:text-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-400 dark:text-white/40">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                    <span className="font-mono text-xs tracking-wider">LOADING RECORDS...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-rose-400">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-2xl">error</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-slate-400 dark:text-white/40">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 opacity-40" />
                    <p className="font-medium text-xs">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors hover:bg-white/[0.04] dark:hover:bg-white/[0.03] ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`py-3.5 px-4 ${col.className || ''}`}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-700/60 dark:border-white/10 bg-black/20 text-xs text-slate-400 dark:text-white/60">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{Math.min(sortedData.length, currentPage * pageSize)}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-700 dark:border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono text-[11px] font-semibold text-slate-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-700 dark:border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
