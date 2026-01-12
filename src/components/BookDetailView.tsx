'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Copy, Share2, Quote, Calendar, Edit2, Check, X, Plus, Book, Loader2, Tag } from 'lucide-react';
import { Clipping } from '@/lib/parser';
import { PdfExportTemplate } from './PdfExportTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface BookDetailViewProps {
    book: any;
    onBack: () => void;
    onShare: (clip: Clipping) => void;
    onUpdateBook?: (oldTitle: string, newTitle: string, newAuthor: string) => void;
    onAddHighlight?: () => void;
    onUpdateClip?: (clipId: string, newContent: string) => void;
    initialCoverUrl?: string;
    onUpdateCover?: (url: string) => void;
}

import { useBookCover } from '@/hooks/useBookCover';

export default function BookDetailView({ book, onBack, onShare, onUpdateBook, onAddHighlight, onUpdateClip, initialCoverUrl, onUpdateCover }: BookDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(book.title);
    const [editAuthor, setEditAuthor] = useState(book.author);

    // State for individual clip editing
    const [editingClipId, setEditingClipId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');

    const fetchedCoverUrl = useBookCover(book.title, book.author, 0); // 0 delay for instant fetch
    const coverUrl = initialCoverUrl || fetchedCoverUrl;

    useEffect(() => {
        if (fetchedCoverUrl && typeof onUpdateCover === 'function') {
            onUpdateCover(fetchedCoverUrl);
        }
    }, [fetchedCoverUrl, onUpdateCover]);

    const [isExporting, setIsExporting] = useState(false);
    const pdfTemplateRef = useRef<HTMLDivElement>(null);

    const handleExportPdf = async () => {
        if (!pdfTemplateRef.current) return;
        setIsExporting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const canvas = await html2canvas(pdfTemplateRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 0,
                windowWidth: 1200,
                windowHeight: 1600
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'letter'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            const fileName = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_highlights.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("Error exporting PDF:", error);
            alert("Hubo un error al generar el PDF. Intenta nuevamente.");
        } finally {
            setIsExporting(false);
        }
    };

    const lastUpdateLabel = useMemo(() => {
        const dates = book.clippings
            .map((c: any) => c.date ? new Date(c.date).getTime() : 0)
            .filter((t: number) => t > 0);

        if (dates.length === 0) return 'Recién importado';

        const latestTimestamp = Math.max(...dates);
        // const latestDate = new Date(latestTimestamp);

        const diff = Date.now() - latestTimestamp;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        let relativeText = '';
        if (days === 0) relativeText = 'hoy';
        else if (days === 1) relativeText = 'ayer';
        else if (days < 30) relativeText = `hace ${days} días`;
        else if (days < 365) relativeText = `hace ${Math.floor(days / 30)} meses`;
        else relativeText = 'hace más de un año';

        return `Actualizado ${relativeText}`;
    }, [book.clippings]);

    const handleSave = () => {
        if (onUpdateBook && editTitle.trim()) {
            onUpdateBook(book.title, editTitle, editAuthor);
            setIsEditing(false);
        }
    };

    const startEditingClip = (clip: Clipping) => {
        setEditingClipId(clip.id);
        setEditingContent(clip.content);
    };

    const saveClip = (clipId: string) => {
        if (onUpdateClip && editingContent.trim()) {
            onUpdateClip(clipId, editingContent.trim());
            setEditingClipId(null);
            setEditingContent('');
        }
    };

    const cancelEditingClip = () => {
        setEditingClipId(null);
        setEditingContent('');
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Template Oculto para PDF (Fuera de la vista pero renderizado) */}
            <div style={{ position: 'absolute', top: -10000, left: -10000, pointerEvents: 'none' }}>
                <div ref={pdfTemplateRef}>
                    <PdfExportTemplate book={book} coverUrl={coverUrl} />
                </div>
            </div>

            {/* Botón Volver - Fuera del contenedor */}
            <div className="max-w-5xl mx-auto px-6 pt-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-primary hover:text-purple-700 transition-colors font-bold text-xs uppercase tracking-wider group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a la biblioteca
                </button>
            </div>

            {/* Header Libro */}
            <div className="bg-white sticky top-0 z-40 border-b border-slate-100/80 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden group/header">
                <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
                    {/* Navegación y Acciones Sup. */}
                    <div className="flex items-center justify-end mb-8 md:mb-10">
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
                        <div
                            className="w-32 md:w-44 aspect-[2/3] shrink-0 rounded-[2rem] shadow-2xl border-4 border-white overflow-hidden bg-slate-100 flex items-center justify-center transform rotate-1 hover:rotate-0 transition-transform duration-500"
                            style={{
                                backgroundImage: coverUrl ? `url(${coverUrl})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                viewTransitionName: `book-cover-${book.title.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`
                            } as any}
                        >
                            {coverUrl ? (
                                <img
                                    src={coverUrl}
                                    alt={book.title}
                                    loading="eager"
                                    decoding="sync"
                                    className="w-full h-full object-cover rounded-[2rem] opacity-0 animate-in fade-in duration-300"
                                />
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
                                    <p className="text-xl font-medium text-primary mb-4">{book.author}</p>

                                    {book.genre && (
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 bg-slate-100/80 w-fit px-3 py-1.5 rounded-full border border-slate-200/50">
                                            <Tag size={12} className="text-purple-500" />
                                            <span>{book.genre}</span>
                                        </div>
                                    )}

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
                                {editingClipId === clip.id ? (
                                    <div className="animate-in fade-in duration-200">
                                        <textarea
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            className="w-full p-4 border border-purple-200 rounded-xl text-xl md:text-2xl text-slate-700 font-serif leading-relaxed italic focus:outline-none focus:ring-2 focus:ring-purple-500/20 min-h-[150px] resize-y"
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-2 mt-3 justify-end">
                                            <button
                                                onClick={cancelEditingClip}
                                                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => saveClip(clip.id)}
                                                disabled={!editingContent.trim()}
                                                className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-purple-700 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <Check size={16} /> Guardar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xl md:text-2xl text-slate-700 font-serif leading-relaxed italic mb-6 cursor-text">
                                            "{clip.content}"
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(clip.content); alert('Copiado!') }}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors flex-1 md:flex-none justify-center"
                                            >
                                                <Copy size={14} /> Copiar
                                            </button>

                                            {onUpdateClip && (
                                                <button
                                                    onClick={() => startEditingClip(clip)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors flex-1 md:flex-none justify-center"
                                                >
                                                    <Edit2 size={14} /> Editar
                                                </button>
                                            )}

                                            <button
                                                onClick={() => onShare(clip)}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-purple-100 transition-colors flex-1 md:flex-none justify-center"
                                            >
                                                <Share2 size={14} /> Story
                                            </button>
                                        </div>
                                    </>
                                )}
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
                            <Calendar size={14} className="text-purple-600" />
                            <span>{lastUpdateLabel}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {/* Botones footer */}
                        <button
                            onClick={handleExportPdf}
                            disabled={isExporting}
                            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors hover:-translate-y-0.5 transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isExporting && <Loader2 size={14} className="animate-spin" />}
                            {isExporting ? 'Generando...' : 'Exportar PDF'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
