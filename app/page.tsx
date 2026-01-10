// src/app/page.tsx (SERVER COMPONENT)
import { Metadata } from 'next';
import KindleApp from '@/components/KindleApp';

// ESTO ES LO QUE GOOGLE VE (SEO SERVER-SIDE)
export const metadata: Metadata = {
    title: 'Citando Ando | Organiza y Comparte tus Notas de Kindle',
    description: 'Herramienta gratuita para exportar tus subrayados de Kindle (My Clippings.txt), organizarlos y crear imágenes estéticas para Instagram y redes sociales. Sin registro.',
    keywords: ['Kindle', 'Clippings', 'Notas', 'Parser', 'Instagram', 'PWA', 'Gratis'],
    openGraph: {
        title: 'Citando Ando - Tu Segundo Cerebro para Kindle',
        description: 'Convierte tus lecturas en contenido visual en segundos.',
        type: 'website',
        url: 'https://citando-ando.vercel.app',
        // images: ['/og-image.jpg'], // Si creas una imagen de portada luego
    },
};

export default function Page() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Aquí cargamos el componente "Cliente".
         Next.js renderizará el HTML inicial estático que pueda, 
         y luego "hidratará" la interactividad en el navegador.
      */}
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "CitandoAndo",
                        "url": "https://citando-ando.vercel.app",
                        "description": "Herramienta gratuita para transformar tus highlights de Kindle en imágenes para redes sociales.",
                        "applicationCategory": "UtilitiesApplication",
                        "operatingSystem": "Any",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "author": {
                            "@type": "Person",
                            "name": "Danidev"
                        },
                        "featureList": "Kindle Clipping Parsing, Instagram Story Generator, Reading Analytics"
                    })
                }}
            />
            <KindleApp />

            {/* FOOTER SEO: 
         Este footer puede ir aquí en el Server Component para que siempre 
         esté presente en el HTML inicial, independientemente de la carga de la app.
      */}
            <footer className="mt-auto py-6 border-t border-slate-200 text-center bg-slate-50">
                <p className="text-slate-400 text-xs mb-2">
                    Hecho con <span className="text-red-400">❤</span> en Chiloé por <a href="https://ko-fi.com/devdanipena" target="_blank" className="hover:text-indigo-600 underline font-medium">Danidev</a>
                </p>
                <div className="flex justify-center gap-4 text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                    <span>Kindle Parser</span> • <span>Next.js PWA</span> • <span>Open Source</span>
                </div>
            </footer>
        </main>
    );
}