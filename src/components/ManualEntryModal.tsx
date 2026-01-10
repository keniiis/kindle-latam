'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Book, User, Quote, Check, Plus, Loader2, Search, HelpCircle } from 'lucide-react';

interface ManualEntryModalProps {
    onClose: () => void;
    onSave: (title: string, author: string, content: string) => void;
}

interface BookSuggestion {
    key: string;
    title: string;
    author_name?: string[];
    coverUrl?: string;
}

export default function ManualEntryModal({ onClose, onSave }: ManualEntryModalProps) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    // Search states
    const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const searchBooks = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            // Usamos Google Books API que tiene mejor soporte para español y miniaturas
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=es&maxResults=5&printType=books`
            );
            const data = await response.json();

            const results: BookSuggestion[] = (data.items || []).map((item: any) => ({
                key: item.id,
                title: item.volumeInfo.title,
                author_name: item.volumeInfo.authors || ['Autor desconocido'],
                coverUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:')
            }));

            setSuggestions(results);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error searching books:', error);
            setSuggestions([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (value.length > 2) {
            searchTimeout.current = setTimeout(() => {
                searchBooks(value);
            }, 500);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectBook = (book: BookSuggestion) => {
        setTitle(book.title);
        if (book.author_name && book.author_name.length > 0) {
            setAuthor(book.author_name[0]);
        }
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSave(title.trim() || 'Sin título', author.trim() || 'Autor desconocido', content.trim());
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-purple-100 text-primary rounded-xl flex items-center justify-center">
                            <Plus size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-xl text-slate-900">Crear Manualmente</h3>
                                <button
                                    onClick={() => setShowTips(!showTips)}
                                    className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                                    title="Ver tips de importación"
                                >
                                    <HelpCircle size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Agrega una cita de cualquier libro físico o app.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                    {/* Tips de Importación */}
                    {showTips && (
                        <div className="bg-purple-50 rounded-xl p-4 text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
                            <h4 className="font-bold text-primary flex items-center gap-2">
                                <HelpCircle size={14} /> Cómo importar de otras apps
                            </h4>
                            <ul className="space-y-2 text-slate-600 pl-4 list-disc marker:text-purple-300">
                                <li>
                                    <strong>Apple Books:</strong> Selecciona el texto, elige "Compartir" y copia el texto aquí.
                                </li>
                                <li>
                                    <strong>Google Play Books:</strong> Abre el documento de Google Docs automático con tus notas y copia el contenido.
                                </li>
                                <li>
                                    <strong>Kobo:</strong> Recomendamos copiar manualmente tus frases favoritas.
                                </li>
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campos de Libro y Autor */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2 relative" ref={wrapperRef}>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Book size={14} /> Título del Libro
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ej: Hábitos Atómicos"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all pr-10"
                                        value={title}
                                        onChange={handleTitleChange}
                                        onFocus={() => {
                                            if (suggestions.length > 0) setShowSuggestions(true);
                                        }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {isSearching ? (
                                            <Loader2 size={16} className="animate-spin text-purple-500" />
                                        ) : (
                                            <Search size={16} />
                                        )}
                                    </div>
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto">
                                        {suggestions.map((book) => (
                                            <button
                                                key={book.key}
                                                type="button"
                                                onClick={() => handleSelectBook(book)}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-start gap-3 group"
                                            >
                                                {book.coverUrl ? (
                                                    <img
                                                        src={book.coverUrl}
                                                        alt={book.title}
                                                        className="w-8 h-12 object-cover rounded shadow-sm bg-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-300">
                                                        <Book size={16} />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-slate-800 group-hover:text-purple-600 truncate transition-colors">
                                                        {book.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 truncate">
                                                        {book.author_name?.join(', ') || 'Autor desconocido'}
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Plus size={16} className="text-purple-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <User size={14} /> Autor
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: James Clear"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Área de la Cita */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Quote size={14} /> Tu Cita / Highlight
                            </label>
                            <div className="relative">
                                <textarea
                                    placeholder="Escribe o pega aquí el texto que quieres convertir en imagen..."
                                    className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-base font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none leading-relaxed"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 pointer-events-none bg-slate-50 px-2 py-1 rounded">
                                    {content.length} caracteres
                                </div>
                            </div>
                        </div>

                        {/* Botón Guardar */}
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="w-full bg-primary text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Check size={20} strokeWidth={3} />
                            Guardar en Biblioteca
                        </button>
                    </form>
                </div>
            </div>
            );
}
