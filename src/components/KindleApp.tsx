'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { parseKindleClippings, Clipping } from '@/lib/parser';
import ShareModal from '@/components/ShareModal';
import { UploadCloud, Book, ChevronLeft, Share2, Copy, CheckCircle2, Trash2, Coffee, Shield, Image as ImageIcon, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'kindle-latam-library';

const DEMO_TEXT = `
Hábitos Atómicos (James Clear)
- Highlight | Added on Monday, January 1, 2024

No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.
==========
Cien años de soledad (Gabriel García Márquez)
- Highlight | Added on Tuesday, January 2, 2024

Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.
==========
`;

type BookGroup = {
    title: string;
    author: string;
    clippings: Clipping[];
};

// --- COMPONENTE TARJETA LIBRO (VERSIÓN DARK) ---
const BookCard = ({ book, onClick }: { book: BookGroup; onClick: () => void }) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchCover = async () => {
            const cleanTitle = book.title.split('(')[0].split(':')[0].split(' -')[0].trim();
            const cleanAuthor = book.author.replace(/[\(\)]/g, '').trim();
            try {
                const response = await fetch(
                    `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}&author=${encodeURIComponent(cleanAuthor)}&limit=1&fields=cover_i`
                );
                const data = await response.json();
                if (isMounted && data.docs?.length > 0) {
                    const bookWithCover = data.docs.find((doc: any) => doc.cover_i);
                    if (bookWithCover) setCoverUrl(`https://covers.openlibrary.org/b/id/${bookWithCover.cover_i}-L.jpg`);
                }
            } catch (error) { console.error(error); }
        };
        fetchCover();
        return () => { isMounted = false; };
    }, [book.title, book.author]);

    return (
        <div onClick={onClick} className="group bg-slate-900 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 border border-slate-800 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full">
            <div className="relative w-full aspect-[2/3] bg-slate-800 overflow-hidden">
                {coverUrl ? (
                    <img src={coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-in fade-in duration-700" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <Book size={40} className="text-slate-600 mb-3" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{book.title}</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-white/10">{book.clippings.length}</div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between bg-slate-900">
                <h3 className="font-bold text-slate-200 text-sm line-clamp-2 leading-tight mb-1 group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
            </div>
        </div>
    );
};

// --- COMPONENTE FAQ ITEM ---
const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors">
                <span className="font-semibold text-slate-200 text-sm">{question}</span>
                {isOpen ? <ChevronUp size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
            {isOpen && <div className="p-4 pt-0 text-slate-400 text-xs leading-relaxed border-t border-slate-800/50 mt-2">{answer}</div>}
        </div>
    )
}

// --- APP PRINCIPAL ---
export default function KindleApp() {
    const [rawClippings, setRawClippings] = useState<Clipping[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookGroup | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [clipToShare, setClipToShare] = useState<Clipping | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) { try { setRawClippings(JSON.parse(savedData)); } catch (e) { console.error(e); } }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded && rawClippings.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(rawClippings));
    }, [rawClippings, isLoaded]);

    const handleClearData = () => {
        if (confirm('¿Borrar todo?')) { localStorage.removeItem(STORAGE_KEY); setRawClippings([]); setSelectedBook(null); }
    };
    const handleLoadDemo = () => { setRawClippings(parseKindleClippings(DEMO_TEXT.trim())); setToastMessage("¡Modo Demo activado!"); };

    const handleCopy = (text: string, author: string) => {
        navigator.clipboard.writeText(`> ${text}\n>\n> — *${author}*`);
        setToastMessage("¡Copiado!");
    };

    useEffect(() => { if (toastMessage) { const timer = setTimeout(() => setToastMessage(null), 3000); return () => clearTimeout(timer); } }, [toastMessage]);

    const library = useMemo(() => {
        const groups: Record<string, BookGroup> = {};
        rawClippings.forEach((clip) => {
            if (!groups[clip.title]) groups[clip.title] = { title: clip.title, author: clip.author, clippings: [] };
            groups[clip.title].clippings.push(clip);
        });
        return Object.values(groups).sort((a, b) => b.clippings.length - a.clippings.length);
    }, [rawClippings]);

    const handleFileUpload = async (file: File) => {
        const text = await file.text();
        setRawClippings(parseKindleClippings(text));
        setSelectedBook(null);
    };
    const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]); }, []);
    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
            <div className="max-w-6xl mx-auto p-6 md:p-8">

                {/* HEADER */}
                <header className="mb-16 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tighter text-white">
                            Citando<span className="text-indigo-500">Ando</span>
                        </h1>
                        <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">BETA</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="https://ko-fi.com/devdanipena" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 px-5 py-2.5 rounded-full transition-all shadow-lg shadow-amber-900/20 active:scale-95">
                            <Coffee size={18} strokeWidth={2.5} />
                            <span>Invítame un café</span>
                        </a>
                        {rawClippings.length > 0 && (
                            <button onClick={handleClearData} className="p-2.5 rounded-full bg-slate-900 hover:bg-red-900/20 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 transition-all" title="Borrar todo">
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </header>

                {/* --- ESTADO 1: LANDING PAGE DARK MODE --- */}
                {rawClippings.length === 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

                        {/* TAGLINE */}
                        <div className="flex justify-center mb-6">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/20 glow-sm">Transforma tus Highlights</span>
                        </div>

                        {/* HERO TITLE */}
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                                Libera tus notas de <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-600">Kindle</span> y Instagram
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
                                Transforma tu archivo <code className="bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded text-sm border border-slate-800">My Clippings.txt</code> en una biblioteca visual.
                                Sin cuentas, sin suscripciones y 100% privado.
                            </p>
                        </div>

                        {/* UPLOAD BOX (DARK) */}
                        <div
                            onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                            className={`
                relative flex flex-col items-center justify-center min-h-[320px] border border-dashed rounded-3xl transition-all max-w-2xl mx-auto
                ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[1.02]' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900'}
              `}
                        >
                            <div className="p-5 bg-slate-800 rounded-2xl text-indigo-400 mb-6 shadow-xl shadow-black/20 border border-slate-700"><UploadCloud size={40} /></div>
                            <h3 className="text-xl font-bold text-white mb-2">Sube tu archivo "My Clippings.txt"</h3>
                            <p className="text-slate-500 mb-8 max-w-xs text-center text-sm">Arrastra el archivo desde la carpeta "documents" de tu Kindle.</p>

                            <label className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 cursor-pointer shadow-lg shadow-indigo-500/25 transition-all active:scale-95 text-base border border-indigo-400/20">
                                Explorar Archivos <input type="file" accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                            </label>

                            <div className="mt-8 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                <button onClick={handleLoadDemo} className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-wider">
                                    ¿No tienes Kindle? Prueba la Demo
                                </button>
                            </div>
                        </div>

                        {/* FEATURES GRID */}
                        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
                            {[
                                { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Privacidad Total', text: 'Tus notas se procesan localmente en tu navegador. Nunca subimos tus datos.' },
                                { icon: ImageIcon, color: 'text-pink-400', bg: 'bg-pink-400/10', title: 'Creador de Stories', text: 'Diseña imágenes estéticas con tus citas favoritas listas para Instagram.' },
                                { icon: Smartphone, color: 'text-sky-400', bg: 'bg-sky-400/10', title: 'Instalable (PWA)', text: 'Instala la app en tu Android o iPhone y accede a tu biblioteca offline.' }
                            ].map((f, i) => (
                                <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className={`${f.bg} w-10 h-10 rounded-lg flex items-center justify-center ${f.color} mb-4`}><f.icon size={20} /></div>
                                    <h4 className="font-bold text-slate-200 mb-2">{f.title}</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">{f.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* FAQ SECTION */}
                        <div className="mt-24 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-8 text-center">Preguntas Frecuentes</h3>
                            <div className="space-y-4">
                                <FaqItem question="¿Dónde encuentro el archivo My Clippings?" answer='Conecta tu Kindle por USB. Abre la unidad que aparece en tu PC, entra a la carpeta "documents" y busca el archivo "My Clippings.txt".' />
                                <FaqItem question="¿Es una alternativa gratis a Readwise?" answer="Sí. Citando Ando es gratuito, open source y no requiere suscripción. Nos mantenemos gracias a las donaciones de café de los usuarios." />
                                <FaqItem question="¿Funciona con otros e-readers?" answer="Por ahora está optimizado para el formato estándar de Kindle, pero planeamos agregar soporte para Kobo en el futuro." />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ESTADO 2: BIBLIOTECA (DARK) --- */}
                {rawClippings.length > 0 && !selectedBook && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Book size={20} /></div>
                            Tu Biblioteca <span className="text-slate-500 font-normal text-sm ml-2">({library.length} libros)</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {library.map((book) => (<BookCard key={book.title} book={book} onClick={() => setSelectedBook(book)} />))}
                        </div>
                    </div>
                )}

                {/* --- ESTADO 3: DETALLE DE LIBRO (DARK) --- */}
                {selectedBook && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
                        <button onClick={() => setSelectedBook(null)} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 hover:bg-slate-900 rounded-lg w-fit">
                            <ChevronLeft size={16} /> Volver a la biblioteca
                        </button>

                        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl">
                            <div className="mb-10 border-b border-slate-800 pb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">{selectedBook.title}</h1>
                                <p className="text-lg text-indigo-400">{selectedBook.author}</p>
                            </div>
                            <div className="space-y-8">
                                {selectedBook.clippings.map((clip) => (
                                    <div key={clip.id} className="group relative pl-6 border-l-2 border-slate-700 hover:border-indigo-500 transition-colors">
                                        <p className="text-lg text-slate-300 leading-relaxed font-serif italic selection:bg-indigo-500/40">"{clip.content}"</p>
                                        <div className="mt-4 flex items-center gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mr-auto bg-slate-950 px-2 py-1 rounded border border-slate-800">{clip.type}</span>
                                            <button onClick={() => handleCopy(clip.content, selectedBook.author)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"><Copy size={14} /> Copiar</button>
                                            <button onClick={() => setClipToShare(clip)} className="flex items-center gap-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"><Share2 size={14} /> Crear Post</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* COMPONENTES GLOBALES */}
                {clipToShare && selectedBook && <ShareModal content={clipToShare.content} title={selectedBook.title} author={selectedBook.author} onClose={() => setClipToShare(null)} />}
                {toastMessage && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl shadow-black/50 border border-slate-700 flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-emerald-400" />
                            <p className="text-sm font-medium">{toastMessage}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}