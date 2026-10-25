import type { Clipping } from './parser';

export const LIBRARY_STORAGE_KEY = 'kindle-latam-library';

export interface LibraryBook {
    id: string;
    title: string;
    author: string;
    clippings: Clipping[];
    genre?: string;
}

export function bookKey(book: { title: string; author: string }): string {
    return JSON.stringify([book.title.trim(), book.author.trim()]);
}

export function bookTransitionName(book: { title: string; author: string }): string {
    return 'book-' + Array.from(bookKey(book), c => c.codePointAt(0)!.toString(16)).join('-');
}

export function groupBooks(clippings: Clipping[]): LibraryBook[] {
    const books = new Map<string, LibraryBook>();
    for (const clip of clippings) {
        const id = bookKey(clip);
        if (!books.has(id)) books.set(id, { id, title: clip.title.trim(), author: clip.author.trim(), clippings: [], genre: clip.genre });
        books.get(id)!.clippings.push(clip);
    }
    return [...books.values()].sort((a, b) => b.clippings.length - a.clippings.length);
}

export function renameBook(clippings: Clipping[], id: string, title: string, author: string): Clipping[] {
    const target = { title: title.trim(), author: author.trim() };
    if (!target.title) throw new Error('El título no puede estar vacío.');
    const targetId = bookKey(target);
    if (targetId !== id && clippings.some(c => bookKey(c) === targetId)) {
        throw new Error('Ya existe un libro con ese título y autor. Elige otro nombre para no mezclar sus citas.');
    }
    return clippings.map(c => bookKey(c) === id ? { ...c, ...target } : c);
}

export function removeBooks(clippings: Clipping[], ids: Set<string>): Clipping[] {
    return clippings.filter(c => !ids.has(bookKey(c)));
}

function sourceKey(clip: Clipping): string | undefined {
    return clip.sourceKey ?? (/^\s*-/.test(clip.meta)
        ? JSON.stringify([clip.title.trim(), clip.author.trim(), clip.meta.trim()])
        : undefined);
}

export function mergeClippings(existing: Clipping[], incoming: Clipping[]): Clipping[] {
    const result = [...existing];
    const ids = new Set(existing.map(c => c.id));
    const sources = new Set(existing.map(sourceKey).filter(Boolean));
    for (const clip of incoming) {
        const key = sourceKey(clip);
        if (ids.has(clip.id) || (key && sources.has(key))) continue;
        result.push(clip);
        ids.add(clip.id);
        if (key) sources.add(key);
    }
    return result;
}

export function validateClippings(value: unknown): Clipping[] {
    if (!Array.isArray(value)) throw new Error('La biblioteca no es una lista válida.');
    const ids = new Set<string>();
    return value.map((item: unknown) => {
        if (!item || typeof item !== 'object') throw new Error('Hay una cita inválida.');
        const c = item as Record<string, unknown>;
        if (['id', 'title', 'author', 'content', 'meta'].some(k => typeof c[k] !== 'string') ||
            !String(c.id).trim() || !String(c.title).trim() || ids.has(String(c.id)) ||
            !['Highlight', 'Note', 'Bookmark'].includes(String(c.type)) ||
            (c.genre !== undefined && typeof c.genre !== 'string') ||
            (c.sourceKey !== undefined && typeof c.sourceKey !== 'string') ||
            (typeof c.date !== 'string' && !(c.date instanceof Date))) {
            throw new Error('El archivo contiene citas inválidas o identificadores repetidos.');
        }
        const date = new Date(c.date as string | Date);
        if (!Number.isFinite(date.getTime())) throw new Error('El archivo contiene una fecha inválida.');
        ids.add(c.id as string);
        const clip: Clipping = { id: c.id as string, title: c.title as string, author: c.author as string,
            content: c.content as string, meta: c.meta as string, type: c.type as Clipping['type'], date,
            ...(c.genre !== undefined ? { genre: c.genre as string } : {}),
            ...(c.sourceKey !== undefined ? { sourceKey: c.sourceKey as string } : {}) };
        const identity = sourceKey(clip);
        if (identity) clip.sourceKey = identity;
        return clip;
    });
}

export function createBackup(clippings: Clipping[]): string {
    return JSON.stringify({ app: 'CitandoAndo', version: 1, exportedAt: new Date().toISOString(), clippings: validateClippings(clippings) }, null, 2);
}

export function readBackup(text: string): Clipping[] {
    const value = JSON.parse(text);
    if (!value || value.app !== 'CitandoAndo' || value.version !== 1) throw new Error('Este archivo no es un respaldo compatible de CitandoAndo.');
    return validateClippings(value.clippings);
}

export function saveLibrary(storage: Pick<Storage, 'setItem'>, clippings: Clipping[]) {
    // Persist [] too: removing the last quote must survive a reload.
    storage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(clippings));
}
