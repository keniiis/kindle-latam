"use client";

import { useEffect } from "react";
import { ArrowDown, ShieldCheck } from "lucide-react";
import PhoneEditor from "./PhoneEditor";
import { SmartDownloadButton, StoreButtons } from "./Download";
import { scrollToDownload } from "@/lib/landing/download";

const MARQUEE = ["Beta abierta en TestFlight", "My Clippings.txt → imagen en segundos", "Sin registro · Sin nube", "Gratis y sin registro"];

export default function Hero({
  onPrimary,
}: {
  onPrimary: () => void;
}) {

  return (
    <section id="top" className="relative overflow-hidden bg-paper grain pt-[118px] sm:pt-[132px]">
      {/* fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-10%] h-[520px] w-[520px] rounded-full bg-clay/15 blur-[110px]" />
        <div className="absolute top-1/3 left-[-12%] h-[420px] w-[420px] rounded-full bg-gold/25 blur-[100px]" />
        <div className="absolute inset-x-0 top-24 text-center select-none">
          <span className="font-fraunces text-[18vw] leading-none font-black tracking-tight text-stroke opacity-60">KINDLE → POST</span>
        </div>
        <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-8 items-start pb-10">
          {/* izquierda */}
          <div className="rise pt-4 sm:pt-8">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-ink/15 bg-white/60 backdrop-blur px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#425F3B] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#425F3B]" />
              </span>
              <span className="truncate font-jbmono text-[11px] uppercase tracking-[0.16em]">La app para lectores de Kindle que subrayan</span>
            </div>

            {/* H1 autoexplicativo: qué entra → qué sale → dónde */}
            <h1 className="font-fraunces mt-6 text-[12vw] sm:text-6xl xl:text-[76px] leading-[0.95] tracking-[-0.03em] font-black">
              Convierte tus subrayados de Kindle en{" "}
              <span className="relative inline-block italic font-light text-clay">
                imágenes
                <svg viewBox="0 0 220 22" className="absolute -bottom-2 left-0 w-full" fill="none">
                  <path d="M3 15 C 60 5, 160 5, 217 12" stroke="#E4572E" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                </svg>
              </span>{" "}
              listas para Instagram.
            </h1>

            <p className="mt-6 max-w-xl text-[16px] sm:text-lg leading-relaxed text-ink/65">
              Descarga la app, importa tu <span className="font-jbmono text-[13px] bg-ink text-paper px-2 py-0.5 rounded-md">My Clippings.txt</span> y
              publica citas bonitas en segundos.{" "}
              <span className="text-ink font-medium">Gratis, sin registro y sin subir nada a ningún servidor.</span>
            </p>

            {/* checklist de 5 segundos */}
            <ul className="mt-5 flex flex-wrap gap-2 text-[13px] font-medium">
              {["¿Subrayas en Kindle? ✓", "¿Quieres compartir citas? ✓"].map((c) => (
                <li key={c} className="rounded-full border border-ink/12 bg-white/70 px-3.5 py-1.5">{c}</li>
              ))}
              <li className="rounded-full bg-ink px-3.5 py-1.5 text-paper">→ Esta app es para ti</li>
            </ul>

            <div className="mt-7 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <SmartDownloadButton big />
              </div>
              <div className="flex justify-start">
                <StoreButtons compact onSoon={onPrimary} />
              </div>
              <button onClick={() => document.getElementById("descargar")?.scrollIntoView({ behavior: "smooth" })} className="w-fit font-jbmono text-[11px] uppercase tracking-[0.18em] text-ink/45 hover:text-clay transition">
                o escanea el QR más abajo ↓
              </button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="flex items-center gap-1.5 text-sm text-ink/60">
                <ShieldCheck className="h-4 w-4 text-forest" /> Tus notas nunca salen de tu móvil
              </p>
            </div>
          </div>

          {/* derecha: muestra interactiva de la app */}
          <div className="relative lg:pt-2">
            <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-1.5 font-jbmono text-[10.5px] uppercase tracking-[0.18em] text-paper shadow-lg">
              ✳ Mira cómo funciona en la app
            </div>
            <PhoneEditor />
            <button
              onClick={() => { scrollToDownload(); }}
              className="mx-auto mt-3 flex items-center gap-2 rounded-full bg-[#425F3B] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              ¿Te gusta lo que ves? Descarga la app gratis →
            </button>
          </div>
        </div>

        {/* tira */}
        <div className="relative left-1/2 w-screen -translate-x-1/2 border-y border-ink/12 bg-ink text-paper py-3.5 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee gap-0 w-max">
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center gap-8 pr-8 font-jbmono text-[12px] uppercase tracking-[0.22em]">
                {[...MARQUEE, ...MARQUEE].map((t, n) => (
                  <span key={t + n} className="flex items-center gap-8">
                    <span>{t}</span>
                    <span className="text-clay">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-6 text-ink/45 font-jbmono text-[11px] uppercase tracking-[0.2em]">
          Mira la transformación <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
