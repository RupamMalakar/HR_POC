import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const config = {
            success: {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
              border: 'border-emerald-500/40 bg-slate-900/95 text-emerald-200 shadow-emerald-950/40',
              bar: 'bg-emerald-500'
            },
            error: {
              icon: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
              border: 'border-rose-500/40 bg-slate-900/95 text-rose-200 shadow-rose-950/40',
              bar: 'bg-rose-500'
            },
            warning: {
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
              border: 'border-amber-500/40 bg-slate-900/95 text-amber-200 shadow-amber-950/40',
              bar: 'bg-amber-500'
            },
            info: {
              icon: <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />,
              border: 'border-cyan-500/40 bg-slate-900/95 text-cyan-200 shadow-cyan-950/40',
              bar: 'bg-cyan-500'
            }
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${config.border}`}
            >
              {config.icon}
              <div className="flex-1 text-xs font-medium leading-relaxed">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useAdminToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (msg: string) => console.log('[Toast]', msg)
    };
  }
  return ctx;
};
