// src/app/page.tsx
'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { parseKindleClippings, Clipping } from '@/lib/parser';
import ShareModal from '@/components/ShareModal';
import { UploadCloud, Book, ChevronLeft, Quote, Share2, Copy, CheckCircle2, Loader2, Trash2 } from 'lucide-react';

// Constante para la llave del almacenamiento local
const STORAGE_KEY = 'kindle-latam-library';

// DATOS DE PRUEBA (DEMO)
const DEMO_TEXT = `
Hábitos Atómicos (James Clear)
- Highlight | Added on Monday, January 1, 2024

No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.
==========
Cien años de soledad (Gabriel García Márquez)
- Highlight | Added on Tuesday, January 2, 2024

Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.
==========
El Sutil Arte de Que te Importe un Carajo (Mark Manson)
- Highlight | Added on Wednesday, January 3, 2024

La felicidad es un problema constante.
==========
Manual de Desarrollo Web (Daniel Peña)
- Highlight | Added on Friday, January 5, 2024

Las PWAs son el futuro del desarrollo móvil en Latam. Si combinas Next.js con una buena estrategia de SEO local, eres imparable.
==========
`;

type BookGroup = {
    title: string;
    author: string;
    clippings: Clipping[];
};

// --- COMPONENTE BOOKCARD (CORREGIDO: Busca por Título Y Autor) ---
const BookCard = ({ book, onClick }: { book: BookGroup; onClick: () => void }) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchCover = async () => {
            // 1. Limpieza del Título
            const cleanTitle = book.title.split('(')[0].split(':')[0].split(' -')[0].trim();
            // 2. Limpieza del Autor
            const cleanAuthor = book.author.replace(/[\(\)]/g, '').trim();

            try {
                // Buscamos por Título Y Autor para mayor precisión
                const response = await fetch(
                    `https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}&author=${encodeURIComponent(cleanAuthor)}&limit=1&fields=cover_i`
                );
                const data = await response.json();

                if (isMounted && data.docs && data.docs.length > 0) {
                    // Buscamos el primero que tenga portada
                    const bookWithCover = data.docs.find((doc: any) => doc.cover_i);
                    if (bookWithCover) {
                        setCoverUrl(`https://covers.openlibrary.org/b/id/${bookWithCover.cover_i}-L.jpg`);
                    }
                }
            } catch (error) {
                console.error("Error portada:", cleanTitle);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchCover();
        return () => { isMounted = false; };
    }, [book.title, book.author]);

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-100 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
        >
            <div className="relative w-full aspect-2/3 bg-slate-100 overflow-hidden">
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt={`Portada de ${book.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 animate-in fade-in"
                    />
                ) : (
                    <div className={`w-full h-full bg-linear-to-br from-slate-50 to-slate-200 flex flex-col items-center justify-center p-4 text-center transition-all duration-500 ${isLoading ? 'opacity-80' : 'opacity-100'}`}>
                        {isLoading ? (
                            <Loader2 className="animate-spin text-indigo-400" size={24} />
                        ) : (
                            <>
                                <Book size={40} className="text-slate-300 mb-3" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed px-2 line-clamp-2">
                                    {book.title}
                                </span>
                            </>
                        )}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    {book.clippings.length}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                <div>
                    <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2 text-sm md:text-base">
                        {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{book.author}</p>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function Home() {
    const [rawClippings, setRawClippings] = useState<Clipping[]>([]);
    const [selectedBook, setSelectedBook] = useState<BookGroup | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [clipToShare, setClipToShare] = useState<Clipping | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. CARGAR DATOS
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setRawClippings(JSON.parse(savedData));
            } catch (e) {
                console.error("Error cargando datos", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // 2. GUARDAR DATOS
    useEffect(() => {
        if (isLoaded && rawClippings.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rawClippings));
        }
    }, [rawClippings, isLoaded]);

    // LOGOUT
    const handleClearData = () => {
        if (confirm('¿Estás seguro? Esto borrará tus libros de este navegador.')) {
            localStorage.removeItem(STORAGE_KEY);
            setRawClippings([]);
            setSelectedBook(null);
        }
    };

    // NUEVO: CARGAR DEMO
    const handleLoadDemo = () => {
        const parsed = parseKindleClippings(DEMO_TEXT.trim());
        setRawClippings(parsed);
        setToastMessage("¡Modo Demo activado! 🚀");
    };

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const library = useMemo(() => {
        const groups: Record<string, BookGroup> = {};
        rawClippings.forEach((clip) => {
            if (!groups[clip.title]) {
                groups[clip.title] = { title: clip.title, author: clip.author, clippings: [] };
            }
            groups[clip.title].clippings.push(clip);
        });
        return Object.values(groups).sort((a, b) => b.clippings.length - a.clippings.length);
    }, [rawClippings]);

    const handleFileUpload = async (file: File) => {
        const text = await file.text();
        const parsed = parseKindleClippings(text);
        setRawClippings(parsed);
        setSelectedBook(null);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
    }, []);

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

    const handleCopy = (text: string, author: string) => {
        navigator.clipboard.writeText(`> ${text}\n>\n> — *${author}*`);
        setToastMessage("¡Copiado al portapapeles!");
    };

    if (!isLoaded) return null;

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
            <div className="max-w-6xl mx-auto p-6 md:p-12">

                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Citando<span className="text-indigo-600">Ando</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Tu segundo cerebro, versión PWA</p>
                    </div>
                    {rawClippings.length > 0 && (
                        <button
                            onClick={handleClearData}
                            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100"
                        >
                            <Trash2 size={16} /> Salir
                        </button>
                    )}
                </header>

                {/* VISTA 1: UPLOAD */}
                {rawClippings.length === 0 && (
                    <div
                        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                        className={`
              flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-3xl transition-all
              ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-slate-400'}
            `}
                    >
                        <div className="p-6 bg-indigo-100 rounded-full text-indigo-600 mb-6">
                            <UploadCloud size={48} />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Sube tu "My Clippings.txt"</h2>
                        <p className="text-slate-500 mb-8 max-w-md text-center">
                            Tus datos se guardan en tu navegador. Privacidad total.
                        </p>
                        <label className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 cursor-pointer shadow-lg shadow-indigo-200 transition-all active:scale-95">
                            Explorar Archivos
                            <input type="file" accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                        </label>

                        {/* BOTÓN MÁGICO PARA DEMO */}
                        <div className="mt-8 pt-6 border-t border-slate-200 w-full max-w-xs text-center">
                            <p className="text-xs text-slate-400 mb-3 uppercase tracking-wide font-bold">¿No tienes archivo?</p>
                            <button
                                onClick={handleLoadDemo}
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600 underline decoration-indigo-200 hover:decoration-indigo-600 underline-offset-4 transition-all"
                            >
                                Cargar datos de prueba
                            </button>
                        </div>
                    </div>
                )}

                {/* VISTA 2: BIBLIOTECA */}
                {rawClippings.length > 0 && !selectedBook && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Book className="text-indigo-600" />
                            Tu Biblioteca ({library.length} libros)
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {library.map((book) => (
                                <BookCard
                                    key={book.title}
                                    book={book}
                                    onClick={() => setSelectedBook(book)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* VISTA 3: DETALLE */}
                {selectedBook && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
                        <button
                            onClick={() => setSelectedBook(null)}
                            className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                        >
                            <ChevronLeft size={20} /> Volver a la biblioteca
                        </button>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="mb-10 border-b border-slate-100 pb-6">
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{selectedBook.title}</h1>
                                <p className="text-lg text-slate-500">{selectedBook.author}</p>
                            </div>

                            <div className="space-y-8">
                                {selectedBook.clippings.map((clip) => (
                                    <div key={clip.id} className="group relative pl-6 border-l-4 border-slate-200 hover:border-indigo-500 transition-colors">
                                        <p className="text-lg text-slate-700 leading-relaxed font-serif italic">"{clip.content}"</p>

                                        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs text-slate-400 font-sans uppercase tracking-wider mr-auto">{clip.type}</span>

                                            <button
                                                onClick={() => handleCopy(clip.content, selectedBook.author)}
                                                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                                                title="Copiar formato Markdown"
                                            >
                                                <Copy size={14} /> Copiar
                                            </button>

                                            <button
                                                onClick={() => setClipToShare(clip)}
                                                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                                            >
                                                <Share2 size={14} /> Crear Post
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL & TOAST */}
                {clipToShare && selectedBook && (
                    <ShareModal
                        content={clipToShare.content}
                        title={selectedBook.title}
                        author={selectedBook.author}
                        onClose={() => setClipToShare(null)}
                    />
                )}
                {toastMessage && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-400" />
                            <p className="text-sm font-medium pr-1">{toastMessage}</p>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}