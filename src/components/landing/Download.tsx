"use client";

import { useEffect, useState } from "react";
import { Download, QrCode, ShieldCheck, Zap } from "lucide-react";
import BrandIcon from "./BrandIcon";
import { Reveal } from "./Hero";
import { APP_CONFIG, detectPlatform, iosUrl, smartDownload, scrollToDownload } from "@/lib/landing/download";

/** Logotipo de Apple (el de la manzana mordida), que sí hereda el color del texto. */
function Apple({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/* ── Botón de descarga para iPhone (TestFlight o App Store) ── */
export function StoreButtons({ compact = false }: { compact?: boolean; onSoon?: () => void }) {
  return (
    <div className={`flex ${compact ? "flex-row" : "flex-col sm:flex-row"} gap-2.5`}>
      <a href={iosUrl()} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-paper transition hover:-translate-y-0.5 hover:shadow-xl">
        <Apple className="h-7 w-7 shrink-0" />
        <span>
          <span className="block text-[10.5px] uppercase tracking-widest opacity-60">{APP_CONFIG.APPLE_LIVE ? "Descárgala en" : "Beta abierta en"}</span>
          <span className={`font-bold ${compact ? "text-[15px]" : "text-[17px]"}`}>{APP_CONFIG.APPLE_LIVE ? "App Store" : "TestFlight"}</span>
        </span>
      </a>
    </div>
  );
}

/* ── Botón inteligente (abre la tienda de tu móvil) ─── */
export function SmartDownloadButton({ big = false, light = false }: { big?: boolean; light?: boolean }) {
  const [platform, setPlatform] = useState<"ios" | "other">("other");
  // Se detecta tras la hidratación para que el HTML del servidor y el del cliente coincidan.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setPlatform(detectPlatform()), []);
  const store = APP_CONFIG.APPLE_LIVE ? "App Store" : "TestFlight";
  return (
    <button
      onClick={smartDownload}
      className={`group flex items-center justify-center gap-3 rounded-full font-bold transition-all hover:-translate-y-0.5 ${
        big ? "px-8 py-4 text-[16px] sm:text-lg" : "px-7 py-3.5 text-[15px]"
      } ${light ? "bg-paper text-ink hover:bg-white shadow-xl" : "bg-clay text-white shadow-[0_18px_40px_-12px_rgba(228,87,46,0.6)] hover:bg-clay-deep"}`}
    >
      {platform === "ios" ? <Apple className="h-5 w-5" /> : <Download className="h-5 w-5" />}
      Descargar gratis
      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-jbmono uppercase tracking-widest ${light ? "bg-ink/10" : "bg-white/20"}`}>{store}</span>
    </button>
  );
}

/* ── Sección principal de descarga ──────────────────── */
export function DownloadSection() {
  const [qrOk, setQrOk] = useState(true);
  return (
    <section id="descargar" className="bg-paper py-16 sm:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-ink text-paper grain-light">
            <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-40" />
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-clay/25 blur-[90px]" />
            <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#425F3B]/60 blur-[90px]" />
            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 p-7 sm:p-12">
              <div>
                <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-gold">● Beta abierta en TestFlight · gratis</p>
                <h2 className="font-fraunces mt-3 text-4xl sm:text-6xl font-black leading-[0.95] tracking-tight">
                  Llévala en el bolsillo.<br /><span className="italic font-light text-clay-soft">Subraya y comparte.</span>
                </h2>
                <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-paper/65">
                  Todo lo que has visto —biblioteca, estilos e imágenes listas para compartir— vive dentro de la app y no te pide ni el email.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-[12.5px] font-semibold">
                  {[
                    { icon: <Apple className="h-3.5 w-3.5" />, t: "Solo en iOS por ahora" },
                    { icon: <Zap className="h-3.5 w-3.5" />, t: "Sin registro" },
                    { icon: <ShieldCheck className="h-3.5 w-3.5" />, t: "100% privada" },
                  ].map((b) => (
                    <span key={b.t} className="flex items-center gap-1.5 rounded-full border border-paper/15 bg-paper/[0.06] px-3.5 py-1.5">{b.icon}{b.t}</span>
                  ))}
                </div>
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <SmartDownloadButton big />
                </div>
                <div className="mt-4">
                  <StoreButtons compact onSoon={scrollToDownload} />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full max-w-[320px] rounded-[26px] bg-paper text-ink p-6 text-center shadow-2xl rotate-[1.5deg]">
                  <BrandIcon size={64} />
                  <p className="font-fraunces mt-3 text-2xl font-black">Citando<em className="font-light text-clay">Ando</em></p>
                  <p className="font-jbmono text-[10.5px] uppercase tracking-[0.2em] text-ink/50">kindle → imagen → IG</p>
                  {qrOk ? (
                    <div className="mx-auto mt-4 w-fit rounded-2xl border border-ink/10 bg-white p-3">
                      <img
                        src="/qr-app.svg"
                        alt="QR para descargar CitandoAndo"
                        className="h-40 w-40"
                        loading="lazy"
                        onError={() => setQrOk(false)}
                      />
                    </div>
                  ) : (
                    <div className="mx-auto mt-4 grid h-40 w-40 place-items-center rounded-2xl border border-ink/10 bg-ink/[0.04]">
                      <QrCode className="h-10 w-10 text-ink/30" />
                    </div>
                  )}
                  <p className="mt-3 text-[13px] font-semibold">Escanea con tu móvil 📱</p>
                  <p className="text-[12px] text-ink/55">Te lleva a la beta en TestFlight</p>
                </div>
                <p className="font-jbmono text-[10.5px] uppercase tracking-[0.2em] text-paper/40">Beta en TestFlight · App Store próximamente</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Barra fija de descarga (aparece al hacer scroll) ── */
export function StickyDownloadBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let inDownload = false;
    const dl = document.getElementById("descargar");
    const io = new IntersectionObserver(([e]) => { inDownload = e.isIntersecting; }, { threshold: 0.15 });
    if (dl) io.observe(dl);
    const onScroll = () => setShow(window.scrollY > 650 && !inDownload);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 px-3 pb-3 transition-all duration-500 ${show ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"}`}>
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-paper/10 bg-ink/95 backdrop-blur-xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <BrandIcon size={38} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[14px] font-bold text-paper">CitandoAndo · gratis</p>
          <p className="truncate font-jbmono text-[10px] uppercase tracking-widest text-paper/50">tus subrayados → Instagram</p>
        </div>
        <button onClick={smartDownload} className="flex shrink-0 items-center gap-1.5 rounded-full bg-clay px-5 py-2.5 text-[13.5px] font-bold text-white transition hover:bg-clay-deep">
          <Download className="h-4 w-4" /> Descargar
        </button>
      </div>
    </div>
  );
}
