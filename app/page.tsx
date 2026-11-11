// app/page.tsx (SERVER COMPONENT): landing de descarga de la app
import type { Metadata } from 'next';
import LandingSite from '@/components/landing/LandingSite';

export const metadata: Metadata = {
    title: { absolute: 'CitandoAndo | Tus subrayados de Kindle en imágenes para Instagram' },
    description: 'CitandoAndo convierte los subrayados de tu Kindle en imágenes bonitas listas para Instagram. Beta abierta en TestFlight para iPhone. Gratis, sin registro y 100% privada.',
    alternates: { canonical: '/' },
    openGraph: {
        title: 'CitandoAndo | Tus subrayados de Kindle en imágenes para Instagram',
        description: 'Importa tu My Clippings.txt o escribe tus citas y compártelas en segundos. Gratis, sin registro y sin subir nada a ningún servidor.',
        type: 'website',
        url: 'https://citando-ando.vercel.app',
    },
};

const FAQ = [
    ['¿Dónde descargo la app?', 'Por ahora es una beta abierta en TestFlight para iPhone; App Store, muy pronto. La app es solo para iPhone.'],
    ['¿Es gratis? ¿Necesito una cuenta?', 'Es gratis, sin registro y sin suscripciones.'],
    ['¿Cómo paso mi My Clippings.txt a la app?', 'Conecta tu Kindle al ordenador, copia el archivo My Clippings.txt de la carpeta documents, envíatelo al móvil (email, Drive, AirDrop) e impórtalo desde la app.'],
    ['¿Es seguro? ¿Guardan mis notas?', 'Todo se procesa y se guarda en tu propio móvil. Tus notas no se suben a ningún servidor y no hay cuentas.'],
    ['¿Funciona con Kobo, Apple Books o libros físicos?', 'Sí: puedes escribir la cita a mano desde cualquier fuente y aplicarle los mismos estilos.'],
];

const jsonLd = [
    {
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        name: 'CitandoAndo',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'iOS',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: 'Convierte tus subrayados de Kindle en imágenes listas para compartir en redes sociales. Sin registro y privada.',
        author: { '@type': 'Person', name: 'Danidev', url: 'https://x.com/Danipena3488' },
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
];

export default function Page() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <LandingSite />
        </>
    );
}
