"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Smartphone, FolderOpen, Wand2, ShieldCheck, Zap, Heart, ArrowUpRight, ArrowRight,
  Quote, Check, Plus, Minus, Code2, FileText, Lock, Sparkles,
} from "lucide-react";
import { TEMPLATES, backgroundOf } from "@/lib/landing/core";
import { Reveal } from "./Hero";
import BrandIcon from "./BrandIcon";
import { SmartDownloadButton, StoreButtons } from "./Download";

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Smartphone className="h-6 w-6" />,
      title: "Descarga la app gratis",
      desc: "Beta abierta en TestFlight para iPhone (App Store, muy pronto). Sin cuentas, sin registro: la abres y ya estás dentro.",
      tag: "TestFlight",
      color: "bg-ink text-paper",
    },
    {
      n: "02",
      icon: <FolderOpen className="h-6 w-6" />,
      title: "Importa tus subrayados",
      desc: "Pasa tu My Clippings.txt al móvil o escribe tus citas a mano desde libros físicos, PDFs y otros lectores.",
      tag: "100% en tu móvil",
      color: "bg-clay text-white",
    },
    {
      n: "03",
      icon: <Wand2 className="h-6 w-6" />,
      title: "Diseña y comparte",
      desc: "Elige un estilo, ajusta el diseño de tu cita y guarda o comparte la imagen lista para tus historias.",
      tag: "Lista para compartir",
      color: "bg-forest text-sage",
    },
  ];
  return (
    <section id="como-funciona" className="relative bg-paper py-16 sm:py-24 scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-clay">● Cómo funciona</p>
              <h2 className="font-fraunces mt-2 text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">Tan simple como<br /><span className="italic font-light">subrayar.</span></h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-jbmono text-[11px] uppercase tracking-widest text-ink/50">Del caos del txt al post en</span>
              <span className="rounded-full bg-ink px-4 py-2 font-fraunces italic text-paper">~30 seg</span>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-[24px] border border-ink/12 bg-white/70 p-7 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgba(22,17,11,0.3)] transition-all duration-500">
                <div className="flex items-start justify-between">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl ${s.color} shadow-lg transition group-hover:rotate-[-8deg]`}>{s.icon}</span>
                  <span className="font-fraunces text-6xl font-black text-ink/8 group-hover:text-clay/20 transition">{s.n}</span>
                </div>
                <h3 className="font-fraunces mt-6 text-[26px] font-black leading-tight">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/60">{s.desc}</p>
                <span className="mt-5 inline-block rounded-full bg-ink/6 px-3.5 py-1.5 font-jbmono text-[11px] uppercase tracking-widest">{s.tag}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* formato del archivo */}
        <Reveal delay={150}>
          <div className="mt-6 grid lg:grid-cols-[1fr_1fr] gap-4">
            <div className="rounded-[24px] bg-ink text-paper p-7 sm:p-8 grain-light relative overflow-hidden">
              <div className="relative flex items-center gap-2 font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                <FileText className="h-4 w-4 text-gold" /> Así se ve tu archivo por dentro
              </div>
              <pre className="relative mt-4 overflow-x-auto rounded-2xl bg-black/40 border border-paper/10 p-5 font-jbmono text-[12px] leading-relaxed text-paper/75">
{`Cien años de soledad (García Márquez)
- Your Highlight on page 34 | Added on…
Muchos años después, frente al
pelotón de fusilamiento…
==========
Rayuela (Julio Cortázar)
- Your Highlight on page 78 | Added on…
Andábamos sin buscarnos…`}
              </pre>
              <p className="relative mt-4 text-[13.5px] text-paper/60">Nuestro parser entiende páginas, posiciones, fechas y notas — y limpia el ruido automáticamente.</p>
            </div>
            <div className="rounded-[24px] border border-ink/12 bg-gold-soft/60 p-7 sm:p-8 relative overflow-hidden">
              <div className="flex items-center gap-2 font-jbmono text-[11px] uppercase tracking-[0.2em] text-ink/55">
                <Sparkles className="h-4 w-4 text-clay" /> Y así queda después de CitandoAndo
              </div>
              <div className="mt-4 space-y-2.5">
                {["Biblioteca agrupada por libro y autor", "Buscador instantáneo de libros, autores y frases", "Imágenes listas para tus historias de Instagram", "Escribe citas a mano de libros físicos y PDFs"].map((t) => (
                  <div key={t} className="flex items-center gap-3 rounded-2xl bg-white/80 border border-ink/10 px-4 py-3 text-[14px] font-medium">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-white"><Check className="h-3.5 w-3.5" /></span>{t}
                  </div>
                ))}
              </div>
              <a href="#descargar" className="mt-5 inline-flex items-center gap-2 font-bold text-[14.5px] text-clay hover:gap-3 transition-all">Descargar la app gratis <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TemplatesGallery({ onUse }: { onUse: (id: string) => void }) {
  return (
    <section id="plantillas" className="relative bg-ink text-paper py-16 sm:py-24 scroll-mt-24 overflow-hidden grain-light">
      <div className="pointer-events-none absolute inset-0 dot-grid-light opacity-40" />
      <div className="absolute -top-10 inset-x-0 text-center select-none pointer-events-none">
        <span className="font-fraunces text-[15vw] font-black leading-none text-stroke-paper opacity-50">ESTILOS</span>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-gold">● Ejemplos de estilos</p>
              <h2 className="font-fraunces mt-2 text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">Cada cita,<br /><span className="italic font-light text-clay-soft">su atmósfera.</span></h2>
            </div>
            <p className="max-w-sm text-[15px] text-paper/60">Así de distinta puede verse cada cita. Dentro de la app eliges el estilo de tu imagen. Toca una para ir a la descarga.</p>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TEMPLATES.map((t, i) => (
            <Reveal key={t.id} delay={(i % 5) * 90}>
              <button
                onClick={() => onUse(t.id)}
                className="group w-full text-left rounded-[22px] overflow-hidden border border-paper/12 bg-paper/[0.04] hover:border-gold/60 hover:-translate-y-1.5 transition-all duration-500"
              >
                <span className="relative block aspect-square overflow-hidden" style={{ background: backgroundOf(t) }}>
                  <span className="absolute left-3 top-2.5 font-jbmono text-[8.5px] tracking-[0.18em]" style={{ color: t.muted }}>CITANDOANDO</span>
                  {t.ornament === "quote" && <span className="absolute left-2.5 top-4 font-fraunces italic leading-none" style={{ fontSize: 56, color: t.accent, opacity: 0.3 }}>“</span>}
                  {t.ornament === "frame" && <span className="absolute inset-2.5 rounded-lg border" style={{ borderColor: t.accent, opacity: 0.5 }} />}
                  <span className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                    <span className="h-1.5 w-1.5 rounded-full mb-2" style={{ background: t.accent }} />
                    <span className={`leading-[1.4] ${t.font === "sans" ? "font-grotesk font-medium" : t.font === "display" ? "font-instrument italic" : "font-fraunces italic"}`} style={{ color: t.text, fontSize: 13.5 }}>
                      Andábamos sin buscarnos pero sabiendo que andábamos para encontrarnos.
                    </span>
                    <span className="mt-2.5 h-[2px] w-6 rounded-full" style={{ background: t.accent }} />
                    <span className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.16em]" style={{ color: t.text }}>Cortázar</span>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold bg-ink/85 text-paper backdrop-blur transition group-hover:translate-y-0">
                    Conseguir en la app <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="flex items-center justify-between px-4 py-3.5">
                  <span>
                    <span className="block font-fraunces text-[17px] font-bold leading-tight">{t.name}</span>
                    <span className="block text-[12px] text-paper/50 truncate">{t.desc}</span>
                  </span>
                  <span className="font-jbmono text-[10px] text-paper/40">{String(i + 1).padStart(2, "0")}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Privacy() {
  return (
    <section id="privacidad" className="bg-paper py-16 sm:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-forest text-paper grain-light">
            <div className="absolute inset-0 dot-grid-light opacity-50" />
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sage/15 blur-[80px]" />
            <div className="relative grid lg:grid-cols-2 gap-8 p-7 sm:p-12">
              <div>
                <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-sage">● Privacidad radical</p>
                <h2 className="font-fraunces mt-3 text-4xl sm:text-5xl font-black leading-[0.95] tracking-tight">Tus notas son tuyas.<br /><span className="italic font-light text-gold">Punto.</span></h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper/65">
                  CitandoAndo no tiene base de datos de usuarios ni cuentas. Todo se procesa y se guarda <span className="text-paper font-semibold">en tu propio móvil</span>: tus subrayados no salen de tu dispositivo a menos que tú los compartas.
                </p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: <Lock className="h-4 w-4" />, t: "Sin nube propia", d: "Tus citas no se suben a ningún servidor nuestro." },
                    { icon: <Zap className="h-4 w-4" />, t: "Local primero", d: "Tus citas viven en tu iPhone." },
                    { icon: <ShieldCheck className="h-4 w-4" />, t: "Sin registro", d: "Ni email, ni contraseñas." },
                    { icon: <Code2 className="h-4 w-4" />, t: "Tú mandas", d: "Exporta o borra todo cuando quieras." },
                  ].map((f) => (
                    <div key={f.t} className="rounded-2xl border border-paper/12 bg-paper/[0.06] p-4">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-sage/15 text-sage">{f.icon}</span>
                      <p className="mt-2.5 text-[14.5px] font-bold">{f.t}</p>
                      <p className="text-[13px] text-paper/60">{f.d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="rounded-2xl border border-paper/12 bg-black/30 p-5 font-jbmono text-[12.5px] leading-relaxed">
                  <div className="flex items-center gap-1.5 pb-3 border-b border-paper/10 mb-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-clay" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sage" />
                    <span className="ml-2 text-paper/40">network · citandoando</span>
                  </div>
                  <p className="text-sage">✓ Tus citas no se envían a ningún servidor</p>
                  <p className="text-sage">✓ Sin cuentas ni registro</p>
                  <p className="text-sage">✓ Sin base de datos de usuarios</p>
                  <p className="mt-3 text-paper/45">── lo único que sale de tu iPhone ──</p>
                  <p className="text-paper/70">GET portada del libro … <span className="text-gold">solo título y autor</span></p>
                  <p className="mt-3 rounded-xl bg-sage/10 border border-sage/20 p-3 text-sage text-[12px]">Tus subrayados: procesados en memoria local. Se guardan en tu propio iPhone.</p>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-paper text-ink p-4">
                  <Quote className="h-8 w-8 text-clay shrink-0" fill="currentColor" />
                  <p className="text-[13.5px] leading-snug"><span className="font-bold">Sin letra chica:</span> lee nuestra <a href="/privacidad" className="font-bold text-clay underline underline-offset-2">política de privacidad</a>, corta y en cristiano.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "¿Dónde descargo la app? ¿Vale para mi móvil?",
    a: "Por ahora es una beta abierta en TestFlight para iPhone: pulsa «Descargar gratis» o escanea el QR de la sección «Descargar» con tu móvil (App Store, muy pronto). La app es solo para iPhone.",
  },
  {
    q: "¿Es realmente gratis? ¿Necesito crearme una cuenta?",
    a: "Sí: es gratis, sin registro y sin suscripciones. La abres, importas tus citas y empiezas a diseñar.",
  },
  {
    q: "¿Cómo paso mi My Clippings.txt a la app?",
    a: "Conecta tu Kindle al ordenador con el cable USB, entra en la carpeta “documents” y copia “My Clippings.txt”. Envíatelo al móvil (email, Drive, AirDrop…) e impórtalo desde la app: en segundos tendrás tu biblioteca organizada.",
  },
  {
    q: "¿Es seguro? ¿Guardan mis notas?",
    a: "Todo se procesa y se guarda en tu propio móvil. Tus notas NO se suben a ningún servidor y no hay cuentas. Lo único que consulta es la portada de cada libro (con su título y autor).",
  },
  {
    q: "¿Funciona con Kobo, Apple Books o libros físicos?",
    a: "¡Sí! Escribes la cita a mano desde libros físicos, PDFs, Apple Books, Kobo o cualquier fuente y le aplicas los mismos estilos.",
  },
  {
    q: "¿En qué formato salen las imágenes?",
    a: "En una imagen lista para Instagram, TikTok y X. Esta página es el escaparate con una muestra interactiva: la experiencia completa vive en la app.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-paper-2/50 py-16 sm:py-24 scroll-mt-24 border-t border-ink/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center font-jbmono text-[11px] uppercase tracking-[0.24em] text-clay">● Preguntas de lectores</p>
          <h2 className="font-fraunces mt-2 text-center text-4xl sm:text-5xl font-black tracking-tight">Dudas <span className="italic font-light text-clay">resueltas.</span></h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 60}>
                <div className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? "border-ink bg-white shadow-lg" : "border-ink/12 bg-white/60 hover:border-ink/30"}`}>
                  <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left">
                    <span className="font-fraunces text-[17px] sm:text-lg font-bold">{f.q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${isOpen ? "bg-clay text-white rotate-180" : "bg-ink/8"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-6 text-[14.5px] leading-relaxed text-ink/65">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-paper-2/50 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-clay text-white grain-light px-7 py-12 sm:p-16 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-[70px]" />
              <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-ink/25 blur-[70px]" />
              <span className="absolute left-6 top-6 text-5xl opacity-30 rotate-[-12deg]">“</span>
              <span className="absolute right-6 bottom-6 text-5xl opacity-30 rotate-[12deg]">”</span>
            </div>
            <div className="relative">
              <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-white/70">● Gratis · Sin registro · Solo iPhone por ahora</p>
              <h2 className="font-fraunces mx-auto mt-3 max-w-3xl text-4xl sm:text-6xl font-black leading-[0.95] tracking-tight">
                Tus libros ya te cambiaron.<br /><span className="italic font-light">Ahora deja que se note.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/80">Descarga la app y publica tu primera cita esta misma noche.</p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <SmartDownloadButton big light />
                <StoreButtons compact />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-night text-paper grain-light relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="block overflow-hidden rounded-xl"><BrandIcon size={40} /></span>
              <span className="font-fraunces text-xl font-black">Citando<span className="italic font-light text-clay">Ando</span></span>
            </div>
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-paper/55">La app que convierte tus subrayados de Kindle en imágenes listas para Instagram. Gratis y privada.</p>
            <div className="mt-4"><StoreButtons compact /></div>
          </div>
          <div>
            <p className="font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/40">Producto</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {[["Descargar la app", "#descargar"], ["Cómo funciona", "#como-funciona"], ["Plantillas", "#plantillas"], ["Privacidad", "#privacidad"]].map(([l, h]) => (
                <li key={h}><a href={h} className="text-paper/65 hover:text-paper transition">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/40">Recursos</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li><a href="#demo" className="text-paper/65 hover:text-paper transition">Antes / Después</a></li>
              <li><a href="#faq" className="text-paper/65 hover:text-paper transition">Dónde está mi txt</a></li>
                            <li><a href="#descargar" className="text-paper/65 hover:text-paper transition">Escanear QR de descarga</a></li>
              <li><Link href="/blog" className="text-paper/65 hover:text-paper transition">Blog</Link></li>
              <li><a href="/soporte" className="text-paper/65 hover:text-paper transition">Soporte</a></li>
              <li><a href="/privacidad" className="text-paper/65 hover:text-paper transition">Política de privacidad</a></li>
            </ul>
          </div>
          <div>
            <p className="font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/40">La app</p>
            <p className="mt-3 flex items-center gap-1.5 text-[13px] text-paper/50"><Heart className="h-3.5 w-3.5 text-clay" fill="currentColor" /> Gratis y sin registro</p>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-paper/50"><ShieldCheck className="h-3.5 w-3.5 text-sage" /> 100% local-first</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-paper/10 pt-6 font-jbmono text-[11px] uppercase tracking-widest text-paper/35">
          <span>© 2026 CitandoAndo</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse" /> kindle → papel → feed</span>
        </div>
      </div>
    </footer>
  );
}
