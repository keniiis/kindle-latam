import { COPY } from "@/lib/landing/copy";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import SwCleanup from '@/components/SwCleanup';
import { ToastProvider } from '@/components/Toast';
import "./globals.css";

// Cargamos la fuente base (usada en páginas legales; la landing y el blog cargan sus propias fuentes)
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://citandoando.app'),
  title: {
    default: "CitandoAndo | Tu Segundo Cerebro para Kindle",
    template: "%s | CitandoAndo"
  },
  description: `Transforma tus highlights de Kindle en contenido visual y compártelo en redes sociales. ${COPY.layoutDesc}`,
  keywords: ["Kindle", "Highlights", "Notas", "Instagram", "Stories", "Generador de imágenes", "Lectura", "Libros", "Citas"],
  authors: [{ name: "Danidev", url: "https://x.com/Danipena3488" }],
  creator: "Danidev",
  publisher: "Danidev",
  openGraph: {
    title: 'CitandoAndo | Comparte tus lecturas con estilo',
    description: `Convierte tus subrayados de Kindle en imágenes hermosas para tus stories. ${COPY.sentence}.`,
    url: 'https://citandoando.app',
    siteName: 'CitandoAndo',
    locale: 'es_ES',
    alternateLocale: ['es_MX', 'es_AR', 'es_CO'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CitandoAndo - Kindle Highlights a Instagram',
    description: `Dale vida a tus notas de lectura. ${COPY.sentence}.`,
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

  icons: { icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { url: '/icon.png', sizes: '512x512', type: 'image/png' }], apple: '/apple-icon.png' },
  verification: {
    google: "QXZblOlOyRPQN1NNk49XkmgYepZASrS4jLIgwT8QDXA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={jakarta.variable} suppressHydrationWarning>
      <head>
        {/* Eliminados links de Google Fonts para evitar error CORS con html-to-image */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TK6TVNPK');`}
        </Script>
      </head>
      {/* Forzamos la clase font-display y el fondo base aquí */}
      <body className="font-display bg-white text-[#140d1c] antialiased" suppressHydrationWarning={true}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TK6TVNPK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ToastProvider>
          {children}
          <SwCleanup />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}