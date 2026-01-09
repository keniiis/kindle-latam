'use client';

import { UploadCloud } from 'lucide-react';
import BookCard from '@/components/BookCard';

interface LibraryViewProps {
    library: any[];
    onSelectBook: (book: any) => void;
    onImport: () => void;
}

export default function LibraryView({ library, onSelectBook, onImport }: LibraryViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HEADER SECCIÓN BIBLIOTECA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#140d1c] tracking-tight mb-3">Tu Biblioteca</h1>
                    <div className="flex items-center gap-3">
                        <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-sm">{library.length}</span>
                        <p className="text-gray-400 font-medium">libros importados desde Kindle</p>
                    </div>
                </div>
                <button
                    onClick={onImport}
                    className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary/30 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                    <UploadCloud size={20} className="group-hover:animate-bounce" />
                    <span>Importar nuevo archivo</span>
                </button>
            </div>

            {/* GRID DE LIBROS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                {library.map((book) => (
                    <BookCard key={book.title} book={book} onClick={() => onSelectBook(book)} />
                ))}
            </div>
        </div>
    );
}
