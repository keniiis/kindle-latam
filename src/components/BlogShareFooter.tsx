'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Share2, Quote } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface LiteraryQuote {
    text: string;
    author: string;
    source: string;
}

const QUOTES: LiteraryQuote[] = [
    {
        text: "Que otros se jacten de las páginas que han escrito; a mí me enorgullecen las que he leído.",
        author: "Jorge Luis Borges",
        source: "Elogio de la Sombra (1969)"
    },
    {
        text: "Andábamos sin buscarnos pero sabiendo que andábamos para encontrarnos.",
        author: "Julio Cortázar",
        source: "Rayuela (1963)"
    },
    {
        text: "La vida no es la que uno vivió, sino la que uno recuerda y cómo la recuerda para contarla.",
        author: "Gabriel García Márquez",
        source: "Vivir para contarla (2002)"
    },
    {
        text: "El que lee mucho y anda mucho, ve mucho y sabe mucho.",
        author: "Miguel de Cervantes",
        source: "Don Quijote de la Mancha (1605)"
    },
    {
        text: "Los libros son espejos: sólo se ve en ellos lo que uno ya lleva dentro.",
        author: "Carlos Ruiz Zafón",
        source: "La Sombra del Viento (2001)"
    },
    {
        text: "No hay libro tan malo que no tenga algo bueno.",
        author: "Plinio el Joven",
        source: "Cartas (Siglo I)"
    }
];

export default function BlogShareFooter() {
    const [mounted, setMounted] = useState(false);
    const [currentQuote, setCurrentQuote] = useState<LiteraryQuote>(QUOTES[0]);
    const { showToast } = useToast();

    useEffect(() => {
        // Seleccionar aleatoria solo en el cliente para evitar mismatch
        setMounted(true);
        setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, []);

    if (!mounted) return null; // Evitar flash de contenido incorrecto o layout shift masivo, o renderizar skeleton

    const shareUrl = `/?title=${encodeURIComponent(currentQuote.author)}&text=${encodeURIComponent(currentQuote.text)}`;

    return (
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 relative overflow-hidden group transition-all hover:shadow-md">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary transition-all group-hover:w-3"></div>
                <Quote className="absolute top-4 right-6 text-purple-200 rotate-12 group-hover:scale-110 transition-transform" size={48} />

                <div className="relative z-10">
                    <p className="font-bold text-slate-800 italic text-xl md:text-2xl leading-relaxed mb-4 font-serif">
                        "{currentQuote.text}"
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                        <span className="font-bold text-primary uppercase tracking-wide">— {currentQuote.author}</span>
                        <span className="hidden sm:inline text-purple-300">•</span>
                        <span className="text-slate-500 italic">{currentQuote.source}</span>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Link
                        href={shareUrl}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        Crear Story con esta frase
                    </Link>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-slate-400 font-medium px-2">
                <span>¿Te ha gustado el artículo?</span>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: document.title,
                                url: window.location.href
                            }).catch(console.error);
                        } else {
                            navigator.clipboard.writeText(window.location.href);
                            showToast('Enlace copiado al portapapeles', 'success');
                        }
                    }}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                    <Share2 size={16} />
                    Compartir artículo
                </button>
            </div>
        </div>
    );
}
