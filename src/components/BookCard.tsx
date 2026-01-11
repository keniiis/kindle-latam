'use client';

import { Book, Check } from 'lucide-react';
import { useBookCover } from '@/hooks/useBookCover';

interface BookCardProps {
    book: any;
    onClick: () => void;
    selected?: boolean;
    onToggleSelection?: () => void;
    selectionMode?: boolean;
}

const BookCard = ({ book, onClick, selected, onToggleSelection, selectionMode }: BookCardProps) => {
    const coverUrl = useBookCover(book.title, book.author);

    return (
        <div onClick={onClick} className={`group cursor-pointer flex flex-col gap-3 relative`}>
            {/* TARJETA VISUAL (Portada) */}
            <div className={`relative aspect-[3/4] w-full rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-white border ${selected ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-2' : 'border-slate-100 group-hover:border-primary/20'}`}>

                {/* Check de Selección */}
                {onToggleSelection && (
                    <div
                        onClick={(e) => { e.stopPropagation(); onToggleSelection(); }}
                        className={`absolute top-4 left-4 z-30 size-8 rounded-full flex items-center justify-center transition-all duration-200 ${selected
                                ? 'bg-purple-500 text-white scale-100'
                                : selectionMode
                                    ? 'bg-white/80 backdrop-blur text-transparent border-2 border-slate-200 scale-100 hover:border-purple-500' // Siempre visible en modo selección
                                    : 'bg-white/80 backdrop-blur text-transparent border-2 border-slate-200 scale-0 group-hover:scale-100 hover:border-purple-500'
                            }`}
                    >
                        <Check size={16} strokeWidth={3} />
                    </div>
                )}

                {/* Badge Contador */}
                <div className="absolute top-4 right-4 z-20 size-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    {book.clippings.length}
                </div>

                {coverUrl ? (
                    <>
                        <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        <span className="absolute bottom-4 left-4 right-4 text-white font-bold text-sm line-clamp-2 leading-tight">
                            {book.title}
                        </span>
                    </>
                ) : (
                    <div className="w-full h-full bg-[#f8f9fc] flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 text-primary/20">
                            <Book size={48} strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest line-clamp-3">
                            {book.title}
                        </span>
                    </div>
                )}
            </div>

            {/* INFO LIBRO (Debajo) */}
            <div>
                <h3 className={`font-bold text-sm leading-tight mb-1 transition-colors line-clamp-1 ${selected ? 'text-purple-600' : 'text-[#140d1c] group-hover:text-primary'}`}>
                    {book.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">{book.author}</p>
            </div>
        </div>
    );
};

export default BookCard;
