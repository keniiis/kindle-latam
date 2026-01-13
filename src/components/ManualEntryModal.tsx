'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Book, User, Quote, Check, Plus, Loader2, Search, HelpCircle, ChevronDown, ChevronUp, AlertCircle, Tag } from 'lucide-react';

interface ManualEntryModalProps {
    onClose: () => void;
    onSave: (title: string, author: string, content: string, genre?: string) => void;
    initialTitle?: string;
    initialAuthor?: string;
    initialContent?: string;
    initialGenre?: string;
}

interface BookSuggestion {
    key: string;
    title: string;
    author_name?: string[];
    coverUrl?: string;
    genre?: string;
}

export default function ManualEntryModal({ onClose, onSave, initialTitle = '', initialAuthor = '', initialContent = '', initialGenre = '' }: ManualEntryModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [author, setAuthor] = useState(initialAuthor);
    const [genre, setGenre] = useState(initialGenre);
    const [content, setContent] = useState(initialContent);

    // Search states
    const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showTips, setShowTips] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const LIMIT = 500;
    const isOverLimit = content.length > LIMIT;

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

    // Auto-search if initial title is present (Share Target) AND we don't have an author yet
    useEffect(() => {
        if (initialTitle && initialTitle.length > 2 && !initialAuthor) {
            searchBooks(initialTitle);
        }
    }, []);

    const searchBooks = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&maxResults=10&printType=books`
            );
            const data = await response.json();

            const results: BookSuggestion[] = (data.items || []).map((item: any) => ({
                key: item.id,
                title: item.volumeInfo.title,
                author_name: item.volumeInfo.authors || ['Autor desconocido'],
                coverUrl: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
                genre: item.volumeInfo.categories?.[0] || ''
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
        if (book.genre) {
            setGenre(book.genre);
        }
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSave(title.trim() || 'Sin título', author.trim() || 'Autor desconocido', content.trim(), genre.trim());
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-purple-100 text-primary rounded-xl flex items-center justify-center shadow-inner">
                            <Plus size={20} strokeWidth={3} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-xl text-slate-900">Crear Manualmente</h3>
                                <HelpCircle size={16} className="text-slate-300" />
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Agrega una cita de cualquier libro físico o app.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                    {/* Collapsible Tips */}
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => setShowTips(!showTips)}
                            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-4 rounded-xl transition-colors border border-slate-100 group"
                        >
                            <span className="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-purple-700">
                                <div className="size-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <HelpCircle size={12} />
                                </div>
                                ¿Cómo importar de otras apps?
                            </span>
                            {showTips ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>

                        {showTips && (
                            <div className="bg-white border border-slate-100 rounded-xl p-4 text-xs space-y-3 animate-in fade-in slide-in-from-top-1 shadow-sm">
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
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campos de Libro y Autor */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2 relative" ref={wrapperRef}>
                                <label className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-2">
                                    <Book size={14} /> Título del Libro
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ej: Hábitos Atómicos"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all pr-10 shadow-sm"
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-2">
                                        <User size={14} /> Autor
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: James Clear"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-2">
                                        <Tag size={14} /> Género (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Autoayuda"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Área de la Cita */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-2">
                                <Quote size={14} /> Tu Cita / Highlight
                            </label>
                            <div className="relative">
                                <textarea
                                    placeholder="Escribe o pega aquí el texto que quieres convertir en imagen..."
                                    className={`w-full h-40 bg-white border rounded-2xl p-5 text-base font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed shadow-sm ${isOverLimit
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                        : 'border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
                                        }`}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                                <div className={`absolute bottom-4 right-4 text-[10px] font-bold pointer-events-none bg-white border px-2 py-1 rounded-lg flex items-center gap-2 shadow-sm ${isOverLimit ? 'text-red-500 border-red-200 bg-red-50/50' : 'text-slate-400 border-slate-100'
                                    }`}>
                                    <div className={`size-2 rounded-full ${isOverLimit ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                                    {content.length} / {LIMIT}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {isOverLimit && <AlertCircle size={12} className="text-red-500" />}
                                <p className={`text-[10px] italic transition-colors ${isOverLimit ? 'text-red-500 font-medium' : 'text-slate-300'}`}>
                                    Límite recomendado para historias: 500 caracteres.
                                </p>
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
        </div>
    );
}
