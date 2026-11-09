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
        <main className="min-h-screen bg-white text-slate-900 font-sans" suppressHydrationWarning>
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
        </main>
    );
}