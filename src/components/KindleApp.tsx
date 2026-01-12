'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { parseKindleClippings, Clipping } from '@/lib/parser';
import ShareModal from '@/components/ShareModal';
import LandingPage from '@/components/LandingPage';
import LibraryView, { SortOption } from '@/components/LibraryView';
import BookDetailView from '@/components/BookDetailView';
import {
    BookOpen, Trash2, Coffee, Quote, Calendar, Plus
} from 'lucide-react';

const STORAGE_KEY = 'kindle-latam-library';
const STORAGE_BOOK_KEY = 'kindle-latam-selected-book'; // Persistencia del libro seleccionado

import ManualEntryModal from '@/components/ManualEntryModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { ToastProvider } from '@/components/Toast';

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
            if (!groups[clip.title]) groups[clip.title] = {
                title: clip.title,
                author: clip.author,
                clippings: [],
                genre: clip.genre
            };
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

    // Mapa de traducción de géneros
    const GENRE_TRANSLATIONS: Record<string, string> = {
        'Fiction': 'Ficción',
        'Juvenile Fiction': 'Ficción Juvenil',
        'Science Fiction': 'Ciencia Ficción',
        'Fantasy': 'Fantasía',
        'Business & Economics': 'Negocios',
        'Self-Help': 'Autoayuda',
        'Psychology': 'Psicología',
        'Philosophy': 'Filosofía',
        'Biography & Autobiography': 'Biografía',
        'History': 'Historia',
        'Religion': 'Religión',
        'Social Science': 'Ciencias Sociales',
        'Computers': 'Tecnología',
        'Technology': 'Tecnología',
        'Science': 'Ciencia',
        'Health & Fitness': 'Salud y Bienestar',
        'Cooking': 'Cocina',
        'Art': 'Arte',
        'Travel': 'Viajes',
        'Poetry': 'Poesía',
        'Comics & Graphic Novels': 'Cómics',
        'Drama': 'Drama',
        'Literary Criticism': 'Crítica Literaria',
        'Political Science': 'Política',
        'Education': 'Educación',
        'Foreign Language Study': 'Idiomas',
        'Body, Mind & Spirit': 'Espiritualidad',
        'Family & Relationships': 'Familia',
        'Humor': 'Humor',
        'Performing Arts': 'Artes Escénicas',
        'Sports & Recreation': 'Deportes',
        'Adventure': 'Aventura',
        'Literary Collections': 'Colecciones Literarias',
        'Literature': 'Literatura',
        'Classics': 'Clásicos',
        'Novel': 'Novela'
    };

    const translateGenre = (genre: string): string => {
        // Búsqueda directa
        if (GENRE_TRANSLATIONS[genre]) return GENRE_TRANSLATIONS[genre];

        // Búsqueda parcial case-insensitive
        const key = Object.keys(GENRE_TRANSLATIONS).find(k =>
            genre.toLowerCase().includes(k.toLowerCase())
        );
        return key ? GENRE_TRANSLATIONS[key] : genre;
    };

    // Helper para buscar género (puedes moverlo fuera del componente si prefieres)
    const fetchBookGenre = async (title: string, author: string) => {
        try {
            const query = `intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
            const data = await res.json();
            if (data.items?.[0]?.volumeInfo?.categories?.length > 0) {
                const rawGenre = data.items[0].volumeInfo.categories[0];
                return translateGenre(rawGenre);
            }
            return 'General'; // Fallback si no encuentra
        } catch (e) {
            return 'General';
        }
    };

    // Efecto para enriquecer automáticamente con géneros
    useEffect(() => {
        if (!isLoaded || rawClippings.length === 0) return;

        // 1. Traducir géneros existentes que estén en inglés (usando el helper completo)
        let translationUpdate = false;
        const translatedClippings = rawClippings.map(clip => {
            if (clip.genre) {
                const translated = translateGenre(clip.genre);
                if (translated !== clip.genre) {
                    translationUpdate = true;
                    return { ...clip, genre: translated };
                }
            }
            return clip;
        });

        if (translationUpdate) {
            setRawClippings(translatedClippings);
            return; // Esperar al siguiente render
        }

        const enrichLibrary = async () => {
            // 1. Identificar libros sin género
            const booksWithoutGenre = new Set<string>();
            rawClippings.forEach(c => {
                if (!c.genre) booksWithoutGenre.add(c.title);
            });

            if (booksWithoutGenre.size === 0) return;

            // 2. Procesar uno por uno para no saturar la API (o en lotes pequeños)
            // Tomamos el primero que encontremos para ir "rellenando" progresivamente
            const titleToUpdate = Array.from(booksWithoutGenre)[0];
            // Encontrar el autor de este libro
            const validClip = rawClippings.find(c => c.title === titleToUpdate);
            if (!validClip) return;

            const genre = await fetchBookGenre(titleToUpdate, validClip.author);

            // 3. Actualizar el estado
            setRawClippings(prev => prev.map(clip =>
                clip.title === titleToUpdate
                    ? { ...clip, genre: genre }
                    : clip
            ));
        };

        // Debounce simple para no bloquear
        const timeout = setTimeout(enrichLibrary, 1000);
        return () => clearTimeout(timeout);
    }, [rawClippings, isLoaded]);

    const handleManualSave = (title: string, author: string, content: string, genre?: string) => {
        const newClipping: Clipping = {
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            title,
            author,
            content,
            meta: `Manual Entry | Added on ${new Date().toLocaleDateString()}`,
            type: 'Highlight',
            date: new Date(),
            genre: genre || 'General'
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

    const handleUpdateClip = (clipId: string, newContent: string) => {
        setRawClippings(prev => prev.map(clip =>
            clip.id === clipId
                ? { ...clip, content: newContent }
                : clip
        ));

        // Update selected book immediately
        setSelectedBook((prev: any) => {
            if (!prev) return null;
            return {
                ...prev,
                clippings: prev.clippings.map((c: any) =>
                    c.id === clipId ? { ...c, content: newContent } : c
                )
            };
        });
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

    const [selectedBookCover, setSelectedBookCover] = useState<string | null>(null);

    // Lifted State for Library Filters
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('recent');

    // State for View Transitions (avoid rendering bugs)
    const [transitioningTitle, setTransitioningTitle] = useState<string | null>(null);
    const [transitioningCoverUrl, setTransitioningCoverUrl] = useState<string | null>(null);
    const [scrollPos, setScrollPos] = useState(0);

    // Helper para transiciones de vista (View Transition API)
    const handleSetSelectedBook = (book: any | null, coverUrl?: string) => {
        if (typeof document !== 'undefined' && 'startViewTransition' in document) {

            // PREPARAR ESTADO DE TRANSICIÓN (Síncrono antes de iniciar)
            flushSync(() => {
                if (book) {
                    setScrollPos(window.scrollY);
                    setTransitioningTitle(book.title);
                    if (coverUrl) setTransitioningCoverUrl(coverUrl);
                } else {
                    // CERRANDO: Asegurar que título y cover estén listos para el aterrizaje
                    if (selectedBook) setTransitioningTitle(selectedBook.title);
                    setTransitioningCoverUrl(selectedBookCover);
                }
            });

            (document as any).startViewTransition(() => {
                flushSync(() => {
                    setSelectedBook(book);
                    if (coverUrl) setSelectedBookCover(coverUrl);
                    else if (!book) setSelectedBookCover(null);
                });

                // RESTAURAR SCROLL AL CERRAR
                if (!book) {
                    window.scrollTo(0, scrollPos);
                } else {
                    // RESETEAR SCROLL AL ABRIR (Top)
                    window.scrollTo(0, 0);
                }
            });
        } else {
            if (book) {
                setScrollPos(window.scrollY);
                setTransitioningTitle(book.title);
                if (coverUrl) setTransitioningCoverUrl(coverUrl);
            } else if (selectedBook) {
                setTransitioningTitle(selectedBook.title);
                setTransitioningCoverUrl(selectedBookCover);
            }

            setSelectedBook(book);
            if (coverUrl) setSelectedBookCover(coverUrl);
            else if (!book) {
                setSelectedBookCover(null);
                setTimeout(() => window.scrollTo(0, scrollPos), 0);
            } else {
                window.scrollTo(0, 0);
            }
        }
    };

    if (rawClippings.length > 0) {
        return (
            <ToastProvider>
                <div className="min-h-screen bg-background-light font-display text-[#140d1c]">
                    {/* Header App */}
                    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-20 py-4">
                        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSetSelectedBook(null)}>
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
                                onSelectBook={handleSetSelectedBook}
                                onImport={triggerFileUpload}
                                onManualEntry={() => {
                                    setManualEntryData(null);
                                    setShowManualModal(true);
                                }}
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

                                // Lifted Props
                                selectedGenre={selectedGenre}
                                onSelectGenre={setSelectedGenre}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                activeTransitionTitle={transitioningTitle}
                                activeTransitionCoverUrl={transitioningCoverUrl}
                            />
                        ) : (
                            <BookDetailView
                                book={selectedBook}
                                initialCoverUrl={selectedBookCover || undefined}
                                onBack={() => handleSetSelectedBook(null)}
                                onShare={setClipToShare}
                                onUpdateBook={handleUpdateBook}
                                onAddHighlight={() => handleAddHighlight(selectedBook.title, selectedBook.author)}
                                onUpdateClip={handleUpdateClip}
                                onUpdateCover={setSelectedBookCover}
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
            </ToastProvider>
        );
    }

    // Evitar parpadeo de Landing Page mientras cargamos datos
    if (!isLoaded) return null;

    // --- VISTA: LANDING PAGE (Si no hay datos) ---
    return (
        <ToastProvider>
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
        </ToastProvider>
    );
}