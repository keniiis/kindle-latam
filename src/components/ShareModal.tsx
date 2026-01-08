'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { X, Palette, Save, ArrowLeft, Instagram, Loader2 } from 'lucide-react';

interface ShareModalProps {
    content: string;
    title: string;
    author: string;
    onClose: () => void;
}

const THEMES = [
    { name: 'Naranja', bg: 'bg-gradient-to-br from-orange-100 to-amber-200', text: 'text-orange-950' },
    { name: 'Azul', bg: 'bg-gradient-to-br from-blue-100 to-indigo-200', text: 'text-indigo-950' },
    { name: 'Rosa', bg: 'bg-gradient-to-br from-rose-100 to-pink-200', text: 'text-rose-950' },
    { name: 'Lila', bg: 'bg-gradient-to-br from-violet-100 to-purple-200', text: 'text-purple-950' },
    { name: 'Blanco', bg: 'bg-white', text: 'text-slate-900' },
    { name: 'Negro', bg: 'bg-zinc-900', text: 'text-zinc-100' },
];

export default function ShareModal({ content, title, author, onClose }: ShareModalProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [currentTheme, setCurrentTheme] = useState(THEMES[1]);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (ref.current === null) return;
        setIsGenerating(true);

        try {
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
            download(dataUrl, 'citando-ando-story.png');
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex flex-col bg-zinc-950 text-white h-dvh">
            {/* h-[100dvh] ayuda en móviles para ignorar la barra de URL al calcular altura */}

            {/* 1. TOP BAR */}
            <div className="flex justify-between items-center p-4 px-6 bg-zinc-900/50 backdrop-blur-md z-10 border-b border-white/5 shrink-0">
                <span className="font-bold text-xs tracking-[0.2em] text-zinc-400 uppercase">Vista Previa</span>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <X size={20} className="text-white" />
                </button>
            </div>

            {/* 2. AREA DE PREVISUALIZACIÓN (Flexible) */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative w-full">

                {/* --- AJUSTE REDMI 12 / MÓVIL --- */}
                {/* Usamos max-h-[65vh] para que nunca sea más alta que el 65% de la pantalla */}
                {/* Usamos w-auto y aspect-[9/16] para que el ancho se ajuste solo según la altura */}
                <div className="relative h-full max-h-[60vh] sm:max-h-[70vh] aspect-9/16 shadow-2xl mx-auto">

                    <div
                        ref={ref}
                        className={`w-full h-full flex flex-col justify-between p-6 sm:p-10 ${currentTheme.bg} transition-colors duration-500`}
                        style={{ fontFamily: 'serif' }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 opacity-60">
                            <Instagram size={16} className={currentTheme.text} />
                            <span className={`text-[9px] tracking-widest uppercase font-sans font-bold ${currentTheme.text}`}>Citando Ando</span>
                        </div>

                        {/* Contenido (Texto Ajustable) */}
                        <div className="flex-1 flex items-center justify-center my-4 overflow-hidden">
                            {/* text-lg en móvil, text-2xl en PC */}
                            <p className={`text-lg sm:text-2xl leading-relaxed italic font-medium text-center line-clamp-10 ${currentTheme.text}`}>
                                "{content}"
                            </p>
                        </div>

                        {/* Footer */}
                        <div className={`mt-2 pt-4 border-t ${currentTheme.name === 'Negro' ? 'border-zinc-700' : 'border-black/10'}`}>
                            <p className={`text-[10px] sm:text-sm font-bold uppercase tracking-wide ${currentTheme.text} line-clamp-1`}>
                                {title}
                            </p>
                            <p className={`text-[9px] sm:text-xs opacity-75 mt-1 ${currentTheme.text} line-clamp-1`}>
                                {author}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. BARRA INFERIOR (Fija abajo) */}
            <div className="bg-zinc-900 pb-8 pt-4 px-6 rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.5)] z-20 flex flex-col gap-4 shrink-0">

                {isColorPickerOpen && (
                    <div className="flex justify-center gap-3 overflow-x-auto py-2 animate-in slide-in-from-bottom-4 fade-in no-scrollbar">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => setCurrentTheme(theme)}
                                className={`
                  w-10 h-10 rounded-full border-2 shrink-0 transition-all duration-300
                  ${theme.bg} 
                  ${currentTheme.name === theme.name ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent opacity-60 hover:opacity-100'}
                `}
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-around items-end text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <button
                        onClick={() => setIsColorPickerOpen(true)}
                        className={`flex flex-col items-center gap-2 p-2 ${isColorPickerOpen ? 'text-white' : 'hover:text-zinc-300'} transition-colors`}
                    >
                        <div className={`p-3 rounded-2xl ${isColorPickerOpen ? 'bg-zinc-800' : 'bg-transparent'}`}>
                            <Palette size={22} strokeWidth={1.5} />
                        </div>
                        <span>Color</span>
                    </button>

                    {isColorPickerOpen ? (
                        <button
                            onClick={() => setIsColorPickerOpen(false)}
                            className="flex flex-col items-center gap-2 p-2 text-white animate-in fade-in"
                        >
                            <div className="p-3 rounded-2xl bg-zinc-800">
                                <ArrowLeft size={22} strokeWidth={1.5} />
                            </div>
                            <span>Volver</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="flex flex-col items-center gap-2 p-2 hover:text-white transition-colors animate-in fade-in disabled:opacity-50"
                        >
                            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/50">
                                {isGenerating ? <Loader2 size={22} className="animate-spin" /> : <Save size={22} strokeWidth={1.5} />}
                            </div>
                            <span>Guardar</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}