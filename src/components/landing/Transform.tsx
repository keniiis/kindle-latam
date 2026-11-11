"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronsLeftRight, FileText, ImageDown, MoveHorizontal } from "lucide-react";
import { Reveal } from "./Hero";
import { SmartDownloadButton } from "./Download";
import { TEMPLATES } from "@/lib/landing/core";

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

/* ─– Comparador Antes / Después ───────────────────── */
function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const played = useRef(false);

  const setFromClient = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(94, Math.max(6, ((clientX - r.left) / r.width) * 100)));
  };

  // al entrar en pantalla, el divisor se pasea solo una vez
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !played.current) {
          played.current = true;
          [80, 30, 50].forEach((v, i) => {
            timers.push(window.setTimeout(() => setPos(v), 700 * (i + 1)));
          });
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClient(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClient(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className="relative h-[440px] sm:h-[460px] cursor-ew-resize touch-none overflow-hidden rounded-[26px] border border-ink/12 bg-night text-paper shadow-[0_40px_90px_-30px_rgba(20,16,12,0.6)] select-none"
    >
      {/* CAPA ANTES: el txt crudo */}
      <div className="absolute inset-0 bg-[#171310] p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-jbmono text-[11px] uppercase tracking-[0.2em] text-paper/45">
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gold" /> My Clippings.txt · 214 KB
          </span>
          <span className="rounded-full bg-paper/10 border border-paper/15 px-3 py-1 text-[10px] tracking-[0.18em] text-paper/60">
            Antes · caos olvidado
          </span>
        </div>
        <pre className="mt-5 font-jbmono text-[12.5px] sm:text-[13.5px] leading-[2] text-paper/70 whitespace-pre-wrap">
{`Don Quijote de la Mancha (Miguel de Cervantes)
- Your Highlight on page 145 | Added on…
La libertad, Sancho, es uno de los más
preciosos dones que a los hombres…
==========
Rayuela (Julio Cortázar)
- Your Highlight on page 78 | Added on…
Andábamos sin buscarnos pero sabiendo
que andábamos para encontrarnos.
==========
Ficciones (Jorge Luis Borges)
- Your Highlight on page 45 | Added on…`}
        </pre>
      </div>

      {/* CAPA DESPUÉS: la imagen final (recortada por clip-path) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <div className="flex h-full flex-col items-center justify-center bg-[#425F3B] px-8 text-center text-white">
          <span className="font-fraunces font-black leading-none" style={{ fontSize: 64, color: "#2C4427" }}>“”</span>
          <p className="font-grotesk font-bold text-[19px] sm:text-[24px] leading-[1.45] max-w-md -mt-3">
            “La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.”
          </p>
          <span className="mt-5 h-[3px] w-12 rounded-full bg-[#B9D2AF]" />
          <p className="mt-3 text-[12px] font-bold uppercase" style={{ letterSpacing: "0.22em" }}>Miguel de Cervantes</p>
          <p className="mt-1 text-[13px] text-white/65">Don Quijote de la Mancha</p>
          <p className="mt-5 font-jbmono text-[10.5px] uppercase tracking-[0.2em] text-white/55">● CitandoAndo</p>
        </div>
        <span className="absolute right-5 sm:right-8 top-6 flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur px-3.5 py-1.5 font-jbmono text-[10.5px] uppercase tracking-[0.18em]">
          <ImageDown className="h-3.5 w-3.5" /> Después · PNG 1080px
        </span>
      </div>

      {/* divisor arrastrable */}
      <div className="absolute inset-y-0 w-[3px] bg-paper shadow-[0_0_20px_rgba(0,0,0,0.5)]" style={{ left: `${pos}%` }} />
      <div
        className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-xl"
        style={{ left: `${pos}%` }}
      >
        <ChevronsLeftRight className="h-5 w-5" />
        <span className="absolute -bottom-7 whitespace-nowrap rounded-full bg-ink/80 px-3 py-1 font-jbmono text-[10px] uppercase tracking-widest text-paper flex items-center gap-1">
          <MoveHorizontal className="h-3 w-3" /> arrastra
        </span>
      </div>
    </div>
  );
}

/* ─– Sección completa ─────────────────────────────── */
export function TransformSection() {
  const { ref } = useInView<HTMLDivElement>(0.25);

  const minis = [
    { tpl: "negro", q: "Todo lo que empieza como comedia acaba como tragedia.", a: "Bolaño" },
    { tpl: "papel", q: "Los libros son espejos.", a: "Ruiz Zafón" },
    { tpl: "arrugado", q: "Es tan corto el amor, y es tan largo el olvido.", a: "Neruda" },
    { tpl: "blanco", q: "El universo es una Biblioteca.", a: "Borges" },
  ];

  return (
    <section id="demo" className="bg-paper py-14 sm:py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-clay">● La prueba · antes / después</p>
              <h2 className="font-fraunces mt-2 text-4xl sm:text-5xl font-black tracking-tight leading-[0.95]">
                Del txt olvidado<br />al post <span className="italic font-light text-clay">que presumes.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[14.5px] text-ink/60">Arrastra el divisor y compruébalo tú mismo: mismo subrayado, dos vidas distintas.</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-7">
            <BeforeAfter />
          </div>
        </Reveal>

        <div ref={ref} className="mt-6 flex justify-center">
          <Reveal delay={200}>
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-ink px-7 py-5 text-center">
              <SmartDownloadButton />
              <p className="font-jbmono text-[10.5px] uppercase tracking-[0.18em] text-paper/50">Gratis · Sin registro</p>
            </div>
          </Reveal>
        </div>

        {/* mini muro de estilos */}
        <Reveal delay={100}>
          <div className="mt-8">
            <p className="text-center font-jbmono text-[11px] uppercase tracking-[0.22em] text-ink/45">Algunos estilos de ejemplo</p>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {minis.map((m, i) => {
                const t = TEMPLATES.find((x) => x.id === m.tpl)!;
                return (
                  <div
                    key={m.a}
                    className="rounded-2xl p-5 text-center shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-xl"
                    style={{
                      background: t.gradient ? `linear-gradient(140deg, ${t.bg}, ${t.bg2})` : t.bg,
                      color: t.text,
                      transform: `rotate(${i % 2 === 0 ? "-1.5deg" : "1.5deg"})`,
                    }}
                  >
                    <p className={`text-[14px] leading-snug ${t.font === "sans" ? "font-grotesk font-bold" : "font-fraunces italic"}`}>“{m.q}”</p>
                    <span className="mx-auto mt-2.5 block h-[2px] w-6 rounded-full" style={{ background: t.accent }} />
                    <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em]">{m.a}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
