'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import {
    ArrowLeft, Trash2, Coffee, BookOpen,
    Palette, Type, LayoutGrid, Image as ImageIcon,
    MoreVertical, Download, Loader2, X, RotateCcw,
    Smartphone, Square, User, ShieldCheck, Book, Quote
} from 'lucide-react';

interface ShareModalProps {
    content: string;
    title: string;
    author: string;
    onClose: () => void;
}

const STYLES: Record<string, any> = {
    'Minimalist': {
        name: 'Minimalist',
        bg: 'bg-white',
        text: 'text-slate-900',
        accent: '#000000',
        preview: '#ffffff',
        font: 'font-serif'
    },
    'Vibrant Gradient': {
        name: 'Vibrant Gradient',
        bg: 'bg-gradient-to-br from-[#8c25f4] to-[#6d28d9]',
        text: 'text-white',
        accent: '#ffffff',
        preview: '#8c25f4',
        font: 'font-serif'
    },
    'Dark Mode': {
        name: 'Dark Mode',
        bg: 'bg-slate-900',
        text: 'text-white',
        accent: '#3b82f6',
        preview: '#0f172a',
        font: 'font-sans'
    },
    'Classic Paper': {
        name: 'Classic Paper',
        bg: 'bg-[#fcf6e9]',
        text: 'text-[#431407]',
        accent: '#92400e',
        preview: '#fcf6e9',
        font: 'font-serif'
    },
    'Neon Nights': {
        name: 'Neon Nights',
        bg: 'bg-black',
        text: 'text-cyan-400',
        accent: '#22d3ee',
        preview: '#22d3ee',
        font: 'font-mono'
    },
    'Papel': {
        name: 'Papel',
        bg: "bg-[url('/papel.webp')] bg-cover bg-center",
        text: 'text-slate-900',
        accent: '#000000',
        preview: '#e5e5e5',
        font: 'font-serif'
    }
};

const STYLE_KEYS = Object.keys(STYLES);

const FONTS = [
    { name: 'Serif', class: 'font-serif' },
    { name: 'Sans', class: 'font-sans' },
    { name: 'Mono', class: 'font-mono' },
];

const ALIGNMENTS = [
    { name: 'Centro', class: 'text-center' },
    { name: 'Izquierda', class: 'text-left' },
];

