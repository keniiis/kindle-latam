"use client";

import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import BrandIcon from "./BrandIcon";

export default function Navbar({ onDownload }: { onDownload: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  const links = [
    { label: "Antes / Después", href: "#demo" },
    { label: "¿Para quién?", href: "#para-quien" },
    { label: "La app", href: "#descargar" },
    { label: "Plantillas", href: "#plantillas" },
    { label: "FAQ", href: "#faq" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement */}
      <div className="bg-ink text-paper relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] sm:text-xs font-jbmono tracking-[0.14em] uppercase">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="truncate">Beta abierta en TestFlight · App Store muy pronto · tus subrayados → Instagram</span>
          <Sparkles className="h-3.5 w-3.5 text-gold" />
        </div>
      </div>
      <div
        className={`transition-all duration-500 border-b ${
          scrolled ? "bg-paper/85 backdrop-blur-xl border-ink/10 shadow-[0_8px_30px_rgba(22,17,11,0.08)]" : "bg-transparent border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <a href="#top" className="group flex items-center gap-3">
            <span className="shadow-lg rounded-xl overflow-hidden block transition group-hover:rotate-[-4deg]">
              <BrandIcon size={40} />
            </span>
            <span className="leading-none">
              <span className="font-fraunces block text-[19px] font-black tracking-tight">
                Citando<span className="italic font-light text-clay">Ando</span>
              </span>
              <span className="font-jbmono text-[10px] uppercase tracking-[0.22em] text-ink/50">kindle → imagen → IG</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="link-draw text-[13.5px] font-medium tracking-wide text-ink/70 hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onDownload}
              className="group relative overflow-hidden rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-clay-deep"
            >
              <span className="relative z-10">Descargar gratis</span>
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-paper/70 backdrop-blur">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="lg:hidden border-t border-ink/10 bg-paper/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-fraunces text-xl hover:bg-ink hover:text-paper transition"
              >
                {l.label}
              </a>
            ))}
            <button onClick={() => { setOpen(false); onDownload(); }} className="mt-2 w-full rounded-xl bg-clay py-3.5 text-white font-semibold">
              Descargar gratis
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
