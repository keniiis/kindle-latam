'use client';

import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDanger = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 scale-100">
                <div className="p-6 text-center">
                    <div className={`mx-auto mb-4 size-12 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-500'}`}>
                        {isDanger ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                        {title}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 ${isDanger
                                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                                    : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
