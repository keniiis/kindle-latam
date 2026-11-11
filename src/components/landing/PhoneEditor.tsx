"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X, RotateCcw, Square, Droplet, Type, AlignCenter, SlidersHorizontal,
  Upload, Check,
} from "lucide-react";

type Tool = "fondo" | "detalles" | "redonda" | "diseno" | "mas";

const FONDOS = [
  { id: "verde", name: "Verde", bg: "#3F5B3A", ink: "#FFFFFF", sub: "rgba(255,255,255,0.66)", line: "#A9C79A", mark: "rgba(255,255,255,0.18)" },
  { id: "negro", name: "Negro", bg: "#222222", ink: "#FFFFFF", sub: "rgba(255,255,255,0.6)", line: "#A9C79A", mark: "rgba(255,255,255,0.18)" },
  { id: "blanco", name: "Blanco", bg: "#FFFFFF", ink: "#1E1E1E", sub: "rgba(30,30,30,0.55)", line: "#3F5B3A", mark: "rgba(30,30,30,0.12)" },
  { id: "papel", name: "Papel", bg: "#F3EBDD", ink: "#2B1D16", sub: "rgba(43,29,22,0.58)", line: "#C9A14A", mark: "rgba(43,29,22,0.14)" },
  { id: "arrugado", name: "Papel arrugado", bg: "linear-gradient(140deg,#E5E5E5,#D3D3D1)", ink: "#1E1E1E", sub: "rgba(30,30,30,0.55)", line: "#1E1E1E", mark: "rgba(30,30,30,0.14)" },
];

const TEXT = "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos.";
const AUTHOR = "Miguel de Cervantes";
const BOOK = "Don Quijote de la Mancha";

interface Step {
  tool: Tool;
  fondo?: string;
  ornament?: "comillas" | "linea";
  radius?: number;
  diseno?: "centrado" | "izquierda" | "clasico";
  watermark?: boolean;
  finale?: boolean;
  hold: number;
  cursor: [number, number]; // % dentro de la zona de controles
}

/** Guion de la demo en bucle (~18 s): el cursor fantasma lo hace todo solo. */
const SCRIPT: Step[] = [
  { tool: "fondo", fondo: "verde", hold: 1500, cursor: [13, 46] },
  { tool: "fondo", fondo: "negro", hold: 1150, cursor: [27, 46] },
  { tool: "fondo", fondo: "blanco", hold: 1150, cursor: [41, 46] },
  { tool: "fondo", fondo: "papel", hold: 1150, cursor: [55, 46] },
  { tool: "fondo", fondo: "verde", hold: 1350, cursor: [13, 46] },
  { tool: "detalles", ornament: "linea", hold: 1150, cursor: [50, 46] },
  { tool: "detalles", ornament: "comillas", hold: 1150, cursor: [20, 46] },
  { tool: "redonda", radius: 12, hold: 1050, cursor: [16, 46] },
  { tool: "redonda", radius: 44, hold: 1050, cursor: [84, 46] },
  { tool: "redonda", radius: 28, hold: 1150, cursor: [50, 46] },
  { tool: "diseno", diseno: "izquierda", hold: 1150, cursor: [50, 46] },
  { tool: "diseno", diseno: "clasico", hold: 1150, cursor: [80, 46] },
  { tool: "diseno", diseno: "centrado", hold: 1150, cursor: [20, 46] },
  { tool: "mas", watermark: false, hold: 1050, cursor: [28, 46] },
  { tool: "mas", watermark: true, hold: 1150, cursor: [28, 46] },
  { tool: "mas", watermark: true, finale: true, hold: 1900, cursor: [70, 84] },
];

const PHASES: { id: string; label: string }[] = [
  { id: "fondo", label: "Fondo" },
  { id: "detalles", label: "Detalles" },
  { id: "redonda", label: "Redonda" },
  { id: "diseno", label: "Diseño" },
  { id: "mas", label: "Más" },
  { id: "share", label: "Compartir" },
];

