'use client';

import { useState } from 'react';
import { UploadCloud, Trash2, MoreVertical, Twitter } from 'lucide-react';
import BookCard from '@/components/BookCard';

interface LibraryViewProps {
    library: any[];
    onSelectBook: (book: any) => void;
    onImport: () => void;
    selectedBooks: Set<string>;
    onToggleBook: (title: string) => void;
    onDeleteSelected: () => void;
    onCancelSelection: () => void;
    onDeleteAll: () => void;
    isSelectionMode: boolean;
    onToggleSelectionMode: (enabled: boolean) => void;
}

export default function LibraryView({
    library,
    onSelectBook,
    onImport,
    selectedBooks,
    onToggleBook,
    onDeleteSelected,
    onCancelSelection,
    onDeleteAll,
    isSelectionMode,
    onToggleSelectionMode
}: LibraryViewProps) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32" onClick={() => setShowMenu(false)}>
                {/* HEADER SECCIÓN BIBLIOTECA */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#140d1c] tracking-tight mb-3">Tu Biblioteca</h1>
                        <div className="flex items-center gap-3">
                            <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-sm">{library.length}</span>
                            <p className="text-gray-400 font-medium">libros importados</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 relative">
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

                {/* GRID DE LIBROS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                    {library.map((book) => (
                        <BookCard
                            key={book.title}
                            book={book}
                            onClick={() => {
                                if (selectedBooks.size > 0 || isSelectionMode) {
                                    onToggleBook(book.title);
                                } else {
                                    onSelectBook(book);
                                }
                            }}
                            selected={selectedBooks.has(book.title)}
                            onToggleSelection={() => onToggleBook(book.title)}
                            selectionMode={isSelectionMode || selectedBooks.size > 0}
                        />
                    ))}
                </div>

                {/* FOOTER COPYRIGHT */}
                <div className="mt-24 text-center border-t border-slate-100 pt-8 pb-8">
                    <p className="text-slate-400 text-sm font-medium mb-6">
                        © {new Date().getFullYear()} CitandoAndo. Hecho con pasión para amantes de la lectura.
                    </p>
                    <div className="flex justify-center gap-6">
                        {/* <a
                            href="mailto:hola@citandoando.com"
                            className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors text-sm font-bold"
                        >
                            <Mail size={16} />
                            <span>Contáctanos</span>
                        </a> */}
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
