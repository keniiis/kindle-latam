import { Clipping } from '@/lib/parser';

interface PdfExportTemplateProps {
    book: {
        title: string;
        author: string;
        clippings: Clipping[];
    };
    coverUrl?: string | null;
}

export const PdfExportTemplate = ({ book, coverUrl }: PdfExportTemplateProps) => {
    // Dot pattern as SVG data URI for better reliability in html2canvas
    const dotPattern = `data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%2394a3b8' fill-opacity='0.4'/%3E%3C/svg%3E`;

    return (
        <div
            id="pdf-template"
            className="pdf-container mx-auto bg-white relative overflow-hidden flex border border-slate-200 shadow-2xl"
            style={{
                width: '900px',
                height: '1165px', // Fixed Letter ratio (8.5:11)
            }}
        >
            {/* Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `url("${dotPattern}")`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Sidebar (Left) - 33.33% Width */}
            <aside className="w-1/3 bg-slate-50 border-r border-slate-200 p-10 flex flex-col z-10 relative h-full">
                <div className="mb-12">
                    <div className="aspect-[2/3] w-full bg-slate-200 rounded-lg shadow-md overflow-hidden relative group">
                        {coverUrl ? (
                            <img
                                src={coverUrl}
                                alt="Book Cover"
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                                loading="eager"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-300">
                                <span className="material-symbols-outlined text-4xl text-slate-400">book_2</span>
                            </div>
                        )}
                        {/* Overlay to blend */}
                        <div className="absolute inset-0 bg-purple-500/10 mix-blend-multiply"></div>
                    </div>
                </div>

                <div className="flex-grow pb-20">
                    <h1 className="text-4xl font-bold mb-2 text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {book.title}
                    </h1>
                    <p className="text-purple-500 font-medium text-lg mb-8 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {book.author}
                    </p>

                    <div className="space-y-6 text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">bookmarks</span>
                            <span className="text-sm font-medium">{book.clippings.length} Destacados</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                            <span className="text-sm font-medium">
                                {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer - Absolute Positioned */}
                <footer className="absolute bottom-20 left-10 right-10 pt-8 border-t border-slate-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Generado con CitandoAndo</p>
                    <p className="text-[10px] text-slate-400">Página 1 de 1</p>
                </footer>
            </aside>

            {/* Content (Right) - 66.66% Width */}
            <section className="flex-grow p-12 flex flex-col z-10 relative bg-white h-full">
                {/* Logo Header */}
                <div className="flex justify-end mb-16">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs italic">CA</div>
                        <span className="font-bold tracking-tight text-purple-500" style={{ fontFamily: "'Inter', sans-serif" }}>CitandoAndo</span>
                    </div>
                </div>

                {/* Quotes List - Limit to fit page */}
                <div className="space-y-12 pb-32">
                    {book.clippings.slice(0, 3).map((clip, i) => (
                        <article key={i} className="relative">
                            <span
                                className="material-symbols-outlined absolute -left-6 -top-6 text-6xl text-purple-500 opacity-20 pointer-events-none select-none"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                format_quote
                            </span>
                            <div className="relative pl-6">
                                <blockquote className="text-xl leading-relaxed italic text-slate-700" style={{ fontFamily: "'Lora', serif" }}>
                                    "{clip.content}"
                                </blockquote>
                                <div className="h-px w-16 bg-purple-500/30 mt-6"></div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Right Footer Content - Absolute Positioned */}
                <div className="absolute bottom-20 left-12 right-12 flex justify-between items-end border-t border-slate-100 pt-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div>
                        <span className="text-xs text-slate-400 block mb-1">Libro</span>
                        <span className="text-sm font-medium max-w-[200px] truncate block" title={book.title}>
                            {book.title}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block mb-1 text-right">Autor</span>
                        <span className="text-sm font-medium text-right block max-w-[150px] truncate">
                            {book.author}
                        </span>
                    </div>
                </div>
            </section>

            {/* Decoration */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-tl-full pointer-events-none z-0"></div>
        </div>
    );
};
