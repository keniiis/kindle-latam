import { jsPDF } from 'jspdf';
import type { Clipping } from './parser';

type ExportBook = { title: string; author: string; clippings: Clipping[] };

// Text is paginated line by line, including individual quotes longer than a page.
// This builder has no browser dependency so the actual PDF can be regression-tested.
export function buildBookPDF(book: ExportBook, coverData?: string): jsPDF {
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });
    const left = 22;
    const right = 188;
    const bottom = 274;
    let y = 38;
    const heading = () => {
        doc.setFillColor('#8b5cf6');
        doc.rect(0, 0, 210, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor('#8b5cf6');
        doc.text('CitandoAndo', left, 18);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor('#64748b');
        doc.text('CUADERNO DE LECTURA', right, 18, { align: 'right' });
    };
    const page = () => { doc.addPage(); heading(); y = 34; };
    const write = (text: string, size: number, font: 'helvetica' | 'times', style: 'normal' | 'bold' | 'italic', color: string, lineHeight: number) => {
        doc.setFont(font, style);
        doc.setFontSize(size);
        const lines: string[] = doc.splitTextToSize(text, right - left);
        for (const line of lines) {
            if (y > bottom) page();
            doc.setFont(font, style);
            doc.setFontSize(size);
            doc.setTextColor(color);
            doc.text(line, left, y);
            y += lineHeight;
        }
    };
    heading();
    write(book.title, 24, 'times', 'bold', '#1e293b', 10);
    y += 3;
    write(book.author, 12, 'helvetica', 'normal', '#64748b', 6);
    y += 7;
    if (coverData) {
        if (y + 54 > bottom) page();
        const properties = doc.getImageProperties(coverData);
        const ratio = Math.min(36 / properties.width, 54 / properties.height);
        doc.addImage(coverData, 'JPEG', left, y, properties.width * ratio, properties.height * ratio);
        y += properties.height * ratio + 12;
    }
    write(`${book.clippings.length} anotaciones`, 10, 'helvetica', 'bold', '#8b5cf6', 6);
    y += 10;
    const labels = { Highlight: 'Subrayado', Note: 'Nota', Bookmark: 'Marcador' };
    book.clippings.forEach((clip, index) => {
        // Keep each label with at least the first line of its text.
        if (y + 18 > bottom) page();
        write(`${index + 1}. ${labels[clip.type]}`, 9, 'helvetica', 'bold', '#8b5cf6', 6);
        write(clip.content || '(Marcador sin texto)', 12, 'times', 'normal', '#1e293b', 6);
        y += 4;
        if (y < bottom) {
            doc.setDrawColor('#ddd6fe');
            doc.line(left, y, left + 24, y);
        }
        y += 10;
    });
    const total = doc.getNumberOfPages();
    for (let index = 1; index <= total; index++) {
        doc.setPage(index);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor('#64748b');
        doc.text(`Página ${index} de ${total}`, right, 287, { align: 'right' });
    }
    return doc;
}

function loadCover(url: string): Promise<string | undefined> {
    return new Promise(resolve => {
        const img = new Image();
        const finish = (value?: string) => {
            clearTimeout(timer);
            img.onload = null;
            img.onerror = null;
            resolve(value);
        };
        const timer = setTimeout(() => finish(), 5000);
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const context = canvas.getContext('2d');
                if (!context) return finish();
                context.drawImage(img, 0, 0);
                finish(canvas.toDataURL('image/jpeg'));
            } catch { finish(); }
        };
        img.onerror = () => finish();
        img.src = url;
    });
}

export async function generateBookPDF(book: ExportBook, coverUrl?: string | null) {
    const cover = coverUrl ? await loadCover(coverUrl) : undefined;
    const doc = buildBookPDF(book, cover);
    const filename = `${book.title}_${book.author}`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${filename}_highlights.pdf`);
}
