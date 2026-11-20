import Link from "next/link";
import BrandIcon from "@/components/landing/BrandIcon";
import { StoreButtons } from "@/components/landing/Download";
import { fraunces, instrumentSerif, jetbrainsMono, spaceGrotesk } from "@/components/landing/fonts";

function BlogNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="block overflow-hidden rounded-xl shadow-lg transition group-hover:rotate-[-4deg]">
            <BrandIcon size={38} />
          </span>
          <span className="font-fraunces text-[19px] font-black tracking-tight">
            Citando<span className="italic font-light text-[#b23c1b]">Ando</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-5">
          <Link href="/" className="link-draw hidden sm:inline text-[13.5px] font-medium tracking-wide text-ink/70 hover:text-ink">Inicio</Link>
          <Link href="/blog" className="link-draw hidden sm:inline text-[13.5px] font-medium tracking-wide text-ink/70 hover:text-ink">Blog</Link>
          <Link href="/#descargar" className="rounded-full bg-clay-deep px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a8381a]">
            Descargar gratis
          </Link>
        </div>
      </nav>
    </header>
  );
}

function BlogFooter() {
  return (
    <footer className="relative overflow-hidden bg-night text-paper grain-light">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="block overflow-hidden rounded-xl"><BrandIcon size={40} /></span>
              <span className="font-fraunces text-xl font-black">Citando<span className="italic font-light text-clay">Ando</span></span>
            </div>
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-paper/70">La app que convierte tus subrayados de Kindle en imágenes listas para Instagram. Gratis y privada.</p>
            <div className="mt-4"><StoreButtons compact /></div>
          </div>
          <div>
            <p className="font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/60">Explora</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li><Link href="/" className="text-paper/65 transition hover:text-paper">Inicio</Link></li>
              <li><Link href="/blog" className="text-paper/65 transition hover:text-paper">Blog</Link></li>
              <li><Link href="/#descargar" className="text-paper/65 transition hover:text-paper">Descargar la app</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/60">Ayuda</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li><Link href="/soporte" className="text-paper/65 transition hover:text-paper">Soporte</Link></li>
              <li><Link href="/privacidad" className="text-paper/65 transition hover:text-paper">Política de privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-paper/10 pt-6 font-jbmono text-[11px] uppercase tracking-widest text-paper/60 sm:flex-row">
          <span>© {new Date().getFullYear()} CitandoAndo</span>
          <span>kindle → papel → feed</span>
        </div>
      </div>
    </footer>
  );
}

export default function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`landing ${fraunces.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-paper text-ink font-grotesk`}>
      <BlogNav />
      <main className="pt-[66px]">{children}</main>
      <BlogFooter />
    </div>
  );
}
