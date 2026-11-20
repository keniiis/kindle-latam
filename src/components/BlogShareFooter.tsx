'use client';

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

export interface LiteraryQuote {
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

export default function BlogShareFooter({ customQuotes }: { customQuotes?: LiteraryQuote[] }) {
    const [mounted, setMounted] = useState(false);
    const [currentQuote, setCurrentQuote] = useState<LiteraryQuote>(QUOTES[0]);

    useEffect(() => {
        // Seleccionar aleatoria solo en el cliente para evitar mismatch
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        const pool = customQuotes && customQuotes.length > 0 ? customQuotes : QUOTES;
        setCurrentQuote(pool[Math.floor(Math.random() * pool.length)]);
    }, [customQuotes]);

    if (!mounted) return null; // Evitar flash de contenido incorrecto o layout shift masivo

    return (
        <div className="mt-10 flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="bg-forest p-7 sm:p-8 rounded-[22px] relative overflow-hidden group text-paper">
                <div className="absolute top-0 left-0 w-2 h-full bg-clay transition-all group-hover:w-3"></div>
                <Quote className="absolute top-4 right-6 text-sage/40 rotate-12 group-hover:scale-110 transition-transform" size={48} />

                <div className="relative z-10">
                    <p className="italic text-xl md:text-2xl leading-relaxed mb-4 font-fraunces">
                        “{currentQuote.text}”
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                        <span className="font-bold text-gold uppercase tracking-wide">— {currentQuote.author}</span>
                        <span className="hidden sm:inline text-paper/30">•</span>
                        <span className="text-paper/60 italic">{currentQuote.source}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
