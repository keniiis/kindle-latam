export interface Clipping {
    id: string;
    title: string;
    author: string;
    content: string;
    meta: string;
    type: 'Highlight' | 'Note' | 'Bookmark';
    date: Date;
    genre?: string;
    sourceKey?: string;
}

function parseDate(meta: string): Date {
    const value = meta.match(/(?:Added on|Añadido el|Agregado el)\s+(.+)$/i)?.[1];
    if (!value) return new Date(0);
    const spanish = value.toLowerCase().match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (spanish) {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const month = months.indexOf(spanish[2].replace('setiembre', 'septiembre'));
        const day = Number(spanish[1]);
        let hour = Number(spanish[4] || 0);
        const meridiem = value.match(/\b([ap])\.?\s*m\.?/i)?.[1]?.toLowerCase();
        if (meridiem && hour >= 1 && hour <= 12) hour = hour % 12 + (meridiem === 'p' ? 12 : 0);
        const date = new Date(Number(spanish[3]), month, day, hour, Number(spanish[5] || 0), Number(spanish[6] || 0));
        return month >= 0 && date.getMonth() === month && date.getDate() === day && hour < 24 && Number(spanish[5] || 0) < 60 && Number(spanish[6] || 0) < 60 ? date : new Date(0);
    }
    const timestamp = Date.parse(value);
    return new Date(Number.isNaN(timestamp) ? 0 : timestamp);
}

export function parseKindleClippings(raw: string): Clipping[] {
    return raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split(/^={10}\s*$/m).flatMap(section => {
        const lines = section.trim().split('\n');
        if (lines.length < 2) return [];
        const titleLine = lines[0].trim();
        const meta = lines[1].trim();
        if (!titleLine || !/^\s*-/.test(meta)) return [];
        let type: Clipping['type'];
        if (/\b(note|nota)\b/i.test(meta)) type = 'Note';
        else if (/\b(bookmark|marcador)\b/i.test(meta)) type = 'Bookmark';
        else if (/\b(highlight|subrayado|destacado)\b/i.test(meta)) type = 'Highlight';
        else return [];
        const content = lines.slice(2).join('\n').trim();
        if (!content && type !== 'Bookmark') return [];
        const clip: Clipping = {
            id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            title: titleLine.replace(/\s*\(([^)]+)\)$/, '').trim(),
            author: titleLine.match(/\(([^)]+)\)$/)?.[1] || 'Unknown Author',
            content, meta, type, date: parseDate(meta),
        };
        // Original identity survives edits to the quote and book.
        clip.sourceKey = JSON.stringify([clip.title, clip.author, meta]);
        return [clip];
    });
}
