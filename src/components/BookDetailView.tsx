'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Share2, Quote, Calendar, Edit2, Check, X, Plus, Book } from 'lucide-react';
import { Clipping } from '@/lib/parser';

interface BookDetailViewProps {
    book: any;
    onBack: () => void;
    onShare: (clip: Clipping) => void;
    onUpdateBook?: (oldTitle: string, newTitle: string, newAuthor: string) => void;
    onAddHighlight?: () => void;
}

export default function BookDetailView({ book, onBack, onShare, onUpdateBook, onAddHighlight }: BookDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(book.title);
    const [editAuthor, setEditAuthor] = useState(book.author);
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const findCover = async () => {
            const cleanTitle = book.title.split('(')[0].split(':')[0].split(';')[0].trim();
            const cleanAuthor = book.author.replace(/[\(\)]/g, '').split(',')[0].trim();
            const queryTitle = encodeURIComponent(cleanTitle);
            const queryAuthor = encodeURIComponent(cleanAuthor);

            try {
                const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${queryTitle}+inauthor:${queryAuthor}&maxResults=1&langRestrict=es`);
                const googleData = await googleRes.json();
                if (isMounted && googleData.items?.length > 0 && googleData.items[0].volumeInfo.imageLinks?.thumbnail) {
                    // Pedimos imagen más grande si es posible cambiando curl por zoom o similar si estuviera disponible, 
                    // o simplemente usamos la thumbnail
                    setCoverUrl(googleData.items[0].volumeInfo.imageLinks.thumbnail.replace('http:', 'https:'));
                    return;
                }
            } catch (err) { console.warn("Google Books API failed", err); }

            // Fallback
            try {
                const olRes = await fetch(`https://openlibrary.org/search.json?title=${queryTitle}&author=${queryAuthor}&limit=1`);
                const olData = await olRes.json();
                if (isMounted && olData.docs?.length > 0 && olData.docs[0].cover_i) {
                    setCoverUrl(`https://covers.openlibrary.org/b/id/${olData.docs[0].cover_i}-L.jpg`);
                }
            } catch (err) { console.warn("OpenLibrary API failed", err); }
        };

        findCover();
        return () => { isMounted = false; };
    }, [book.title, book.author]);

    const handleSave = () => {
        if (onUpdateBook && editTitle.trim()) {
            onUpdateBook(book.title, editTitle, editAuthor);
            setIsEditing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Libro */}
            <div className="bg-white sticky top-0 z-40 border-b border-slate-100/80 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden group/header">
                <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
                    {/* Navegación y Acciones Sup. */}
                    <div className="flex items-center justify-between mb-8 md:mb-10">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-xs uppercase tracking-wider group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Volver a la biblioteca
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Botón Añadir Cita */}
                            {onAddHighlight && (
                                <button
                                    onClick={onAddHighlight}
                                    className="px-5 py-2.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                    title="Agregar nueva frase"
                                >
                                    <Plus size={18} strokeWidth={2.5} />
                                    <span className="text-xs font-black tracking-wide hidden sm:inline">Nueva Frase</span>
                                </button>
                            )}

                            {/* Botones de Edición (Guardar/Cancelar) */}
                            {isEditing && (
                                <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                                    <button onClick={handleSave} className="p-2.5 text-green-500 hover:bg-green-50 rounded-full transition-colors shadow-sm bg-white border border-slate-100">
                                        <Check size={18} strokeWidth={2.5} />
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm bg-white border border-slate-100">
                                        <X size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
                        {/* Portada del Libro */}
                        <div className="w-32 md:w-44 aspect-[2/3] shrink-0 rounded-2xl shadow-2xl border-4 border-white overflow-hidden bg-slate-100 flex items-center justify-center transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            {coverUrl ? (
                                <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <Book size={48} className="text-slate-300" strokeWidth={1.5} />
                            )}
                        </div>

                        {/* Info y Edición */}
                        <div className="flex-1 min-w-0 pt-2">
                            {isEditing ? (
                                <div className="space-y-4 mb-4">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full text-3xl md:text-5xl font-serif font-black text-[#140d1c] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="Título del libro"
                                        autoFocus
                                    />
                                    <input
                                        type="text"
                                        value={editAuthor}
                                        onChange={(e) => setEditAuthor(e.target.value)}
                                        className="w-full text-lg md:text-2xl font-medium text-primary bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        placeholder="Autor"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start gap-4 mb-2 group/title relative">
                                        <h1 className="text-4xl md:text-[3.5rem] leading-[1.1] font-serif font-black text-[#140d1c] tracking-tight">
                                            {book.title}
                                        </h1>
                                        <button
                                            onClick={() => {
                                                setEditTitle(book.title);
                                                setEditAuthor(book.author);
                                                setIsEditing(true);
                                            }}
                                            className="mt-3 p-2 text-slate-300 hover:text-primary hover:bg-purple-50 rounded-full transition-all opacity-0 group-hover/title:opacity-100"
                                            title="Editar título y autor"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-xl font-medium text-primary mb-6">{book.author}</p>
                                    <div className="h-1.5 w-24 bg-purple-100 rounded-full"></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lista de Citas */}
                <div className="px-6 md:px-14 pb-14 space-y-12">
                    {book.clippings.map((clip: Clipping, index: number) => (
                        <div key={clip.id} className="group relative pl-4 md:pl-0">
                            {/* Barra lateral decorativa en hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-200 rounded-full group-hover:bg-primary transition-colors duration-300 md:-ml-6"></div>

                            <div className="py-2">
                                <p className="text-xl md:text-2xl text-slate-700 font-serif leading-relaxed italic mb-6">
                                    "{clip.content}"
                                </p>

                                <div className="flex flex-wrap items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(clip.content); alert('Copiado!') }}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors"
                                    >
                                        <Copy size={14} /> Copiar Texto
                                    </button>
                                    <button
                                        onClick={() => onShare(clip)}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors"
                                    >
                                        <Share2 size={14} /> Crear Story
                                    </button>
                                </div>
                            </div>

                            {/* Separador sutil entre citas */}
                            {index < book.clippings.length - 1 && (
                                <div className="mt-12 h-px bg-slate-50 w-full mx-auto"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer de la tarjeta */}
                <div className="bg-slate-50 px-6 md:px-14 py-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <Quote size={14} className="text-primary fill-primary/10" />
                            <span>{book.clippings.length} Highlights</span>
                        </div>
                        <div className="items-center gap-2 text-slate-500 text-xs font-medium hidden sm:flex">
                            <Calendar size={14} className="text-primary" />
                            <span>Actualizado hace 2 días</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {/* Botones footer */}
                        <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors hover:-translate-y-0.5 transform">
                            Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
