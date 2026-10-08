import React from 'react';
import { AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { AdminModal } from './AdminModal';

interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const icon = {
    danger: <AlertCircle className="w-6 h-6 text-rose-400" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-400" />,
    info: <Info className="w-6 h-6 text-cyan-400" />
  }[variant];

  const confirmBtnClass = {
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/50',
    info: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/50'
  }[variant];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50 ${confirmBtnClass}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
          {icon}
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
          {message}
        </p>
      </div>
    </AdminModal>
  );
};
