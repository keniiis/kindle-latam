import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Cargamos la fuente
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-jakarta', // Esta variable la usa Tailwind
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://citando-ando.vercel.app'),
  title: {
    default: "CitandoAndo | Tu Segundo Cerebro para Kindle",
    template: "%s | CitandoAndo"
  },
  description: "Transforma tus highlights de Kindle en contenido visual y compártelo en redes sociales. Herramienta gratuita, sin registro y privada.",
  keywords: ["Kindle", "Highlights", "Notas", "Instagram", "Stories", "Generador de imágenes", "Lectura", "Libros", "Citas"],
  authors: [{ name: "Danidev", url: "https://x.com/Danipena3488" }],
  creator: "Danidev",
  publisher: "Danidev",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CitandoAndo | Comparte tus lecturas con estilo',
    description: 'Convierte tus subrayados de Kindle en imágenes hermosas para tus stories. Sin instalar nada.',
    url: 'https://citando-ando.vercel.app',
    siteName: 'CitandoAndo',
    locale: 'es_LA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CitandoAndo - Kindle Highlights a Instagram',
    description: 'Dale vida a tus notas de lectura. Gratis y sin registro.',
    creator: '@devdanipena',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon',
    apple: '/icon',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" rel="stylesheet" />
      </head>
      {/* Forzamos la clase font-display y el fondo base aquí */}
      <body className="font-display bg-[#f7f5f8] text-[#140d1c] antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}