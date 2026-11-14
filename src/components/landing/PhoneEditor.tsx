"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X, RotateCcw, Square, Droplet, Type, AlignCenter, AlignLeft, SlidersHorizontal,
  Upload, Check,
} from "lucide-react";

/* Réplica de la pantalla «Crear imagen» de la app: solo muestra lo que la app ofrece de verdad
 * (fondo, color de detalles, tipografía, alineación, formato y los interruptores Título / Autor / Marca). */

type Tool = "fondo" | "detalles" | "fuente" | "diseno" | "mas";
type FontId = "rounded" | "serif" | "mono";

const FONT_LABEL: Record<FontId, string> = { rounded: "Redonda", serif: "Serif", mono: "Mono" };

// `acc` y `font` son los valores que la app aplica al elegir un fondo.
const FONDOS = [
  { id: "verde", bg: "#3F5B3A", ink: "#FFFFFF", acc: "#A9C79A", font: "rounded" as FontId },
  { id: "negro", bg: "#222222", ink: "#FFFFFF", acc: "#A9C79A", font: "rounded" as FontId },
  { id: "atardecer", bg: "linear-gradient(140deg,#FFB347,#FF5E7E,#8E4DCB)", ink: "#FFFFFF", acc: "#FFF3D6", font: "rounded" as FontId },
  { id: "lila", bg: "linear-gradient(140deg,#EEE4FC,#C6B0F0)", ink: "#2E1F4D", acc: "#6B4FBB", font: "rounded" as FontId },
  { id: "papel", bg: "#F3EBDD", ink: "#2B1D16", acc: "#C9A14A", font: "serif" as FontId },
  { id: "blanco", bg: "#FFFFFF", ink: "#1E1E1E", acc: "#3F5B3A", font: "rounded" as FontId },
  { id: "melocoton", bg: "linear-gradient(140deg,#FFE6D6,#F7B49B)", ink: "#4A2417", acc: "#C2573A", font: "serif" as FontId },
  { id: "menta", bg: "linear-gradient(140deg,#E1F6EA,#A5DFC1)", ink: "#17402E", acc: "#2F7D58", font: "rounded" as FontId },
  { id: "oceano", bg: "linear-gradient(140deg,#2B5BFF,#18B7D9)", ink: "#FFFFFF", acc: "#D6F4FF", font: "rounded" as FontId },
  { id: "arrugado", bg: "linear-gradient(140deg,#E5E5E5,#D3D3D1)", ink: "#1E1E1E", acc: "#1E1E1E", font: "serif" as FontId },
];

const ACCENTS = ["#FFFFFF", "#1E1E1E", "#3F5B3A", "#A9C79A", "#C9A14A", "#8C3B46", "#5E7F92", "#B42318", "#D9779B", "#92400E"];

const TEXT = "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.";
const AUTHOR = "Miguel de Cervantes";
const BOOK = "Don Quijote de la Mancha";

interface Step {
  tool: Tool;
  fondo?: string;
  accent?: string;
  font?: FontId;
  align?: "center" | "left";
  format?: "story" | "post";
  showTitle?: boolean;
  showAuthor?: boolean;
  showWatermark?: boolean;
  finale?: boolean;
  hold: number;
  cursor: [number, number]; // % dentro de la zona inferior (barra de herramientas + panel + botones)
}

// Centros aproximados de los iconos de la barra de herramientas (5 columnas) y de los círculos del panel.
const TB_Y = 14;
const C = (i: number) => 13.5 + i * 13.5;

