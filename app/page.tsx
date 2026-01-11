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
                    __html: `
                    [
                        ${JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "CitandoAndo",
                        "applicationCategory": "ProductivityApplication",
                        "operatingSystem": "Web, Android, iOS, Windows, MacOS",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Transforma tus highlights de Kindle en arte listo para tus redes sociales en segundos. Sin descargas ni registros.",
                        "featureList": "Kindle Clippings Parser, Instagram Image Generator, Twitter Card Creator, Privacy Focused",
                        "screenshot": "https://citando-ando.vercel.app/opengraph-image",
                        "softwareVersion": "1.0.0",
                        "author": {
                            "@type": "Person",
                            "name": "Danidev",
                            "url": "https://x.com/Danipena3488"
                        }
                    })},
                        ${JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "¿Cómo encuentro el archivo My Clippings.txt?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Conecta tu Kindle a tu PC con el cable USB. Aparecerá como una memoria externa. Entra a la carpeta 'documents' y ahí encontrarás el archivo 'My Clippings.txt'."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Es seguro? ¿Guardan mis notas?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Totalmente seguro. CitandoAndo funciona 100% en tu navegador. Tus notas NO se suben a ningún servidor, todo el procesamiento es local en tu dispositivo."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Funciona con Kobo o Apple Books?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "¡Sí! Con nuestro nuevo Modo Manual puedes crear diseños hermosos transcribiendo desde libros físicos, PDFs, Apple Books o cualquier otra fuente."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Es realmente gratis?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sí, es un proyecto Open Source creado por amor a la lectura. Si te gusta, puedes invitarme un café, pero todas las funciones son y serán gratuitas."
                                }
                            }
                        ]
                    })}
                    ]
                    `
                }}
            />
            <KindleApp />

            {/* FOOTER SEO: 
         Este footer puede ir aquí en el Server Component para que siempre 
         esté presente en el HTML inicial, independientemente de la carga de la app.
      */}
            <footer className="mt-auto py-6 border-t border-slate-200 text-center bg-slate-50">
                <p className="text-slate-600 text-xs mb-2">
                    Hecho con <span className="text-red-400">❤</span> en Chiloé por <a href="https://ko-fi.com/devdanipena" target="_blank" className="hover:text-indigo-600 underline font-medium">Danidev</a>
                </p>
                <div className="flex justify-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    <span>Kindle Parser</span> • <span>Next.js PWA</span> • <span>Open Source</span>
                </div>
            </footer>
        </main>
    );
}