'use client';

import { useState, useEffect } from 'react';
import { Book } from 'lucide-react';

interface BookCardProps {
    book: any;
    onClick: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
    const [coverUrl, setCoverUrl] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const findCover = async () => {
            // 1. Limpieza de strings
            const cleanTitle = book.title
                .split('(')[0] // Elimina (Edición española)
                .split(':')[0] // Elimina subtítulos largos
                .split(';')[0]
                .trim();

            const cleanAuthor = book.author
                .replace(/[\(\)]/g, '') // Elimina paréntesis en autores
                .split(',')[0] // A veces vienen varios autores, tomamos el primero
                .trim();

            const queryTitle = encodeURIComponent(cleanTitle);
            const queryAuthor = encodeURIComponent(cleanAuthor);

            // Estrategia 1: Google Books API (Suele ser más visual y rápida para portadas comerciales)
            try {
                const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${queryTitle}+inauthor:${queryAuthor}&maxResults=1`);
                const googleData = await googleRes.json();

                if (isMounted && googleData.items?.length > 0) {
                    const volumeInfo = googleData.items[0].volumeInfo;
                    if (volumeInfo.imageLinks?.thumbnail) {
                        // Reemplazamos http por https para evitar warnings de mixed content
                        setCoverUrl(volumeInfo.imageLinks.thumbnail.replace('http:', 'https:'));
                        return; // Éxito con Google Books
                    }
                }
            } catch (err) {
                console.warn("Google Books API failed", err);
            }

            // Estrategia 2: OpenLibrary (Fallback si Google falla)
            try {
                const olRes = await fetch(`https://openlibrary.org/search.json?title=${queryTitle}&author=${queryAuthor}&language=spa&limit=1&fields=cover_i`);
                const olData = await olRes.json();
                if (isMounted && olData.docs?.length > 0 && olData.docs[0].cover_i) {
                    setCoverUrl(`https://covers.openlibrary.org/b/id/${olData.docs[0].cover_i}-L.jpg`);
                    return;
                }
            } catch (err) {
                console.warn("OpenLibrary API failed", err);
            }
        };

        findCover();
        return () => { isMounted = false; };
    }, [book.title, book.author]);

    return (
        <div onClick={onClick} className="group cursor-pointer flex flex-col gap-3">
            {/* TARJETA VISUAL (Portada) */}
            <div className="relative aspect-[3/4] w-full rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-white border border-slate-100 group-hover:border-primary/20">
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
                <h3 className="font-bold text-[#140d1c] text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {book.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">{book.author}</p>
            </div>
        </div>
    );
};

export default BookCard;
