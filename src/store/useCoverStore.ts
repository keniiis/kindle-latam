import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CoverState {
    covers: Record<string, string | null>; // "Title|Author" -> URL
    setCover: (title: string, author: string, url: string | null) => void;
    getCover: (title: string, author: string) => string | null | undefined;
}

export const useCoverStore = create<CoverState>()(
    persist(
        (set, get) => ({
            covers: {},
            setCover: (title, author, url) => {
                const key = `${title}|${author}`;
                set((state) => ({
                    covers: { ...state.covers, [key]: url }
                }));
            },
            getCover: (title, author) => {
                const key = `${title}|${author}`;
                return get().covers[key];
            }
        }),
        {
            name: 'kindle-latam-covers', // unique name
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
