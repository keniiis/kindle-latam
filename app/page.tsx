// app/page.tsx (SERVER COMPONENT): landing de descarga de la app
import { COPY } from "@/lib/landing/copy";
import type { Metadata } from 'next';
import LandingSite from '@/components/landing/LandingSite';
import { APP_CONFIG } from '@/lib/landing/download';
import { organizationLd, websiteLd, jsonLdString } from '@/lib/seo';

export const metadata: Metadata = {
    title: { absolute: 'CitandoAndo | Tus subrayados de Kindle en imágenes para Instagram' },
    description: `CitandoAndo convierte los subrayados de tu Kindle en imágenes bonitas listas para Instagram. Disponible en App Store para iPhone. ${COPY.freeLead}, sin registro y tus citas se quedan en tu iPhone.`,
    alternates: { canonical: '/' },
    openGraph: {
        title: 'CitandoAndo | Tus subrayados de Kindle en imágenes para Instagram',
        description: `Importa tu My Clippings.txt o escribe tus citas y compártelas en segundos. ${COPY.noUpload}`,
        type: 'website',
        url: 'https://citandoando.app',
    },
};

const FAQ = [
    ['¿Dónde descargo la app? ¿Vale para mi móvil?', 'Está en la App Store, solo para iPhone: pulsa «Descargar gratis» o escanea el QR de la sección «Descargar» con tu móvil.'],
    ['¿Es realmente gratis? ¿Necesito crearme una cuenta?', COPY.faqAnswerLong],
    ['¿Cómo paso mi My Clippings.txt a la app?', 'Conecta tu Kindle al ordenador con el cable USB, entra en la carpeta “documents” y copia “My Clippings.txt”. Envíatelo al móvil (email, Drive, AirDrop…) e impórtalo desde la app: en segundos tendrás tu biblioteca organizada.'],
    ['¿Es seguro? ¿Guardan mis notas?', 'Todo se procesa y se guarda en tu propio móvil. Tus notas NO se suben a ningún servidor y no hay cuentas. Lo único que consulta es la portada de cada libro (con su título y autor).'],
    ['¿Funciona con Kobo, Apple Books o libros físicos?', '¡Sí! Escribes la cita a mano desde libros físicos, PDFs, Apple Books, Kobo o cualquier fuente y le aplicas los mismos estilos.'],
    ['¿En qué formato salen las imágenes?', 'En una imagen lista para Instagram, TikTok y X. Esta página es el escaparate con una muestra interactiva: la experiencia completa vive en la app.'],
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
        url: APP_CONFIG.WEB_URL,
        downloadUrl: APP_CONFIG.APPLE_URL,
        installUrl: APP_CONFIG.APPLE_URL,
        image: `${APP_CONFIG.WEB_URL}/icon.png`,
        inLanguage: 'es',
        isAccessibleForFree: true,
    },
    organizationLd,
    websiteLd,
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
];

export default function Page() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
            <LandingSite />
        </>
    );
}
