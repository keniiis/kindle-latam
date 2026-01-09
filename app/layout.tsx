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
  title: "CitandoAndo",
  description: "Tus lecturas merecen ser compartidas.",
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