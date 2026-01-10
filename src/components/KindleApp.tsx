'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { parseKindleClippings, Clipping } from '@/lib/parser';
import ShareModal from '@/components/ShareModal';
import LandingPage from '@/components/LandingPage';
import LibraryView from '@/components/LibraryView';
import BookDetailView from '@/components/BookDetailView';
import {
    BookOpen, Trash2, Coffee, Quote, Calendar, Plus
} from 'lucide-react';

const STORAGE_KEY = 'kindle-latam-library';

import ManualEntryModal from '@/components/ManualEntryModal';

export default function KindleApp() {
    const [rawClippings, setRawClippings] = useState<Clipping[]>([]);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [clipToShare, setClipToShare] = useState<Clipping | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
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

    const handleManualSave = (title: string, author: string, content: string) => {
        const newClipping: Clipping = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            title,
            author,
            content,
            meta: `Manual Entry | Added on ${new Date().toLocaleDateString()}`,
            type: 'Highlight',
            date: new Date()
        };

        // Agregar al principio
        setRawClippings(prev => [newClipping, ...prev]);
        setShowManualModal(false);
        // Seleccionar directamente este libro/autor
        // setBook(..)? Por ahora solo agregamos.
        // Scroll al top para ver resultado
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const triggerFileUpload = () => fileInputRef.current?.click();

    const handleClearData = () => {
        if (confirm('¿Borrar todo?')) { localStorage.removeItem(STORAGE_KEY); setRawClippings([]); setSelectedBook(null); }
    };

    const handleUpdateBook = (oldTitle: string, newTitle: string, newAuthor: string) => {
        setRawClippings(prev => prev.map(clip =>
            clip.title === oldTitle
                ? { ...clip, title: newTitle, author: newAuthor }
                : clip
        ));

        // Update selected book immediately so UI doesn't flicker/break
        setSelectedBook((prev: any) => prev ? { ...prev, title: newTitle, author: newAuthor } : null);
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

    if (rawClippings.length > 0) {
        return (
            <div className="min-h-screen bg-background-light font-display text-[#140d1c]">
                {/* Header App */}
                <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12 py-4">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedBook(null)}>
                            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                <BookOpen size={22} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">CitandoAndo</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowManualModal(true)}
                                className="hidden md:flex items-center gap-2 bg-purple-50 text-primary px-4 py-2 rounded-full text-xs font-bold hover:bg-purple-100 transition-colors"
                            >
                                <Plus size={16} /> Crear
                            </button>
                            <button
                                onClick={handleClearData}
                                className="size-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Borrar datos"
                            >
                                <Trash2 size={20} />
                            </button>
                            <a
                                href="https://ko-fi.com/devdanipena"
                                target="_blank"
                                className="hidden sm:flex bg-gradient-to-r from-primary to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all items-center gap-2"
                            >
                                <Coffee size={18} strokeWidth={2.5} />
                                <span>Invítame un café</span>
                            </a>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1200px] mx-auto px-6 lg:px-20 py-10">
                    {!selectedBook ? (
                        <LibraryView
                            library={library}
                            onSelectBook={setSelectedBook}
                            onImport={triggerFileUpload}
                        />
                    ) : (
                        <BookDetailView
                            book={selectedBook}
                            onBack={() => setSelectedBook(null)}
                            onShare={setClipToShare}
                            onUpdateBook={handleUpdateBook}
                        />
                    )}
                </main>

                <input type="file" ref={fileInputRef} accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                {clipToShare && selectedBook && <ShareModal content={clipToShare.content} title={selectedBook.title} author={selectedBook.author} onClose={() => setClipToShare(null)} />}
                {showManualModal && <ManualEntryModal onClose={() => setShowManualModal(false)} onSave={handleManualSave} />}
            </div>
        );
    }

    // --- VISTA: LANDING PAGE (Si no hay datos) ---
    return (
        <>
            <LandingPage onStart={triggerFileUpload} onManualEntry={() => setShowManualModal(true)} />
            <input type="file" ref={fileInputRef} accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            {showManualModal && <ManualEntryModal onClose={() => setShowManualModal(false)} onSave={handleManualSave} />}
        </>
    );
}