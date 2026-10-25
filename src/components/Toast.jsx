import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={16} style={{ color: 'var(--status-emerald)' }} />}
          {toast.type === 'danger' && <AlertCircle size={16} style={{ color: 'var(--status-red)' }} />}
          {(!toast.type || toast.type === 'info') && <Info size={16} style={{ color: 'var(--accent-sky)' }} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
