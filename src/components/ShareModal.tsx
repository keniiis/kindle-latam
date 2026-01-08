// src/components/ShareModal.tsx
'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { X, Download, Instagram, Palette } from 'lucide-react';

interface ShareModalProps {
    content: string;
    title: string;
    author: string;
    onClose: () => void;
}

const THEMES = [
    { name: 'Sunset', bg: 'bg-gradient-to-br from-orange-100 to-rose-200', text: 'text-rose-950', accent: 'bg-rose-950' },
    { name: 'Ocean', bg: 'bg-gradient-to-br from-blue-100 to-indigo-200', text: 'text-indigo-950', accent: 'bg-indigo-950' },
    { name: 'Dark', bg: 'bg-zinc-900', text: 'text-zinc-100', accent: 'bg-white' },
    { name: 'Minimal', bg: 'bg-white', text: 'text-gray-900', accent: 'bg-black' },
    { name: 'Nature', bg: 'bg-gradient-to-br from-emerald-100 to-teal-200', text: 'text-emerald-950', accent: 'bg-emerald-950' },
];

export default function ShareModal({ content, title, author, onClose }: ShareModalProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [currentTheme, setCurrentTheme] = useState(THEMES[1]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (ref.current === null) return;
        setIsGenerating(true);

        try {
            // pixelRatio: 3 asegura que aunque la imagen se vea pequeña en el cel, 
            // se descargue en ALTA CALIDAD (HD).
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
            download(dataUrl, 'citando-ando-story.png');
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex flex-col bg-zinc-950 text-white">

            {/* 1. TOP BAR: Título y Cerrar */}
            <div className="flex justify-between items-center p-4 px-6 bg-zinc-900/50 backdrop-blur-md z-10">
                <span className="font-bold text-sm tracking-wide text-zinc-400">VISTA PREVIA</span>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <X size={20} className="text-white" />
                </button>
            </div>

            {/* 2. AREA DE PREVISUALIZACIÓN (Centro) */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden bg-zinc-950 relative">
                {/* Este contenedor escala la tarjeta para que quepa en la pantalla sin cortarse */}
                <div className="relative w-full max-w-sm aspect-9/16 flex items-center justify-center">

                    {/* TARJETA REAL (Lo que se descarga) */}
                    <div
                        ref={ref}
                        className={`w-full h-full shadow-2xl flex flex-col justify-between p-8 ${currentTheme.bg} transition-colors duration-500 rounded-none sm:rounded-2xl`}
                        style={{ fontFamily: 'serif' }}
                    >
                        {/* Header Tarjeta */}
                        <div className="flex justify-between items-start opacity-50">
                            <div className="flex items-center gap-1">
                                <Instagram size={16} className={currentTheme.text} />
                                <span className={`text-[10px] tracking-widest uppercase font-sans ${currentTheme.text}`}>Citando Ando</span>
                            </div>
                        </div>

                        {/* Contenido Central */}
                        <div className="flex-1 flex items-center justify-center my-4">
                            <p className={`text-xl sm:text-2xl leading-relaxed italic font-medium text-center ${currentTheme.text}`}>
                                "{content}"
                            </p>
                        </div>

                        {/* Footer Tarjeta */}
                        <div className={`mt-4 pt-6 border-t ${currentTheme.name === 'Dark' ? 'border-zinc-700' : 'border-black/10'}`}>
                            <p className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${currentTheme.text}`}>
                                {title}
                            </p>
                            <p className={`text-[10px] sm:text-xs opacity-75 mt-1 ${currentTheme.text}`}>
                                {author}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3. CONTROLES (Bottom Sheet) */}
            <div className="bg-zinc-900 p-6 pb-8 space-y-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">

                {/* Selector de Temas Horizontal */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                        <Palette size={14} /> Elige un estilo
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => setCurrentTheme(theme)}
                                className={`
                  w-12 h-12 rounded-full border-2 shrink-0 transition-all duration-300
                  ${theme.bg} 
                  ${currentTheme.name === theme.name ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent opacity-70 hover:opacity-100'}
                `}
                                aria-label={theme.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Botón de Descarga Grande */}
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/30"
                >
                    {isGenerating ? (
                        <span className="animate-pulse">Generando magia...</span>
                    ) : (
                        <>
                            <Download size={22} /> Guardar Imagen
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}