export default function PhoneEditor() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIdx(4); // estado final bonito, sin animar
      return;
    }
    const t = window.setTimeout(() => setStepIdx((i) => (i + 1) % SCRIPT.length), SCRIPT[stepIdx].hold);
    return () => window.clearTimeout(t);
  }, [stepIdx]);

  // El estado visible es el acumulado del guion hasta el paso actual
  const state = useMemo(() => {
    const acc: { fondo: string; ornament: "comillas" | "linea"; radius: number; diseno: "centrado" | "izquierda" | "clasico"; watermark: boolean } =
      { fondo: "verde", ornament: "comillas", radius: 28, diseno: "centrado", watermark: true };
    // Para que el bucle sea coherente, aplicamos desde el último "reset" (paso 0)
    for (let i = 0; i <= stepIdx; i++) {
      const s = SCRIPT[i];
      if (s.fondo) acc.fondo = s.fondo;
      if (s.ornament) acc.ornament = s.ornament;
      if (s.radius !== undefined) acc.radius = s.radius;
      if (s.diseno) acc.diseno = s.diseno;
      if (s.watermark !== undefined) acc.watermark = s.watermark;
    }
    return acc;
  }, [stepIdx]);

  const cur = SCRIPT[stepIdx];
  const fondo = FONDOS.find((f) => f.id === state.fondo) ?? FONDOS[0];
  const align = state.diseno === "izquierda" ? "left" : "center";
  const serif = state.diseno === "clasico";
  const finale = cur.finale === true;

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
    { id: "redonda", label: "Redonda", icon: <Type className="h-[22px] w-[22px]" /> },
    { id: "diseno", label: "Diseño", icon: <AlignCenter className="h-[22px] w-[22px]" /> },
    { id: "mas", label: "Más", icon: <SlidersHorizontal className="h-[22px] w-[22px]" /> },
  ];

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

        {/* header como la app */}
        <div className="pointer-events-none flex items-center justify-between px-4 pt-2.5 pb-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm"><X className="h-5 w-5" /></span>
          <p className="text-[17px] font-bold tracking-tight">Crear imagen</p>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm"><RotateCcw className="h-[18px] w-[18px]" /></span>
        </div>

        {/* tarjeta */}
        <div className="pointer-events-none px-4">
          <div
            className="relative flex min-h-[430px] flex-col justify-center overflow-hidden px-7 py-10 transition-all duration-500"
            style={{ background: fondo.bg, borderRadius: state.radius }}
          >
            {state.ornament === "comillas" && (
              <span className="absolute left-6 top-5 font-fraunces font-black leading-none select-none transition-all duration-500" style={{ fontSize: 54, color: fondo.mark }}>“”</span>
            )}
            <div className={`flex flex-1 flex-col justify-center transition-all duration-500 ${align === "center" ? "items-center text-center" : "items-start text-left"}`}>
              {state.ornament === "linea" && <span className="mb-5 h-[3px] w-11 rounded-full" style={{ background: fondo.line }} />}
              <p
                className={serif ? "font-fraunces italic font-light" : "font-grotesk font-bold"}
                style={{ color: fondo.ink, fontSize: 24, lineHeight: 1.38, letterSpacing: "-0.01em" }}
              >
                “{TEXT}”
              </p>
              <span className="mt-6 h-[3px] w-11 rounded-full transition-all duration-500" style={{ background: fondo.line }} />
              <p className="mt-4 text-[12px] font-bold uppercase" style={{ color: fondo.ink, letterSpacing: "0.22em" }}>{AUTHOR}</p>
              <p className="mt-1 text-[12.5px]" style={{ color: fondo.sub }}>{BOOK}</p>
            </div>
            <div className={`mt-6 flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all duration-500 ${state.watermark ? "opacity-100" : "opacity-0"}`} style={{ color: fondo.sub }}>
              <span className="h-2 w-2 rounded-full" style={{ background: fondo.sub }} /> CitandoAndo
            </div>
          </div>
        </div>

        {/* bottom sheet */}
        <div className="relative mt-3 rounded-t-[28px] bg-white px-5 pt-4 pb-5 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
          <div className="pointer-events-none grid grid-cols-5 gap-1">
            {tools.map((t) => (
              <span key={t.id} className="flex flex-col items-center gap-1.5 py-1">
                <span className={`transition-all duration-300 ${cur.tool === t.id ? "text-[#425F3B] scale-110" : "text-ink/60"}`}>{t.icon}</span>
                <span className={`text-[12.5px] ${cur.tool === t.id ? "text-[#425F3B] font-bold" : "text-ink/60 font-medium"}`}>{t.label}</span>
                <span className={`h-1 w-1 rounded-full transition-all ${cur.tool === t.id ? "bg-[#3F5B3A]" : "bg-transparent"}`} />
              </span>
            ))}
          </div>

          <div className="pointer-events-none mt-2 min-h-[64px] rounded-2xl bg-ink/[0.035] p-3">
            {cur.tool === "fondo" && (
              <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                {FONDOS.map((f) => (
                  <span key={f.id} className={`relative h-11 w-11 shrink-0 rounded-full border border-ink/10 ring-2 ring-offset-2 transition-all duration-300 ${state.fondo === f.id ? "ring-[#3F5B3A] scale-105" : "ring-transparent"}`} style={{ background: f.bg }}>
                    {state.fondo === f.id && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />}
                  </span>
                ))}
                <span className="ml-1 text-[12px] font-semibold text-ink/60 whitespace-nowrap">{fondo.name}</span>
              </div>
            )}
            {cur.tool === "detalles" && (
              <div className="flex gap-2">
                {([["comillas", "Comillas “”"], ["linea", "Línea —"]] as const).map(([id, label]) => (
                  <span key={id} className={`flex-1 rounded-xl px-3 py-2.5 text-center text-[12.5px] font-bold transition-all duration-300 ${state.ornament === id ? "bg-[#3F5B3A] text-white" : "bg-white text-ink/70 shadow-sm"}`}>{label}</span>
                ))}
              </div>
            )}
            {cur.tool === "redonda" && (
              <div className="flex items-center gap-3 px-1">
                <span className="text-[12px] font-semibold text-ink/55 whitespace-nowrap">Redonda · {state.radius}px</span>
                <div className="relative h-1.5 flex-1 rounded-full bg-ink/10">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-[#3F5B3A] transition-all duration-500" style={{ width: `${((state.radius - 8) / 36) * 100}%` }} />
                  <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3F5B3A] shadow transition-all duration-500" style={{ left: `${((state.radius - 8) / 36) * 100}%` }} />
                </div>
              </div>
            )}
            {cur.tool === "diseno" && (
              <div className="flex gap-2">
                {([["centrado", "Centrado"], ["izquierda", "Izquierda"], ["clasico", "Clásico"]] as const).map(([id, label]) => (
                  <span key={id} className={`flex-1 rounded-xl px-3 py-2.5 text-center text-[12.5px] font-bold transition-all duration-300 ${state.diseno === id ? "bg-[#3F5B3A] text-white" : "bg-white text-ink/70 shadow-sm"}`}>{label}</span>
                ))}
              </div>
            )}
            {cur.tool === "mas" && (
              <div className="grid grid-cols-2 gap-2 px-1 py-0.5">
                <span className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[12px] font-semibold shadow-sm">
                  Marca CitandoAndo
                  <span className={`relative h-5 w-9 rounded-full transition-all duration-300 ${state.watermark ? "bg-[#3F5B3A]" : "bg-ink/15"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${state.watermark ? "left-[18px]" : "left-0.5"}`} />
                  </span>
                </span>
                <span className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[12px] font-semibold shadow-sm">
                  Mostrar libro
                  <span className="relative h-5 w-9 rounded-full bg-[#3F5B3A]">
                    <span className="absolute top-0.5 left-[18px] h-4 w-4 rounded-full bg-white shadow" />
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="pointer-events-none mt-3 flex gap-2.5">
            <span className="flex-1 rounded-full border border-ink/15 bg-white py-3.5 text-center text-[14.5px] font-bold">
              Guardar en Fotos
            </span>
            <span className={`flex flex-[1.15] items-center justify-between rounded-full py-1.5 pl-6 pr-1.5 text-[14.5px] font-bold text-white transition-all duration-300 ${finale ? "bg-[#2c4427] scale-[1.03] shadow-xl" : "bg-ink"}`}>
              Compartir
              <span className={`grid h-11 w-11 place-items-center rounded-full text-ink transition-all duration-300 ${finale ? "bg-white scale-110" : "bg-[#B9D2AF]"}`}><Upload className="h-5 w-5" /></span>
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
