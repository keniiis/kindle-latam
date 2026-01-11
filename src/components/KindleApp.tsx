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
const STORAGE_BOOK_KEY = 'kindle-latam-selected-book'; // Persistencia del libro seleccionado

import ManualEntryModal from '@/components/ManualEntryModal';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function KindleApp() {
    const [rawClippings, setRawClippings] = useState<Clipping[]>([]);
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [clipToShare, setClipToShare] = useState<Clipping | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualEntryData, setManualEntryData] = useState<{ title: string, author: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => { },
        isDanger: false,
        confirmText: 'Confirmar'
    });

    // ...

    // (Update handleCancelSelection logic in render props)

    // ...

    const library = useMemo(() => {
        const groups: Record<string, any> = {};
        rawClippings.forEach((clip) => {
            if (!groups[clip.title]) groups[clip.title] = { title: clip.title, author: clip.author, clippings: [] };
            groups[clip.title].clippings.push(clip);
        });
        return Object.values(groups).sort((a, b) => b.clippings.length - a.clippings.length);
    }, [rawClippings]);

    // Carga inicial
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                setRawClippings(JSON.parse(savedData));
            } catch (e) { console.error(e); }
        }
        setIsLoaded(true);
    }, []);

    // Recuperar libro seleccionado después de cargar la librería
    useEffect(() => {
        if (!isLoaded || library.length === 0 || selectedBook) return;

        const savedBookTitle = localStorage.getItem(STORAGE_BOOK_KEY);
        if (savedBookTitle) {
            const foundBook = library.find(b => b.title === savedBookTitle);
            if (foundBook) setSelectedBook(foundBook);
        }
    }, [isLoaded, library]); // Solo intenta restaurar si cambia la librería o termina de cargar

    // Persistencia: Guardar librería
    useEffect(() => {
        if (isLoaded && rawClippings.length > 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(rawClippings));
    }, [rawClippings, isLoaded]);

    // Persistencia: Guardar libro seleccionado actual
    useEffect(() => {
        if (!isLoaded) return;
        if (selectedBook) {
            localStorage.setItem(STORAGE_BOOK_KEY, selectedBook.title);
        } else {
            localStorage.removeItem(STORAGE_BOOK_KEY);
        }
    }, [selectedBook, isLoaded]);

    // Manejadores
    const handleFileUpload = async (file: File) => {
        const text = await file.text();
        setRawClippings(parseKindleClippings(text));
        setSelectedBook(null);
        localStorage.removeItem(STORAGE_BOOK_KEY);
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

        setRawClippings(prev => [newClipping, ...prev]);
        setShowManualModal(false);
        setManualEntryData(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddHighlight = (bookTitle: string, bookAuthor: string) => {
        setManualEntryData({ title: bookTitle, author: bookAuthor });
        setShowManualModal(true);
    };

    const triggerFileUpload = () => fileInputRef.current?.click();

    const handleClearData = () => {
        setConfirmation({
            isOpen: true,
            title: '¿Borrar toda la biblioteca?',
            description: 'Estás a punto de eliminar todos los libros y subrayados. Esta acción es irreversible.',
            isDanger: true,
            confirmText: 'Sí, borrar todo',
            onConfirm: () => {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(STORAGE_BOOK_KEY);
                setRawClippings([]);
                setSelectedBook(null);
            }
        });
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

    const handleToggleBook = (title: string) => {
        const newSet = new Set(selectedBookIds);
        if (newSet.has(title)) {
            newSet.delete(title);
        } else {
            newSet.add(title);
        }
        setSelectedBookIds(newSet);
    };

    const handleDeleteSelected = () => {
        setConfirmation({
            isOpen: true,
            title: `¿Eliminar ${selectedBookIds.size} libro(s)?`,
            description: 'Los libros seleccionados se eliminarán permanentemente de tu biblioteca local.',
            isDanger: true,
            confirmText: 'Eliminar',
            onConfirm: () => {
                const newClippings = rawClippings.filter(c => !selectedBookIds.has(c.title));
                setRawClippings(newClippings);
                setSelectedBookIds(new Set());
                setIsSelectionMode(false);
                // Clear local storage book selection if deleted
                const savedBook = localStorage.getItem(STORAGE_BOOK_KEY);
                if (savedBook && selectedBookIds.has(savedBook)) {
                    localStorage.removeItem(STORAGE_BOOK_KEY);
                }
            }
        });
    };

    // --- HISTORIAL DE NAVEGACIÓN Y BOTÓN ATRÁS ---

    // 1. Manejar el evento PopState (Cuando el usuario presiona Atrás en el navegador)
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            // Si hay un libro seleccionado y damos atrás -> Volver a librería
            if (selectedBook) {
                // event.preventDefault(); // Nota: preventDefault no funciona en popstate
                setSelectedBook(null); // Cerrar libro
                return;
            }

            // Si estamos en la librería (sin libro) y damos atrás
            // La intención del usuario es salir o volver al landing.
            if (rawClippings.length > 0) {
                // Si quisieras volver al landing:
                // setRawClippings([]);
                // Pero si solo queremos que el navegador maneje la salida del sitio, no hacemos nada.
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [selectedBook, rawClippings]);

    // 2. Agregar entrada al historial al abrir un libro
    useEffect(() => {
        if (selectedBook) {
            // Solo pushear si no estamos ya ahí
            if (window.location.hash !== '#book') {
                window.history.pushState({ view: 'book' }, '', '#book');
            }
        } else {
            // Si cerramos el libro con la UI (botón X), limpiamos el hash para que la URL quede limpia
            if (window.location.hash === '#book') {
                // Reemplazamos el estado actual por 'library' para no dejar el hash colgado
                // pero sin navegar atrás (para no causar líos con el stack)
                window.history.replaceState({ view: 'library' }, '', '#library');
            }
        }
    }, [selectedBook]);

    // 3. Agregar entrada al historial al cargar la librería (Landing -> Library)
    useEffect(() => {
        if (rawClippings.length > 0 && window.location.hash !== '#library' && window.location.hash !== '#book') {
            window.history.pushState({ view: 'library' }, '', '#library');
        }
    }, [rawClippings.length]);

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
                            selectedBooks={selectedBookIds}
                            onToggleBook={handleToggleBook}
                            onDeleteSelected={handleDeleteSelected}
                            onCancelSelection={() => {
                                setSelectedBookIds(new Set());
                                setIsSelectionMode(false);
                            }}
                            onDeleteAll={handleClearData}
                            isSelectionMode={isSelectionMode}
                            onToggleSelectionMode={setIsSelectionMode}
                        />
                    ) : (
                        <BookDetailView
                            book={selectedBook}
                            onBack={() => setSelectedBook(null)}
                            onShare={setClipToShare}
                            onUpdateBook={handleUpdateBook}
                            onAddHighlight={() => handleAddHighlight(selectedBook.title, selectedBook.author)}
                        />
                    )}
                </main>

                <input type="file" ref={fileInputRef} accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                {clipToShare && selectedBook && <ShareModal content={clipToShare.content} title={selectedBook.title} author={selectedBook.author} onClose={() => setClipToShare(null)} />}
                {showManualModal && (
                    <ManualEntryModal
                        onClose={() => setShowManualModal(false)}
                        onSave={handleManualSave}
                        initialTitle={manualEntryData?.title}
                        initialAuthor={manualEntryData?.author}
                    />
                )}

                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    description={confirmation.description}
                    isDanger={confirmation.isDanger}
                    confirmText={confirmation.confirmText}
                />
            </div>
        );
    }

    // Evitar parpadeo de Landing Page mientras cargamos datos
    if (!isLoaded) return null;

    // --- VISTA: LANDING PAGE (Si no hay datos) ---
    return (
        <>
            <LandingPage
                onStart={triggerFileUpload}
                onManualEntry={() => {
                    setManualEntryData(null);
                    setShowManualModal(true);
                }}
            />
            <input type="file" ref={fileInputRef} accept=".txt" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
            {showManualModal && (
                <ManualEntryModal
                    onClose={() => setShowManualModal(false)}
                    onSave={handleManualSave}
                    initialTitle={manualEntryData?.title}
                    initialAuthor={manualEntryData?.author}
                />
            )}
        </>
    );
}