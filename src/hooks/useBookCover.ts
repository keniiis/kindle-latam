import { useState, useEffect } from 'react';

// Cache global en memoria para persistir durante la sesión
// Clave: "Title|Author" -> Valor: URL string | null (si falló)
const coverCache = new Map<string, string | null>();

export function useBookCover(title: string, author: string) {
    const [coverUrl, setCoverUrl] = useState<string | null>(() => {
        const key = `${title}|${author}`;

        // 1. Memoria primero (más rápido)
        if (coverCache.has(key)) {
            return coverCache.get(key) || null;
        }

        // 2. Intentar leer de LocalStorage (si estamos en cliente)
        if (typeof window !== 'undefined') {
            try {
                const lsKey = `cover_cache_${key}`;
                const cached = localStorage.getItem(lsKey);
                if (cached) {
                    coverCache.set(key, cached); // Sincronizar memoria
                    return cached;
                }
            } catch (e) {
                console.warn('Error reading from localStorage', e);
            }
        }

        return null; // Aún no lo tenemos
    });

    useEffect(() => {
        const key = `${title}|${author}`;

        // Si ya tenemos URL (sea de memoria o LS, ya seteado en estado inicial), no hacemos fetch
        if (coverUrl) return;

        // Comprobación doble por si se actualizó el caché global mientras montaba componentes paralelos
        if (coverCache.has(key)) {
            const cachedVal = coverCache.get(key) || null;
            if (cachedVal) {
                setCoverUrl(cachedVal);
                return;
            }
        }

        let isMounted = true;

        const fetchCover = async () => {
            // 1. Limpieza de strings (Mejorada para coincidir mejor)
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
                // Guardar en memoria
                coverCache.set(key, successfulUrl);

                // Guardar en LocalStorage si encontramos algo
                if (successfulUrl) {
                    try {
                        const lsKey = `cover_cache_${key}`;
                        localStorage.setItem(lsKey, successfulUrl);
                    } catch (e) {
                        // Ignorar, maybe quota exceeded
                    }
                }

                setCoverUrl(successfulUrl);
            }
        };

        const timeoutId = setTimeout(fetchCover, Math.random() * 800 + 200); // Random delay

        return () => { isMounted = false; clearTimeout(timeoutId); };

    }, [title, author, coverUrl]); // Dependencia coverUrl para no volver a ejecutar si ya lo tenemos

    return coverUrl;
}
