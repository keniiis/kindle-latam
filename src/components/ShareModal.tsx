// src/components/ShareModal.tsx
'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { X, Download, Instagram } from 'lucide-react';

interface ShareModalProps {
    content: string;
    title: string;
    author: string;
    onClose: () => void;
}

// Diferentes temas de colores para que el usuario elija
const THEMES = [
    { name: 'Sunset', bg: 'bg-gradient-to-br from-orange-100 to-rose-200', text: 'text-rose-950', accent: 'bg-rose-950' },
    { name: 'Ocean', bg: 'bg-gradient-to-br from-blue-100 to-indigo-200', text: 'text-indigo-950', accent: 'bg-indigo-950' },
    { name: 'Dark', bg: 'bg-zinc-900', text: 'text-zinc-100', accent: 'bg-white' },
    { name: 'Minimal', bg: 'bg-white', text: 'text-gray-900', accent: 'bg-black' },
];

export default function ShareModal({ content, title, author, onClose }: ShareModalProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [currentTheme, setCurrentTheme] = useState(THEMES[1]); // Ocean por defecto
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (ref.current === null) return;
        setIsGenerating(true);

        try {
            // Generamos la imagen
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 });
            download(dataUrl, 'kindle-latam-quote.png');
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">

                {/* LADO IZQUIERDO: PREVISUALIZACIÓN */}
                <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-y-auto">
                    {/* Este es el DIV que se convertirá en imagen */}
                    <div
                        ref={ref}
                        className={`w-[320px] h-[568px] shrink-0 shadow-2xl flex flex-col justify-between p-8 ${currentTheme.bg} transition-colors duration-300`}
                        style={{ fontFamily: 'serif' }} // Forzamos serif para elegancia
                    >
                        <div className="flex justify-between items-start opacity-50">
                            <Instagram size={20} className={currentTheme.text} />
                            <span className={`text-[10px] tracking-widest uppercase ${currentTheme.text}`}>Kindle Latam</span>
                        </div>

                        <div className="flex-1 flex items-center">
                            <p className={`text-2xl leading-relaxed italic font-medium ${currentTheme.text}`}>
                                "{content}"
                            </p>
                        </div>

                        <div className={`mt-6 pt-6 border-t ${currentTheme.name === 'Dark' ? 'border-zinc-700' : 'border-black/10'}`}>
                            <p className={`text-sm font-bold uppercase tracking-wide ${currentTheme.text}`}>
                                {title}
                            </p>
                            <p className={`text-xs opacity-75 mt-1 ${currentTheme.text}`}>
                                {author}
                            </p>
                        </div>
                    </div>
                </div>

                {/* LADO DERECHO: CONTROLES */}
                <div className="w-full md:w-80 p-6 flex flex-col bg-white">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Personalizar</h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="text-sm font-medium text-gray-500 mb-3 block">Tema</label>
                            <div className="grid grid-cols-4 gap-2">
                                {THEMES.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => setCurrentTheme(theme)}
                                        className={`w-full aspect-square rounded-lg border-2 ${theme.bg} ${currentTheme.name === theme.name ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent'}`}
                                        title={theme.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isGenerating ? 'Generando...' : (
                            <>
                                <Download size={20} /> Descargar Imagen
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}