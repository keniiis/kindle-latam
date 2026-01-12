'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { UploadCloud, Trash2, MoreVertical, Twitter, Plus, Clock, ArrowDownAZ, Tag, ChevronDown, Check, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import BookCard from '@/components/BookCard';

export type SortOption = 'recent' | 'title';

interface LibraryViewProps {
    library: any[];
    onSelectBook: (book: any, coverUrl?: string) => void;
    onImport: () => void;
    onManualEntry: () => void;
    selectedBooks: Set<string>;
    onToggleBook: (title: string) => void;
    onDeleteSelected: () => void;
    onCancelSelection: () => void;
    onDeleteAll: () => void;
    isSelectionMode: boolean;
    onToggleSelectionMode: (enabled: boolean) => void;

    // New Props for lifted state
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedGenre: string | null;
    onSelectGenre: (genre: string | null) => void;
    sortBy: SortOption;
    onSortChange: (option: SortOption) => void;

    activeTransitionTitle?: string | null;
    activeTransitionCoverUrl?: string | null;
}

export default function LibraryView({
    library,
    onSelectBook,
    onImport,
    onManualEntry,
    selectedBooks,
    onToggleBook,
    onDeleteSelected,
    onCancelSelection,
    onDeleteAll,
    isSelectionMode,
    onToggleSelectionMode,
    searchQuery,
    onSearchChange,
    selectedGenre,
    onSelectGenre,
    sortBy,
    onSortChange,
    activeTransitionTitle,
    activeTransitionCoverUrl
}: LibraryViewProps) {
    const [showMenu, setShowMenu] = useState(false);

    // Genre Filter
    const [isGenreMenuOpen, setIsGenreMenuOpen] = useState(false);
    const genreMenuRef = useRef<HTMLDivElement>(null);

    // Extract unique genres
    const availableGenres = useMemo(() => {
        const genres = new Set<string>();
        library.forEach((book: any) => {
            if (book.genre) genres.add(book.genre);
        });
        return Array.from(genres).sort();
    }, [library]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (genreMenuRef.current && !genreMenuRef.current.contains(event.target as Node)) {
                setIsGenreMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const processedLibrary = useMemo(() => {
        let result = [...library];

        if (selectedGenre) {
            result = result.filter(book => book.genre === selectedGenre);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(book =>
                book.title.toLowerCase().includes(q) ||
                book.author.toLowerCase().includes(q)
            );
        }

        switch (sortBy) {
            case 'recent':
                return result.sort((a, b) => {
                    const dateA = Math.max(...a.clippings.map((c: any) => new Date(c.date).getTime()));
                    const dateB = Math.max(...b.clippings.map((c: any) => new Date(c.date).getTime()));
                    return dateB - dateA;
                });
            case 'title':
                return result.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return result;
        }
    }, [library, sortBy, selectedGenre, searchQuery]);

    // PAGINACIÓN
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15); // Default mobile

    // Ajustar items por página según ancho de pantalla
    useEffect(() => {
        const handleResize = () => {
            // "30 libros en desktop (>768px), 15 en movil"
            if (window.innerWidth >= 768) {
                setItemsPerPage(30);
            } else {
                setItemsPerPage(15);
            }
        };

        // Ejecutar al inicio
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Resetear a página 1 si cambian filtros o items por página
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage, selectedGenre, library]);

    const totalPages = Math.ceil(processedLibrary.length / itemsPerPage);

    const paginatedLibrary = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return processedLibrary.slice(start, start + itemsPerPage);
    }, [processedLibrary, currentPage, itemsPerPage]);

    return (
        <>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12" onClick={() => setShowMenu(false)}>
                {/* HEADER SECCIÓN BIBLIOTECA */}
                <div className="flex flex-col gap-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#140d1c] tracking-tight mb-3">Tu Biblioteca</h1>
                            <div className="flex items-center gap-3">
                                <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-sm">{processedLibrary.length}</span>
                                <p className="text-gray-400 font-medium">libros {selectedGenre ? 'filtrados' : 'importados'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 relative">
                            {/* Agregar Manualmente */}
                            <button
                                onClick={onManualEntry}
                                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                                title="Agregar libro o frase manualmente"
                            >
                                <Plus size={20} className="text-purple-600" />
                                <span className="hidden sm:inline">Agregar</span>
                            </button>

                            {/* Importar */}
                            <button
                                onClick={onImport}
                                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 active:scale-95"
                            >
                                <UploadCloud size={20} className="group-hover:animate-bounce" />
                                <span>Importar</span>
                            </button>

                            {/* Menú Tres Puntos */}
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                    className="p-3 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                        <button
                                            onClick={() => { onDeleteAll(); setShowMenu(false); }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Eliminar todo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BARRA DE FILTROS Y ORDENAMIENTO */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Buscador */}
                        <div className="relative group flex-1 min-w-[200px] max-w-md">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar autor, título..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => onSearchChange('')}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                            <button
                                onClick={() => onSortChange('recent')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === 'recent'
                                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <Clock size={16} />
                                <span>Recientes</span>
                            </button>
                            <button
                                onClick={() => onSortChange('title')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === 'title'
                                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <ArrowDownAZ size={16} />
                                <span>A-Z</span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        {/* Dropdown de Género */}
                        <div className="relative" ref={genreMenuRef}>
                            <button
                                onClick={() => setIsGenreMenuOpen(!isGenreMenuOpen)}
                                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all border ${selectedGenre || isGenreMenuOpen
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <Tag size={16} />
                                <span>{selectedGenre || 'Filtrar por Género'}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${isGenreMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isGenreMenuOpen && (
                                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        <button
                                            onClick={() => { onSelectGenre(null); setIsGenreMenuOpen(false); }}
                                            className="w-full px-4 py-3 text-left text-sm font-bold flex items-center justify-between hover:bg-slate-50 transition-colors text-slate-600"
                                        >
                                            <span>Todos los libros</span>
                                            {!selectedGenre && <Check size={16} className="text-purple-600" />}
                                        </button>

                                        <div className="h-px bg-slate-100 my-1 mx-4"></div>

                                        {availableGenres.length === 0 && (
                                            <div className="px-4 py-3 text-xs text-slate-400 font-medium italic text-center">
                                                No hay géneros detectados
                                            </div>
                                        )}

                                        {availableGenres.map(genre => (
                                            <button
                                                key={genre}
                                                onClick={() => { onSelectGenre(genre); setIsGenreMenuOpen(false); }}
                                                className={`w-full px-4 py-2.5 text-left text-sm font-bold flex items-center justify-between transition-colors ${selectedGenre === genre
                                                    ? 'text-purple-700 bg-purple-50'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span>{genre}</span>
                                                {selectedGenre === genre && <Check size={16} className="text-purple-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botón para limpiar filtro (si activo) */}
                        {selectedGenre && (
                            <button
                                onClick={() => onSelectGenre(null)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors animate-in fade-in"
                            >
                                <X size={14} />
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* GRID DE LIBROS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                    {paginatedLibrary.map((book) => (
                        <BookCard
                            key={(book.title + book.author).replace(/\s+/g, '-')}
                            book={book}
                            onClick={(coverUrl) => {
                                if (selectedBooks.size > 0 || isSelectionMode) {
                                    onToggleBook(book.title);
                                } else {
                                    onSelectBook(book, coverUrl);
                                }
                            }}
                            selected={selectedBooks.has(book.title)}
                            onToggleSelection={() => onToggleBook(book.title)}
                            selectionMode={isSelectionMode || selectedBooks.size > 0}
                            viewTransitionName={activeTransitionTitle === book.title
                                ? `book-cover-${book.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`
                                : undefined}
                            overrideCoverUrl={activeTransitionTitle === book.title ? activeTransitionCoverUrl || undefined : undefined}
                        />
                    ))}

                    {processedLibrary.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-400">
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-slate-100 p-4 rounded-full">
                                    <Tag size={32} className="text-slate-300" />
                                </div>
                                <p className="font-medium">No se encontraron libros con este filtro.</p>
                                <button
                                    onClick={() => onSelectGenre(null)}
                                    className="text-purple-600 font-bold hover:underline text-sm"
                                >
                                    Ver todos los libros
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors text-slate-600"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <span className="text-sm font-bold text-slate-600">
                            Página {currentPage} de {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors text-slate-600"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* FOOTER COPYRIGHT */}
                <div className="mt-24 text-center border-t border-slate-100 pt-8 pb-8">
                    <p className="text-slate-400 text-sm font-medium mb-6">
                        © {new Date().getFullYear()} CitandoAndo. Hecho con pasión para amantes de la lectura.
                    </p>
                    <div className="flex justify-center gap-6">
                        <a
                            href="https://x.com/Danipena3488"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors text-sm font-bold"
                        >
                            <Twitter size={16} />
                            <span>Seguir en X</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* BARRA FLOTANTE DE SELECCIÓN */}
            {(selectedBooks.size > 0 || isSelectionMode) && (
                <div className="fixed bottom-10 left-0 right-0 mx-auto w-fit z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-[90vw]">
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 pl-3 pr-2 flex items-center gap-4 sm:gap-6 border border-purple-500">

                        {/* Contador y Texto */}
                        <div className="flex items-center gap-3 pl-2">
                            <span className="flex items-center justify-center size-8 bg-purple-600 text-white font-bold rounded-full text-sm shadow-lg shadow-purple-500/30">
                                {selectedBooks.size}
                            </span>
                            <div className="flex flex-col leading-tight">
                                <span className="text-slate-900 font-bold text-sm">Libros</span>
                                <span className="text-slate-500 font-medium text-xs">seleccionados</span>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-slate-100 mx-1"></div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onCancelSelection}
                                className="px-5 py-3 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm font-bold transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={onDeleteSelected}
                                disabled={selectedBooks.size === 0}
                                className="flex items-center gap-2 bg-red-50 border border-red-100/50 hover:bg-red-100 text-red-600 px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-50"
                            >
                                <Trash2 size={18} />
                                <span>Eliminar seleccionados</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