export default function ShareModal({ content, title, author, onClose }: ShareModalProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [selectedStyle, setSelectedStyle] = useState(STYLES['Vibrant Gradient']);
    const [accentColor, setAccentColor] = useState(STYLES['Vibrant Gradient'].accent);
    const [selectedFont, setSelectedFont] = useState(FONTS[0]);
    const [selectedAlign, setSelectedAlign] = useState(ALIGNMENTS[0]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Opciones del Modal
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isBackgroundMenuOpen, setIsBackgroundMenuOpen] = useState(false);
    const [format, setFormat] = useState<'story' | 'post'>('story');
    const [showAuthor, setShowAuthor] = useState(true);
    const [showWatermark, setShowWatermark] = useState(true);
    const [showTitle, setShowTitle] = useState(true); // "Mostrar Portada" interpretado como Título

    const handleDownload = async () => {
        if (ref.current === null) return;
        setIsGenerating(true);
        try {
            const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 3 });
            download(dataUrl, `citando-ando-${format}.png`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleFont = () => {
        const nextIndex = (FONTS.indexOf(selectedFont) + 1) % FONTS.length;
        setSelectedFont(FONTS[nextIndex]);
    };

    const toggleAlign = () => {
        const nextIndex = (ALIGNMENTS.indexOf(selectedAlign) + 1) % ALIGNMENTS.length;
        setSelectedAlign(ALIGNMENTS[nextIndex]);
    };

    const resetSettings = () => {
        const defaultStyle = STYLES['Vibrant Gradient'];
        setSelectedStyle(defaultStyle);
        setAccentColor(defaultStyle.accent);
        setSelectedFont(FONTS[0]);
        setSelectedAlign(ALIGNMENTS[0]);
        setFormat('story');
        setShowAuthor(true);
        setShowWatermark(true);
        setShowTitle(true);
        setIsOptionsOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#f2f4f7] flex flex-col h-dvh font-sans animate-in fade-in duration-300">
            {/* 1. HEADER */}
            <header className="px-6 py-4 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 md:bg-transparent md:static z-10">
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-700" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-[#8c25f4] p-1.5 rounded-lg text-white shadow-md shadow-purple-500/20">
                        <BookOpen size={16} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight">CitandoAndo</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">

                    <a href="https://ko-fi.com/devdanipena" target="_blank" className="bg-[#8B5E3C] text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold flex gap-2 shadow-lg shadow-[#8B5E3C]/30 hover:bg-[#70482D] transition-colors animate-radar-ring">
                        <Coffee size={16} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Invítame un café</span>
                    </a>
                </div>
            </header>

            {/* 2. MAIN CANVAS AREA */}
            <main className="flex-1 flex items-center justify-center p-4 pb-40 md:p-8 overflow-hidden relative">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

                <div className={`relative h-full max-h-[65vh] ${format === 'story' ? 'aspect-[9/16]' : 'aspect-square'} shadow-2xl shadow-slate-400/20 mx-auto transition-all duration-500 ease-out hover:scale-[1.01]`}>
                    <div ref={ref} className={`w-full h-full flex flex-col relative overflow-hidden p-8 sm:p-10 ${selectedStyle.bg} ${selectedStyle.text} transition-colors duration-500 rounded-3xl`}>

                        {/* 1. Elemento Decorativo (Comillas) */}
                        <div
                            className="absolute top-20 left-8 opacity-20 pointer-events-none transition-colors duration-300"
                            style={{ color: accentColor }}
                        >
                            <Quote size={format === 'story' ? 40 : 32} fill="currentColor" />
                        </div>

                        {/* 2. Contenido Central (Texto) */}
                        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 relative z-10 pt-12">
                            <p
                                className={`leading-[0.995] italic ${selectedFont.class} font-medium ${selectedAlign.class} ${selectedStyle.text}`}
                                style={{
                                    textWrap: 'balance',
                                    fontSize: content.length > 200 ? '1.15rem' : '1.675rem' // Ajuste dinámico de tamaño
                                } as any}
                            >
                                "{content}"
                            </p>
                        </div>

                        {/* 3. Metadatos (Autor y Título) */}
                        <div className={`text-center relative z-10 ${format === 'story' ? 'pb-12' : 'pb-8'}`}>
                            {/* Línea de acento */}
                            {showWatermark && (
                                <div
                                    className="w-16 h-1 mx-auto mb-6 rounded-full transition-colors duration-300"
                                    style={{ backgroundColor: accentColor }}
                                ></div>
                            )}

                            {showAuthor && (
                                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${selectedStyle.text}`}>
                                    {author}
                                </p>
                            )}

                            {showTitle && (
                                <p className={`text-[9px] opacity-60 font-medium ${selectedStyle.text}`}>
                                    {title}
                                </p>
                            )}
                        </div>

                        {/* 4. Footer (@citandoando) */}
                        {showWatermark && (
                            <div className={`absolute bottom-6 left-0 w-full px-8 flex justify-between items-center opacity-40 text-[9px] ${selectedStyle.text}`}>
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className="size-3 rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                    ></div>
                                    <span>@citandoando</span>
                                </div>
                                <BookOpen size={12} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* 3. MODAL DE OPCIONES */}
            {isOptionsOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">Opciones de diseño</h3>
                            <button onClick={() => setIsOptionsOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Formato */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <ImageIcon size={14} /> Formato de imagen
                                </label>
                                <div className="bg-slate-100 p-1 rounded-xl flex">
                                    <button
                                        onClick={() => setFormat('story')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${format === 'story' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        9:16 Story
                                    </button>
                                    <button
                                        onClick={() => setFormat('post')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${format === 'post' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        1:1 Post
                                    </button>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                                        <div className="size-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><Book size={16} /></div>
                                        Mostrar Título
                                    </div>
                                    <button
                                        onClick={() => setShowTitle(!showTitle)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${showTitle ? 'bg-purple-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`size-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${showTitle ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                                        <div className="size-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><User size={16} /></div>
                                        Mostrar Autor
                                    </div>
                                    <button
                                        onClick={() => setShowAuthor(!showAuthor)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${showAuthor ? 'bg-purple-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`size-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${showAuthor ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                                        <div className="size-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><ShieldCheck size={16} /></div>
                                        Marca de agua
                                    </div>
                                    <button
                                        onClick={() => setShowWatermark(!showWatermark)}
                                        className={`w-12 h-7 rounded-full transition-colors relative ${showWatermark ? 'bg-purple-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`size-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${showWatermark ? 'left-6' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>

                            {/* Calidad Exportación */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="bg-purple-100 text-purple-700 px-1 rounded text-[9px]">HQ</span> Calidad de exportación
                                </label>
                                <div className="w-full h-10 px-4 flex items-center justify-between bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700">
                                    HD (1080p)
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={resetSettings}
                                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <RotateCcw size={16} /> Restablecer diseño
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE FONDO (Nuevo) */}
            {isBackgroundMenuOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">Estilo de Fondo</h3>
                            <button onClick={() => setIsBackgroundMenuOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 grid grid-cols-3 gap-4">
                            {STYLE_KEYS.map((key) => {
                                const s = STYLES[key];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            setSelectedStyle(s);
                                            setAccentColor(s.accent);
                                            setIsBackgroundMenuOpen(false);
                                        }}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedStyle.name === s.name ? 'border-purple-500 bg-purple-50' : 'border-slate-100 hover:border-purple-200'}`}
                                    >
                                        <div
                                            className="size-12 rounded-full shadow-sm border border-black/5"
                                            style={{ backgroundColor: s.preview }}
                                        />
                                        <span className="text-xs font-bold text-slate-600 text-center leading-tight">{s.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. BOTTOM FLOATING BAR */}
            {/* 4. DESKTOP FOOTER (Pill Design) */}
            <footer className="hidden md:flex p-10 justify-center sticky bottom-0 z-20 pointer-events-none">
                <div className="flex items-center gap-6 pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-white px-6 py-3 rounded-full shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-8">
                        {/* Selector de Color */}
                        <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
                            <div className="flex items-center gap-2">
                                {STYLE_KEYS.map((key) => {
                                    const s = STYLES[key];
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedStyle(s);
                                                setAccentColor(s.accent);
                                            }}
                                            className={`size-8 rounded-full border-2 transition-all duration-300 ${selectedStyle.name === s.name ? 'border-purple-500 scale-110 ring-2 ring-purple-100 ring-offset-2' : 'border-slate-100 hover:scale-105'}`}
                                            title={s.name}
                                            style={{ backgroundColor: s.preview }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Herramientas Funcionales */}
                        <div className="flex items-center gap-6 text-slate-400">
                            {/* Color Picker */}
                            <label className="flex flex-col items-center gap-1.5 hover:text-slate-800 transition-colors group cursor-pointer">
                                <div className="p-1 group-hover:bg-slate-50 rounded-lg transition-colors">
                                    <Palette size={18} />
                                </div>
                                <span className="text-[9px] font-bold tracking-wider">DETALLES</span>
                                <input
                                    type="color"
                                    value={accentColor}
                                    onChange={(e) => setAccentColor(e.target.value)}
                                    className="absolute opacity-0 w-0 h-0"
                                />
                            </label>

                            <button onClick={toggleFont} className="flex flex-col items-center gap-1.5 hover:text-slate-800 transition-colors group">
                                <div className="p-1 group-hover:bg-slate-50 rounded-lg transition-colors"><Type size={18} /></div>
                                <span className="text-[9px] font-bold tracking-wider">LETRA</span>
                            </button>
                            <button onClick={toggleAlign} className="flex flex-col items-center gap-1.5 hover:text-slate-800 transition-colors group">
                                <div className="p-1 group-hover:bg-slate-50 rounded-lg transition-colors"><LayoutGrid size={18} /></div>
                                <span className="text-[9px] font-bold tracking-wider">DISEÑO</span>
                            </button>
                            <button onClick={() => setIsOptionsOpen(true)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-600 transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    <button id="btn-download-desktop" onClick={handleDownload} disabled={isGenerating} className="bg-[#8c25f4] text-white h-[58px] px-8 rounded-full font-bold text-sm shadow-xl shadow-purple-500/30 hover:bg-[#7c1be2] hover:scale-105 hover:shadow-purple-500/40 transition-all flex items-center gap-3 whitespace-nowrap">
                        {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} className="stroke-2" />}
                        <span className="tracking-wide">Descargar Story</span>
                    </button>
                </div>
            </footer>

            {/* 5. MOBILE FOOTER (Bottom Bar Design) */}
            <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
                {/* Botón Flotante */}
                <div className="flex justify-center pb-6 pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
                    <button
                        id="btn-download-mobile"
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-[#8c25f4] text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl shadow-purple-500/30 hover:bg-[#7c1be2] active:scale-95 transition-all flex items-center gap-2"
                    >
                        {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="stroke-2" />}
                        <span>Descargar Story</span>
                    </button>
                </div>

                {/* Barra Blanca Inferior con Diseño Unificado */}
                <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center pointer-events-auto pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] justify-around w-full">

                    {/* Botón FONDO (Abre menú) */}
                    <button onClick={() => setIsBackgroundMenuOpen(true)} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors">
                        <div className="p-1 text-slate-600"><Square size={20} /></div>
                        <span className="text-[9px] font-bold tracking-wider">FONDO</span>
                    </button>

                    <label className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
                        <div className="p-1 text-slate-600"><Palette size={20} /></div>
                        <span className="text-[9px] font-bold tracking-wider">DETALLES</span>
                        <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="absolute opacity-0 w-0 h-0"
                        />
                    </label>

                    <button onClick={toggleFont} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors">
                        <div className="p-1 text-slate-600"><Type size={20} /></div>
                        <span className="text-[9px] font-bold tracking-wider">LETRA</span>
                    </button>

                    <button onClick={toggleAlign} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors">
                        <div className="p-1 text-slate-600"><LayoutGrid size={20} /></div>
                        <span className="text-[9px] font-bold tracking-wider">DISEÑO</span>
                    </button>

                    <button onClick={() => setIsOptionsOpen(true)} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors">
                        <div className="p-1 text-slate-600"><MoreVertical size={20} /></div>
                        <span className="text-[9px] font-bold tracking-wider">MAS</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}