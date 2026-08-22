import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20',
    error: 'bg-rose-600 border-rose-500 text-white shadow-rose-500/20',
    info: 'bg-cyan-600 border-cyan-500 text-white shadow-cyan-500/20'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all duration-300">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl ${bgColors[toast.type] || bgColors.success}`}>
        <span className="text-lg">
          {toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✨'}
        </span>
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};