/** Guion de la demo en bucle: el cursor fantasma lo hace todo solo. */
const SCRIPT: Step[] = [
  { tool: "fondo", fondo: "verde", hold: 1400, cursor: [C(0), 46] },
  { tool: "fondo", fondo: "negro", hold: 1000, cursor: [C(1), 46] },
  { tool: "fondo", fondo: "atardecer", hold: 1000, cursor: [C(2), 46] },
  { tool: "fondo", fondo: "lila", hold: 1100, cursor: [C(3), 46] },
  { tool: "fondo", fondo: "verde", hold: 1100, cursor: [C(0), 46] },
  { tool: "detalles", accent: "#C9A14A", hold: 1100, cursor: [C(4), 46] },
  { tool: "detalles", accent: "#8C3B46", hold: 1100, cursor: [C(5), 46] },
  { tool: "fuente", font: "serif", hold: 1150, cursor: [50, TB_Y] },
  { tool: "fuente", font: "mono", hold: 1150, cursor: [50, TB_Y] },
  { tool: "fuente", font: "rounded", hold: 1000, cursor: [50, TB_Y] },
  { tool: "diseno", align: "left", hold: 1150, cursor: [70, TB_Y] },
  { tool: "diseno", align: "center", hold: 1000, cursor: [70, TB_Y] },
  { tool: "mas", format: "post", hold: 1300, cursor: [78, 37] },
  { tool: "mas", format: "story", hold: 1000, cursor: [30, 37] },
  { tool: "mas", showTitle: false, hold: 1000, cursor: [20, 57] },
  { tool: "mas", showTitle: true, hold: 800, cursor: [20, 57] },
  { tool: "mas", showWatermark: false, hold: 1000, cursor: [80, 57] },
  { tool: "mas", showWatermark: true, hold: 1000, cursor: [80, 57] },
  { tool: "mas", finale: true, hold: 1900, cursor: [70, 86] },
];

const PHASES: { id: string; label: string }[] = [
  { id: "fondo", label: "Fondo" },
  { id: "detalles", label: "Detalles" },
  { id: "fuente", label: "Tipografía" },
  { id: "diseno", label: "Diseño" },
  { id: "mas", label: "Más" },
  { id: "share", label: "Compartir" },
];

