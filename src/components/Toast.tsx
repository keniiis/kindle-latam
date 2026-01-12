'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, Check, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[300px] max-w-sm w-full p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-right-full fade-in duration-300 transition-all ${toast.type === 'success'
                                ? 'bg-white border-green-100 text-slate-800'
                                : toast.type === 'error'
                                    ? 'bg-white border-red-100 text-slate-800'
                                    : 'bg-white border-blue-100 text-slate-800'
                            }`}
                    >
                        <div className={`p-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-50 text-green-600' :
                                toast.type === 'error' ? 'bg-red-50 text-red-600' :
                                    'bg-blue-50 text-blue-600'
                            }`}>
                            {toast.type === 'success' && <Check size={18} strokeWidth={3} />}
                            {toast.type === 'error' && <AlertCircle size={18} strokeWidth={3} />}
                            {toast.type === 'info' && <Info size={18} strokeWidth={3} />}
                        </div>

                        <p className="text-sm font-semibold flex-1">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
