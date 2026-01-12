import { useEffect } from 'react';
import { useCoverStore } from '@/store/useCoverStore';

export function useBookCover(title: string, author: string, delay?: number) {
    const key = `${title}|${author}`;

    // Suscribirse al estado específico de este libro
    const coverUrl = useCoverStore((state) => state.covers[key]);
    const setCover = useCoverStore((state) => state.setCover);

    useEffect(() => {
        // Si ya tenemos valor (url string o null explícito de "no encontrado"), no hacemos nada
        if (coverUrl !== undefined) return;

        let isMounted = true;

        const fetchCover = async () => {
            // 1. Limpieza de strings (Igual que antes)
            const cleanTitle = title
                .split('(')[0]
                .split(':')[0]
                .split(';')[0]
                .trim();

            const cleanAuthor = author
                .replace(/[\(\)]/g, '') // Elimina paréntesis
                .split(',')[0] // Toma primer autor
                .trim();

            const queryTitle = encodeURIComponent(cleanTitle);
            const queryAuthor = encodeURIComponent(cleanAuthor);

            let successfulUrl: string | null = null;

            // Estrategia 1: Google Books API
            if (!successfulUrl) {
                try {
                    const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${queryTitle}+inauthor:${queryAuthor}&maxResults=1&langRestrict=es`);
                    const googleData = await googleRes.json();
                    if (googleData.items?.length > 0) {
                        const volumeInfo = googleData.items[0].volumeInfo;
                        if (volumeInfo.imageLinks?.thumbnail) {
                            successfulUrl = volumeInfo.imageLinks.thumbnail.replace('http:', 'https:').replace('&edge=curl', '');
                        }
                    }
                } catch (err) {
                    console.warn("Google Books API failed", err);
                }
            }

            // Estrategia 2: OpenLibrary
            if (!successfulUrl) {
                try {
                    const olRes = await fetch(`https://openlibrary.org/search.json?title=${queryTitle}&author=${queryAuthor}&language=spa&limit=1&fields=cover_i`);
                    const olData = await olRes.json();
                    if (olData.docs?.length > 0 && olData.docs[0].cover_i) {
                        successfulUrl = `https://covers.openlibrary.org/b/id/${olData.docs[0].cover_i}-L.jpg`;
                    }
                } catch (err) {
                    console.warn("OpenLibrary API failed", err);
                }
            }

            if (isMounted) {
                // Guardar en Store (persistente y global)
                setCover(title, author, successfulUrl);
            }
        };

        // Si delay es explícito (ej: 0), usarlo. Si es undefined, usar random para listas.
        const waitTime = delay !== undefined ? delay : (Math.random() * 800 + 200);

        const timeoutId = setTimeout(fetchCover, waitTime);

        return () => { isMounted = false; clearTimeout(timeoutId); };

    }, [title, author, coverUrl, delay, setCover]);

    return coverUrl || null;
}