function Switch({ on }: { on: boolean }) {
  return (
    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-all duration-300 ${on ? "bg-[#3F5B3A]" : "bg-ink/15"}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${on ? "left-[18px]" : "left-0.5"}`} />
    </span>
  );
}

export default function PhoneEditor() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIdx(5); // estado final bonito, sin animar
      return;
    }
    const t = window.setTimeout(() => setStepIdx((i) => (i + 1) % SCRIPT.length), SCRIPT[stepIdx].hold);
    return () => window.clearTimeout(t);
  }, [stepIdx]);

  // El estado visible es el acumulado del guion hasta el paso actual
  const state = useMemo(() => {
    const acc = {
      fondo: "verde", accent: "#A9C79A", font: "rounded" as FontId, align: "center" as "center" | "left",
      format: "story" as "story" | "post", showTitle: true, showAuthor: true, showWatermark: true,
    };
    for (let i = 0; i <= stepIdx; i++) {
      const s = SCRIPT[i];
      if (s.fondo) {
        const f = FONDOS.find((x) => x.id === s.fondo)!;
        acc.fondo = f.id; acc.accent = f.acc; acc.font = f.font; // como en la app: elegir un fondo restablece acento y tipografía
      }
      if (s.accent) acc.accent = s.accent;
      if (s.font) acc.font = s.font;
      if (s.align) acc.align = s.align;
      if (s.format) acc.format = s.format;
      if (s.showTitle !== undefined) acc.showTitle = s.showTitle;
      if (s.showAuthor !== undefined) acc.showAuthor = s.showAuthor;
      if (s.showWatermark !== undefined) acc.showWatermark = s.showWatermark;
    }
    return acc;
  }, [stepIdx]);

  const cur = SCRIPT[stepIdx];
  const fondo = FONDOS.find((f) => f.id === state.fondo) ?? FONDOS[0];
  const left = state.align === "left";
  const finale = cur.finale === true;
  const post = state.format === "post";

  // Progreso por fases (estilo stories)
  const segKeys = useMemo(() => SCRIPT.map((s) => (s.finale ? "share" : s.tool)), []);
  const segFill = PHASES.map((p) => {
    const idxs = segKeys.map((k, i) => (k === p.id ? i : -1)).filter((i) => i >= 0);
    if (!idxs.length) return 0;
    const done = idxs.filter((i) => i < stepIdx).length;
    const active = idxs.includes(stepIdx) ? 0.55 : 0;
    return Math.min(1, (done + active) / idxs.length);
  });

  const tools: { id: Tool; label: string; icon: React.ReactNode }[] = [
    { id: "fondo", label: "Fondo", icon: <Square className="h-[22px] w-[22px]" /> },
    { id: "detalles", label: "Detalles", icon: <Droplet className="h-[22px] w-[22px]" /> },
    { id: "fuente", label: FONT_LABEL[state.font], icon: <Type className="h-[22px] w-[22px]" /> },
    { id: "diseno", label: "Diseño", icon: left ? <AlignLeft className="h-[22px] w-[22px]" /> : <AlignCenter className="h-[22px] w-[22px]" /> },
    { id: "mas", label: "Más", icon: <SlidersHorizontal className="h-[22px] w-[22px]" /> },
  ];

  const fontClass =
    state.font === "serif" ? "font-fraunces italic font-medium"
    : state.font === "mono" ? "font-jbmono font-medium"
    : "font-grotesk font-bold";
  const panelOpen = cur.tool === "fondo" || cur.tool === "detalles" || cur.tool === "mas";

  return (
    <div className="relative mx-auto w-full max-w-[400px] select-none">
      <div className="overflow-hidden rounded-[32px] bg-[#EFEFEF] shadow-[0_50px_100px_-30px_rgba(22,17,11,0.5)] ring-1 ring-ink/10">
        {/* barra de progreso del bucle */}
        <div className="flex gap-1 px-5 pt-3.5" aria-hidden>
          {PHASES.map((p, i) => (
            <div key={p.id} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-[#3F5B3A] transition-all duration-300" style={{ width: `${Math.round(segFill[i] * 100)}%` }} />
            </div>
          ))}
        </div>

        {/* cabecera como la app */}
        <div className="pointer-events-none flex items-center justify-between px-4 pt-2.5 pb-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm"><X className="h-5 w-5" /></span>
          <p className="text-[17px] font-bold tracking-tight">Crear imagen</p>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm"><RotateCcw className="h-[18px] w-[18px]" /></span>
        </div>

        {/* tarjeta (formato Historia 9:16 o Publicación 1:1) */}
        <div className="pointer-events-none flex h-[430px] items-center justify-center px-4">
          <div
            className="relative flex w-full flex-col overflow-hidden rounded-3xl px-7 py-8 transition-all duration-500"
            style={{ background: fondo.bg, height: post ? 340 : 430 }}
          >
            <span className="absolute left-6 top-4 font-fraunces font-black leading-none select-none transition-all duration-500" style={{ fontSize: 54, color: state.accent, opacity: 0.35 }}>“</span>
            <div className={`flex flex-1 flex-col justify-center pt-6 transition-all duration-500 ${left ? "items-start text-left" : "items-center text-center"}`}>
              <p
                className={`${fontClass} transition-all duration-500`}
                style={{ color: fondo.ink, fontSize: post ? 20 : 23, lineHeight: 1.3 }}
              >
                “{TEXT}”
              </p>
            </div>
            <div className="flex flex-col items-center pt-3">
              <span className={`mb-3 h-[4px] w-14 rounded-full transition-all duration-500 ${state.showWatermark ? "opacity-100" : "opacity-0"}`} style={{ background: state.accent }} />
              <p className={`text-center text-[11px] font-bold uppercase transition-all duration-500 ${state.showAuthor ? "opacity-100" : "opacity-0"}`} style={{ color: fondo.ink, letterSpacing: "0.2em" }}>{AUTHOR}</p>
              <p className={`mt-1 text-center text-[11px] transition-all duration-500 ${state.showTitle ? "opacity-65" : "opacity-0"}`} style={{ color: fondo.ink }}>{BOOK}</p>
              <div className={`mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all duration-500 ${state.showWatermark ? "opacity-50" : "opacity-0"}`} style={{ color: fondo.ink }}>
                <span className="h-2 w-2 rounded-full" style={{ background: state.accent }} /> CitandoAndo
              </div>
            </div>
          </div>
        </div>

        {/* panel inferior */}
        <div className="relative mt-3 rounded-t-[28px] bg-white px-5 pt-4 pb-5 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
          <div className="pointer-events-none grid grid-cols-5 gap-1">
            {tools.map((t) => (
              <span key={t.id} className="flex flex-col items-center gap-1.5 py-1">
                <span className={`transition-all duration-300 ${cur.tool === t.id ? "text-[#3F5B3A] scale-110" : "text-ink/60"}`}>{t.icon}</span>
                <span className={`text-[12.5px] ${cur.tool === t.id ? "text-[#3F5B3A] font-bold" : "text-ink/60 font-medium"}`}>{t.label}</span>
                <span className={`h-1 w-1 rounded-full transition-all ${cur.tool === t.id && panelOpen ? "bg-[#3F5B3A]" : "bg-transparent"}`} />
              </span>
            ))}
          </div>

          <div className={`pointer-events-none mt-2 flex min-h-[104px] flex-col justify-center rounded-2xl p-3 transition-opacity duration-300 ${panelOpen ? "bg-ink/[0.035] opacity-100" : "opacity-0"}`}>
            {cur.tool === "fondo" && (
              <div className="flex items-center gap-2.5 overflow-hidden px-1.5 py-2">
                {FONDOS.map((f) => (
                  <span key={f.id} className={`relative h-11 w-11 shrink-0 rounded-full border border-ink/10 ring-2 ring-offset-2 transition-all duration-300 ${state.fondo === f.id ? "ring-[#3F5B3A] scale-105" : "ring-transparent"}`} style={{ background: f.bg }}>
                    {state.fondo === f.id && <Check className="absolute inset-0 m-auto h-4 w-4 drop-shadow" style={{ color: f.ink }} />}
                  </span>
                ))}
              </div>
            )}
            {cur.tool === "detalles" && (
              <div className="flex items-center gap-2.5 overflow-hidden px-1.5 py-2">
                {ACCENTS.map((c) => (
                  <span key={c} className={`relative h-11 w-11 shrink-0 rounded-full border border-ink/10 ring-2 ring-offset-2 transition-all duration-300 ${state.accent === c ? "ring-[#3F5B3A] scale-105" : "ring-transparent"}`} style={{ background: c }} />
                ))}
              </div>
            )}
            {cur.tool === "mas" && (
              <div className="space-y-2">
                <div className="flex rounded-[14px] bg-[#F4F4F2] p-[3px]">
                  {([["story", "Historia 9:16"], ["post", "Publicación 1:1"]] as const).map(([id, label]) => (
                    <span key={id} className={`flex-1 rounded-[11px] py-2 text-center text-[12px] font-bold transition-all duration-300 ${state.format === id ? "bg-white text-[#3F5B3A] shadow-sm" : "text-ink/55"}`}>{label}</span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([["Título", state.showTitle], ["Autor", state.showAuthor], ["Marca", state.showWatermark]] as const).map(([label, on]) => (
                    <span key={label} className="flex items-center justify-between rounded-xl bg-white px-2.5 py-2 text-[12px] font-semibold shadow-sm">
                      {label}
                      <Switch on={on} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pointer-events-none mt-3 flex gap-2.5">
            <span className="flex-1 rounded-full border border-ink/15 bg-white py-3.5 text-center text-[14.5px] font-bold">
              Guardar en Fotos
            </span>
            <span className={`flex flex-[1.15] items-center justify-between rounded-full py-1.5 pl-6 pr-1.5 text-[14.5px] font-bold text-white transition-all duration-300 ${finale ? "bg-[#2c4427] scale-[1.03] shadow-xl" : "bg-ink"}`}>
              Compartir
              <span className={`grid h-11 w-11 place-items-center rounded-full text-ink transition-all duration-300 ${finale ? "bg-white scale-110" : "bg-[#A9C79A]"}`}><Upload className="h-5 w-5" /></span>
            </span>
          </div>

          {/* cursor fantasma */}
          <div
            className="pointer-events-none absolute z-30 transition-all duration-500 ease-in-out"
            style={{ left: `${cur.cursor[0]}%`, top: `${cur.cursor[1]}%`, transform: "translate(-50%, -50%)" }}
            aria-hidden
          >
            <span key={stepIdx} className="animate-tap relative block h-10 w-10">
              <span className="absolute inset-0 rounded-full border-[3px] border-white shadow-[0_4px_14px_rgba(0,0,0,0.35)]" />
              <span className="absolute inset-[13px] rounded-full bg-white/95" />
              <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center font-jbmono text-[10.5px] uppercase tracking-[0.18em] text-ink/40">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#3F5B3A] align-middle" />
        Demo automática en bucle · así es «Crear imagen» en la app
      </p>
    </div>
  );
}
