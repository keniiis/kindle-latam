'use client';

import { useState } from 'react';
import { ChevronLeft, Copy, Share2, Quote, Calendar, Edit2, Check, X } from 'lucide-react';
import { Clipping } from '@/lib/parser';

interface BookDetailViewProps {
    book: any;
    onBack: () => void;
    onShare: (clip: Clipping) => void;
    onUpdateBook?: (oldTitle: string, newTitle: string, newAuthor: string) => void;
}

export default function BookDetailView({ book, onBack, onShare, onUpdateBook }: BookDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(book.title);
    const [editAuthor, setEditAuthor] = useState(book.author);

    const handleSave = () => {
        if (onUpdateBook && editTitle.trim()) {
            onUpdateBook(book.title, editTitle, editAuthor);
            setIsEditing(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300 max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-medium text-sm group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Volver a la biblioteca
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                {/* Cabecera del Libro */}
                <div className="p-10 md:p-14 pb-8 group/header relative">
                    <div className="absolute top-10 right-10 flex gap-2 opacity-0 group-hover/header:opacity-100 transition-opacity">
                        {!isEditing ? (
                            <button
                                onClick={() => {
                                    setEditTitle(book.title);
                                    setEditAuthor(book.author);
                                    setIsEditing(true);
                                }}
                                className="p-2 text-slate-400 hover:text-primary hover:bg-purple-50 rounded-full transition-colors"
                                title="Editar título y autor"
                            >
                                <Edit2 size={20} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-2 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                                    title="Guardar"
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Cancelar"
                                >
                                    <X size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4 mb-4 pr-12">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full text-4xl md:text-5xl font-serif font-black text-[#140d1c] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="Título del libro"
                            />
                            <input
                                type="text"
                                value={editAuthor}
                                onChange={(e) => setEditAuthor(e.target.value)}
                                className="w-full text-lg md:text-xl font-medium text-primary bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="Autor"
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#140d1c] mb-3 leading-tight tracking-tight pr-12">
                                {book.title}
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-primary mb-8">{book.author}</p>
                        </>
                    )}
                    <div className="h-1 w-20 bg-purple-100 rounded-full"></div>
                </div>

                {/* Lista de Citas */}
                <div className="px-10 md:px-14 pb-14 space-y-12">
                    {book.clippings.map((clip: Clipping, index: number) => (
                        <div key={clip.id} className="group relative">
                            {/* Barra lateral decorativa en hover */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-200 rounded-full group-hover:bg-primary transition-colors duration-300"></div>

                            <div className="pl-8 py-2">
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
                <div className="bg-slate-50 px-10 md:px-14 py-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <Quote size={14} className="text-primary fill-primary/10" />
                            <span>{book.clippings.length} Highlights</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <Calendar size={14} className="text-primary" />
                            <span>Actualizado hace 2 días</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                            Ver todos
                        </button>
                        <button className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors hover:-translate-y-0.5 transform">
                            Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
