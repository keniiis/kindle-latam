import { jsPDF } from 'jspdf';
import { Clipping } from './parser';

const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg'));
            } else {
                reject(new Error('Canvas context failed'));
            }
        };
        img.onerror = (e) => reject(e);
    });
};

export const generateBookPDF = async (book: { title: string; author: string; clippings: Clipping[] }, coverUrl?: string | null) => {
    const doc = new jsPDF({
        format: 'a4',
        unit: 'mm'
    });

    const pWidth = doc.internal.pageSize.getWidth();
    const pHeight = doc.internal.pageSize.getHeight();

    // Layout Config
    const sidebarWidth = pWidth * 0.33;
    const contentWidth = pWidth - sidebarWidth;
    const margin = 15;

    // Colors
    const COL_SIDEBAR = '#F8F9FA'; // Slate-50 approx
    const COL_PRIMARY = '#8b5cf6'; // Violeta Brand
    const COL_TEXT_MAIN = '#1e293b'; // Slate-800
    const COL_TEXT_SEC = '#64748b'; // Slate-500
    const COL_QUOTE_MARK = '#e9d5ff'; // Purple-200 (light for quote mark)

    // Helper: Draw Sidebar (background + content)
    const drawSidebar = async (pageNumber: number, totalPages: number) => {
        // Bg
        doc.setFillColor(COL_SIDEBAR);
        doc.rect(0, 0, sidebarWidth, pHeight, 'F');

        // --- Sidebar Content ---
        let y = margin + 10;

        // 1. Cover (First Page Only)
        if (pageNumber === 1 && coverUrl) {
            try {
                const imgData = await loadImage(coverUrl);
                const imgW = sidebarWidth - (margin * 2);
                const imgH = imgW * 1.5; // Assume 2:3 ratio

                doc.addImage(imgData, 'JPEG', margin, y, imgW, imgH);
                y += imgH + 15;
            } catch (err) {
                console.warn('Could not load cover for PDF', err);
                doc.setDrawColor(200);
                doc.rect(margin, y, sidebarWidth - (margin * 2), (sidebarWidth - (margin * 2)) * 1.5);
                y += (sidebarWidth - (margin * 2)) * 1.5 + 15;
            }
        } else if (pageNumber > 1) {
            y = margin;
        }

        // 2. Title
        doc.setFont('times', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(COL_TEXT_MAIN);
        const titleLines = doc.splitTextToSize(book.title, sidebarWidth - (margin * 2));
        doc.text(titleLines, margin, y);
        y += (titleLines.length * 8) + 5;

        // 3. Author
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(COL_PRIMARY);
        doc.text(book.author.toUpperCase(), margin, y);
        y += 15;

        // 4. Metadata
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(COL_TEXT_SEC);

        // Icons simulation
        // Bookmarks
        doc.setDrawColor(COL_TEXT_SEC);
        doc.setFillColor(COL_TEXT_SEC);
        // tiny square for icon
        doc.rect(margin, y - 3, 3, 4, 'F');
        doc.text(`${book.clippings.length} Destacados`, margin + 6, y);
        y += 8;

        // Date
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, margin + 6, y);

        // Footer
        doc.setFontSize(7);
        doc.setTextColor(COL_TEXT_SEC);
        doc.text(
            `Página ${pageNumber}`,
            margin,
            pHeight - margin
        );
        doc.text(
            'CitandoAndo',
            margin,
            pHeight - margin - 4
        );
    };

    // --- Content Area Logic ---
    let y = margin + 10;

    // Initial Sidebar for Page 1
    await drawSidebar(1, 0);

    // Header Right (Logo)
    const logoX = pWidth - margin;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(COL_PRIMARY);
    doc.text('CitandoAndo', logoX, margin + 5, { align: 'right' });

    // Badge outline
    doc.setDrawColor(COL_PRIMARY);
    doc.roundedRect(logoX - 28, margin + 1, 30, 6, 2, 2, 'S');

    y += 20;

    for (let i = 0; i < book.clippings.length; i++) {
        const clip = book.clippings[i];

        // Calculate Height
        doc.setFont('times', 'italic');
        doc.setFontSize(12);
        const quoteW = contentWidth - (margin * 2) - 10;
        const textLines = doc.splitTextToSize(clip.content, quoteW);
        const blockHeight = (textLines.length * 6) + 20;

        if (y + blockHeight > pHeight - margin) {
            doc.addPage();
            y = margin + 20;
            await drawSidebar(doc.getNumberOfPages(), 0);

            // Header on new page
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(COL_PRIMARY);
            doc.text('CitandoAndo', logoX, margin + 5, { align: 'right' });
        }

        const contentX = sidebarWidth + margin;

        // Quote Mark
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(40);
        doc.setTextColor(COL_QUOTE_MARK);
        doc.text('"', contentX - 5, y + 10);

        // Text
        doc.setFont('times', 'italic');
        doc.setFontSize(12);
        doc.setTextColor(COL_TEXT_MAIN);
        doc.text(textLines, contentX + 10, y + 5);

        y += (textLines.length * 6) + 10;

        // Separator
        if (i < book.clippings.length - 1) {
            doc.setDrawColor(240);
            doc.setLineWidth(0.5);
            doc.line(contentX + 10, y, contentX + 30, y);
            y += 10;
        }
    }

    const fileName = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_highlights.pdf`;
    doc.save(fileName);
};
