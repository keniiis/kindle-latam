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
  authors: [{ name: "Danidev", url: "https://twitter.com/devdanipena" }],
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
      {/* Forzamos la clase font-display y el fondo base aquí */}
      <body className="font-display bg-[#f7f5f8] text-[#140d1c] antialiased">
        {children}
      </body>
    </html>
  );
}