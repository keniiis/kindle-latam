'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { parseKindleClippings, Clipping } from '@/lib/parser';
import ShareModal from '@/components/ShareModal';
import {
    BookOpen, ArrowRight, Tablet, Smartphone, Usb, Quote, Share2,
    DownloadCloud, WifiOff, RefreshCw, CheckCircle2, Menu, Palette,
    BadgeCheck, UploadCloud, ChevronLeft, Copy, Trash2, Coffee, Book
} from 'lucide-react';

const STORAGE_KEY = 'kindle-latam-library';

// --- COMPONENTE TARJETA LIBRO (ADAPTADO AL NUEVO TEMA) ---
const BookCard = ({ book, onClick }: { book: any; onClick: () => void }) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchCover = async () => {
            const cleanTitle = book.title.split('(')[0].split(':')[0].trim();
            const cleanAuthor = book.author.replace(/[\(\)]/g, '').trim();
            try {
                const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(cleanTitle)}&author=${encodeURIComponent(cleanAuthor)}&limit=1&fields=cover_i`);
                const data = await res.json();
                if (isMounted && data.docs?.length > 0 && data.docs[0].cover_i) {
                    setCoverUrl(`https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`);
                }
            } catch (e) { console.error(e); }
        };
        fetchCover();
        return () => { isMounted = false; };
    }, [book.title, book.author]);

    return (
        <div onClick={onClick} className="group bg-white rounded-xl shadow-sm hover:shadow-xl hover:shadow-primary/10 border border-primary/10 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full">
            <div className="relative w-full aspect-[2/3] bg-background-light overflow-hidden">
                {coverUrl ? (
                    <img src={coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-primary/40">
                        <Book size={40} className="mb-3" />
                        <span className="text-[10px] font-bold uppercase">{book.title}</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-primary text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-primary/10">{book.clippings.length}</div>
            </div>
            <div className="p-4 bg-white">
                <h3 className="font-bold text-[#140d1c] text-sm line-clamp-2 leading-tight mb-1 group-hover:text-primary transition-colors">{book.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
            </div>
        </div>
    );
};

export default function KindleApp() {
    const [rawClippings, setRawClippings] = useState<Clipping[]>([]);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [clipToShare, setClipToShare] = useState<Clipping | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carga inicial
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) { try { setRawClippings(JSON.parse(savedData)); } catch (e) { console.error(e); } }
        setIsLoaded(true);
    }, []);

    // Persistencia
    useEffect(() => {
        if (isLoaded && rawClippings.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(rawClippings));
    }, [rawClippings, isLoaded]);

    // Manejadores
    const handleFileUpload = async (file: File) => {
        const text = await file.text();
        setRawClippings(parseKindleClippings(text));
        setSelectedBook(null);
        // Scroll al top cuando se carga
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const triggerFileUpload = () => fileInputRef.current?.click();

    const handleClearData = () => {
        if (confirm('¿Borrar todo?')) { localStorage.removeItem(STORAGE_KEY); setRawClippings([]); setSelectedBook(null); }
    };

    const library = useMemo(() => {
        const groups: Record<string, any> = {};
        rawClippings.forEach((clip) => {
            if (!groups[clip.title]) groups[clip.title] = { title: clip.title, author: clip.author, clippings: [] };
            groups[clip.title].clippings.push(clip);
        });
        return Object.values(groups).sort((a, b) => b.clippings.length - a.clippings.length);
    }, [rawClippings]);

    if (!isLoaded) return null;

    // --- VISTA: LIBRERÍA / APP (Si hay datos) ---
    if (rawClippings.length > 0) {
        return (
            <div className="min-h-screen bg-background-light font-display text-[#140d1c]">
                {/* Header App */}
                <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-primary/10 px-6 lg:px-40 py-4">
                    <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <BookOpen size={20} />
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight">CitandoAndo</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handleClearData} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={18} /></button>
                            <a href="https://ko-fi.com/devdanipena" target="_blank" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Coffee size={16} /> <span>Invítame un café</span>
                            </a>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1200px] mx-auto px-6 lg:px-20 py-10">
                    {!selectedBook ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Tu Biblioteca</h2>
                                    <p className="text-gray-500">{library.length} libros importados</p>
                                </div>
                                <button onClick={triggerFileUpload} className="text-primary text-sm font-bold hover:underline">+ Importar nuevo archivo</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {library.map((book) => (<BookCard key={book.title} book={book} onClick={() => setSelectedBook(book)} />))}
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
                            <button onClick={() => setSelectedBook(null)} className="mb-8 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
                                <ChevronLeft size={20} /> Volver a la biblioteca
                            </button>
                            <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-sm">
                                <div className="mb-10 border-b border-gray-100 pb-6">
                                    <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
                                    <p className="text-lg text-primary">{selectedBook.author}</p>
                                </div>
                                <div className="space-y-8">
                                    {selectedBook.clippings.map((clip: any) => (
                                        <div key={clip.id} className="pl-6 border-l-4 border-gray-100 hover:border-primary transition-colors group">
                                            <p className="text-lg text-gray-700 font-serif italic mb-3">"{clip.content}"</p>
                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => { navigator.clipboard.writeText(clip.content); alert('Copiado!') }} className="text-xs font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1"><Copy size={14} /> Copiar</button>
                                                <button onClick={() => setClipToShare(clip)} className="text-xs font-bold text-primary hover:text-purple-700 flex items-center gap-1"><Share2 size={14} /> Crear Post</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                {/* INPUT OCULTO SIEMPRE PRESENTE */}
                <input type="file" ref={fileInputRef} accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                {clipToShare && selectedBook && <ShareModal content={clipToShare.content} title={selectedBook.title} author={selectedBook.author} onClose={() => setClipToShare(null)} />}
            </div>
        );
    }

    // --- VISTA: LANDING PAGE (Si no hay datos) ---
    return (
        <div className="bg-background-light font-display text-[#140d1c] transition-colors duration-300">

            {/* HEADER LANDING */}
            <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-primary/10 px-6 lg:px-40 py-3">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">CitandoAndo</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#como-funciona">Cómo funciona</a>
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#features">Beneficios</a>
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#preview">Preview</a>
                    </nav>
                    <button onClick={triggerFileUpload} className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
                        Empezar ahora
                    </button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto">

                {/* HERO SECTION */}
                <section className="px-6 lg:px-20 py-16 md:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-bold w-fit uppercase tracking-widest">Beta abierta</span>
                                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-[#140d1c]">
                                    Tus lecturas merecen ser <span className="text-primary">compartidas</span>
                                </h1>
                                <p className="text-lg md:text-xl opacity-80 leading-relaxed max-w-lg">
                                    Transforma tus highlights de Kindle en arte listo para tus redes sociales en segundos. Sin descargas, directo desde tu navegador.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={triggerFileUpload} className="bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-primary/30">
                                    Probar gratis <ArrowRight size={20} />
                                </button>
                                <div className="flex items-center gap-3 px-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => <div key={i} className="size-10 rounded-full border-2 border-white bg-gray-200" />)}
                                    </div>
                                    <span className="text-sm font-medium opacity-70">+2k lectores ya lo usan</span>
                                </div>
                            </div>
                        </div>

                        {/* HERO VISUAL / MOCKUP */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                                <div className="aspect-4/3 bg-linear-to-br from-primary/30 to-purple-500/20 flex items-center justify-center p-8">
                                    <div onClick={triggerFileUpload} className="cursor-pointer group relative w-full h-full bg-white/40 backdrop-blur-xl rounded-xl border-2 border-dashed border-white/50 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/60 transition-all">
                                        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <UploadCloud size={40} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">Sube tu archivo aquí</h3>
                                            <p className="text-sm opacity-60">My Clippings.txt</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SOCIAL PROOF */}
                <div className="px-6 py-10 opacity-50 grayscale hover:grayscale-0 transition-all flex flex-wrap justify-center items-center gap-12 text-sm font-bold uppercase tracking-widest border-y border-primary/10">
                    <span>TechCrunch</span><span>Product Hunt</span><span>The Verge</span><span>Wired</span><span>Medium</span>
                </div>

                {/* HOW IT WORKS */}
                <section className="px-6 py-20" id="como-funciona">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Comparte en 3 simples pasos</h2>
                        <p className="text-lg opacity-70">Olvídate de capturas de pantalla feas y texto plano.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { num: 1, title: 'Conecta tu Kindle', text: 'Sincroniza tus notas vía USB o correo electrónico de forma segura.', icon: Usb },
                            { num: 2, title: 'Elige tu cita', text: 'Navega por tus libros y selecciona el fragmento que más te inspiró.', icon: Quote },
                            { num: 3, title: 'Comparte en IG', text: 'Personaliza el diseño y expórtalo directamente a tus historias.', icon: Share2 }
                        ].map((step) => (
                            <div key={step.num} className="group bg-white p-8 rounded-2xl border border-primary/10 hover:border-primary/40 transition-all shadow-sm">
                                <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 font-black text-2xl group-hover:bg-primary group-hover:text-white transition-colors">{step.num}</div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="opacity-70 leading-relaxed mb-6">{step.text}</p>
                                <div className="w-full h-32 bg-background-light rounded-xl flex items-center justify-center text-primary/20">
                                    <step.icon size={48} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PWA FEATURES */}
                <section className="px-6 py-20 bg-primary/5 rounded-[3rem]" id="features">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">¿Por qué una PWA?</h2>
                        <p className="text-lg opacity-70 italic">La potencia de una app nativa con la agilidad de la web.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Sin descargas', text: 'Accede instantáneamente sin pasar por la App Store.', icon: DownloadCloud },
                            { title: 'Modo Offline', text: '¿Sin internet en el metro? No hay problema. Tus citas están disponibles.', icon: WifiOff },
                            { title: 'Siempre al día', text: 'Actualizaciones automáticas invisibles. Disfruta de nuevas funciones.', icon: RefreshCw }
                        ].map((feat, i) => (
                            <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/50">
                                <feat.icon className="text-primary mb-4" size={32} />
                                <h4 className="text-lg font-bold mb-2">{feat.title}</h4>
                                <p className="text-sm opacity-70">{feat.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PREVIEW SECTION (STATIC VISUAL) */}
                <section className="px-6 py-24 my-20" id="preview">
                    <div className="bg-white/50 border border-primary/10 rounded-[3rem] p-12 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#8c25f4_1px,transparent_1px)] bg-size-[20px_20px] opacity-[0.03]"></div>
                        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <h2 className="text-4xl font-extrabold mb-6">Playground Interactivo</h2>
                                <p className="text-lg opacity-70 mb-8">
                                    El estudio creativo donde tus lecturas cobran vida. Personaliza colores, fuentes y fondos en tiempo real antes de compartir.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-primary/10">
                                        <Palette className="text-primary" />
                                        <span className="font-bold">Múltiples temas de color</span>
                                        <BadgeCheck className="text-green-500 ml-auto" />
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-primary/10">
                                        <Menu className="text-primary" />
                                        <span className="font-bold">Fuentes Serif & Sans</span>
                                        <BadgeCheck className="text-green-500 ml-auto" />
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex justify-center">
                                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full"></div>
                                {/* Mockup simplificado */}
                                <div className="relative w-[280px] h-[580px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">
                                    <div className="h-full bg-linear-to-br from-primary to-purple-800 p-8 flex flex-col justify-center text-white text-center">
                                        <Quote className="mx-auto mb-6 opacity-50" size={32} />
                                        <p className="font-serif italic text-xl leading-relaxed">"La lectura es una conversación con las mejores mentes..."</p>
                                        <div className="mt-8 pt-4 border-t border-white/20">
                                            <p className="text-xs font-bold uppercase tracking-widest">René Descartes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER CTA */}
                <footer className="px-6 py-20">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <h2 className="text-4xl md:text-6xl font-black max-w-2xl leading-tight">¿Listo para darle vida a tus notas?</h2>
                            <button onClick={triggerFileUpload} className="bg-white text-primary h-16 px-12 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                                Empezar ahora gratis
                            </button>
                        </div>
                    </div>
                    <div className="mt-12 text-center text-sm opacity-50 font-medium">
                        <p>© 2026 CitandoAndo. Hecho con ❤️ para lectores.</p>
                    </div>
                </footer>

            </main>

            {/* INPUT FILE OCULTO (Necesario para la landing también) */}
            <input type="file" ref={fileInputRef} accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
        </div>
    );
}