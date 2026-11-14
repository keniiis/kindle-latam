"use client";

import { Check, Feather, Flame, CalendarDays, Target } from "lucide-react";
import { Reveal } from "./Hero";

/* Colores reales de la app (src/theme.ts + ActivityGrid). */
const LEVELS = ["#ECECE8", "#C9DDB8", "#A9C79A", "#6E9462", "#3F5B3A"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const WEEKS = 16;
const MILESTONES = [1, 10, 25, 50, 100, 250, 500];
const TOTAL = 38; // ejemplo
const NEXT = 50;
const REACHED = 25;

/** Datos de ejemplo deterministas (sin Math.random para no romper la hidratación). */
function sample() {
  const cols: number[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const col: number[] = [];
    for (let d = 0; d < 7; d++) {
      const s = Math.sin((w + 1) * 12.9898 + (d + 1) * 78.233) * 43758.5453;
      const r = s - Math.floor(s);
      const growth = 0.25 + (w / WEEKS) * 0.5; // más actividad hacia hoy
      col.push(r > 1 - growth * 0.7 ? Math.min(4, 1 + Math.floor((r - (1 - growth * 0.7)) / ((growth * 0.7) / 4))) : 0);
    }
    cols.push(col);
  }
  return cols;
}

export default function ReadingSection() {
  const grid = sample();
  const monthLabels = grid.map((_, w) => (w % 4 === 0 ? MONTHS[(7 + Math.floor(w / 4)) % 12] : ""));
  const pct = Math.round(((TOTAL - REACHED) / (NEXT - REACHED)) * 100);

  return (
    <section id="tu-lectura" className="relative bg-paper-2/50 py-16 sm:py-24 scroll-mt-24 overflow-hidden border-y border-ink/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
        <Reveal>
          <div className="max-w-xl">
            <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-clay">● Tu lectura</p>
            <h2 className="font-fraunces mt-2 text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
              Un puntito<br /><span className="italic font-light">por cada día.</span>
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink/65">
              Cada frase que guardas deja una huella. En la pestaña <span className="font-semibold text-ink">Tu lectura</span> ves tus días como un calendario de puntitos, tu racha semanal y las metas que vas alcanzando, con una pequeña celebración cuando llegas.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { i: <CalendarDays className="h-4 w-4" />, t: "Tus días", d: "Toca un puntito y reencuentra las frases de ese día." },
                { i: <Flame className="h-4 w-4" />, t: "Tu racha", d: "Semanas seguidas guardando al menos una frase." },
                { i: <Target className="h-4 w-4" />, t: "Tus metas", d: "De 1 a 500 frases, con un latido en la que viene." },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-3.5 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3.5">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forest text-sage">{f.i}</span>
                  <p className="text-[14.5px] leading-snug"><span className="font-bold">{f.t}.</span> <span className="text-ink/60">{f.d}</span></p>
                </div>
              ))}
            </div>
            <p className="mt-6 font-fraunces italic text-[17px] text-ink/55">Esto no es una competencia: lee, disfruta y las frases llegarán solas.</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* maqueta de la pantalla */}
          <div className="mx-auto w-full max-w-[360px] rounded-[40px] border-[7px] border-ink bg-[#F6F4EE] p-4 shadow-[0_40px_80px_-30px_rgba(22,17,11,0.45)]">
            <p className="px-1 pt-2 text-[28px] font-extrabold leading-tight tracking-tight">Tu lectura</p>

            <div className="mt-4 flex items-center gap-4 rounded-[24px] bg-[#3F5B3A] p-4 text-white">
              <span className="text-[48px] font-extrabold leading-none">6</span>
              <span>
                <span className="block text-[15px] font-bold">semanas seguidas</span>
                <span className="block text-[12px] text-white/70">guardando al menos una frase</span>
              </span>
            </div>

            <div className="mt-3 rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-[15px] font-bold">Tus días</p>
              <p className="text-[11.5px] text-ink/50">Toca un día para ver sus frases</p>
              <div className="mt-3 overflow-hidden">
                <div className="flex gap-[3px] h-4">
                  {monthLabels.map((m, i) => (
                    <span key={i} className="w-[14px] shrink-0 overflow-visible whitespace-nowrap font-semibold text-[9.5px] text-ink/45">{m}</span>
                  ))}
                </div>
                <div className="flex gap-[3px]">
                  {grid.map((col, w) => (
                    <div key={w} className="flex flex-col gap-[3px]">
                      {col.map((l, d) => (
                        <span key={d} className="block h-[14px] w-[14px] rounded-[4px]" style={{ background: LEVELS[l] }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-end gap-1 text-[10px] text-ink/45">
                Menos {LEVELS.map((c) => <span key={c} className="h-2.5 w-2.5 rounded-[3px]" style={{ background: c }} />)} Más
              </div>
            </div>

            <div className="mt-3 rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-[15px] font-bold">Tus metas</p>
              <p className="mt-1 text-[13px] text-ink/60">Te faltan {NEXT - TOTAL} frases para llegar a {NEXT}.</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ECECE8]">
                <div className="h-full rounded-full bg-[#3F5B3A]" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {MILESTONES.map((g) => {
                  const done = TOTAL >= g;
                  if (g === NEXT)
                    return (
                      <span key={g} className="relative inline-flex">
                        <span className="absolute inset-0 rounded-full bg-[#A9C79A] animate-ping motion-reduce:animate-none opacity-50" />
                        <span className="relative rounded-full border-2 border-[#3F5B3A] bg-[#F1F5EB] px-3 py-1 text-[12.5px] font-bold text-[#3F5B3A]">{g}</span>
                      </span>
                    );
                  return (
                    <span key={g} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12.5px] font-bold ${done ? "bg-[#3F5B3A] text-white" : "bg-[#ECECE8] text-ink/55"}`}>
                      {done && <Check className="h-3 w-3" />}{g}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 px-3 pb-2 text-center">
              <Feather className="h-4 w-4 shrink-0 text-[#A9C79A]" />
              <p className="font-fraunces italic text-[13.5px] leading-snug text-ink/55">Estos puntos no miden cuánto lees. Solo guardan lo que te gustó.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
