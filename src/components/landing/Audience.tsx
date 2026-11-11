"use client";

import { useState } from "react";
import { BookMarked, Camera, GraduationCap, CircleCheck, Circle, ArrowRight, Ban } from "lucide-react";
import { Reveal } from "./Hero";

const PERSONAS = [
  {
    tag: "TÚ · lector que subraya",
    icon: <BookMarked className="h-6 w-6" />,
    title: "Subrayas en Kindle y jamás vuelves",
    desc: "Tienes 100, 400, 1.000 subrayados muertos en el My Clippings.txt. Sabes que hay oro ahí dentro, pero abrir ese txt da pereza.",
    check: "Rescate de subrayados olvidados",
    color: "bg-ink text-paper",
    chip: "bg-clay text-white",
  },
  {
    tag: "Bookstagram · BookTok · Newsletter",
    icon: <Camera className="h-6 w-6" />,
    title: "Creas contenido literario",
    desc: "Publicas citas a diario y diseñar cada post en Canva te roba 20 minutos. Quieres un estilo propio en 2 toques.",
    check: "1 cita diaria sin diseñar",
    color: "bg-white border border-ink/12",
    chip: "bg-forest text-sage",
  },
  {
    tag: "Docentes · Clubes · Coaches",
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Enseñas o compartes ideas",
    desc: "Conviertes fragmentos de clase, de ensayo o de desarrollo personal en tarjetas para tus alumnos y tu comunidad.",
    check: "Tarjetas de aula en segundos",
    color: "bg-white border border-ink/12",
    chip: "bg-gold-soft text-ink",
  },
];

const TEST = [
  "Tengo un Kindle (o su app) con subrayados",
  "Alguna vez quise compartir una cita y me dio pereza diseñarla",
  "Puedo conseguir mi My Clippings.txt en 1 minuto (o transcribir a mano)",
];

export default function Audience({ onStart }: { onStart: () => void }) {
  const [marks, setMarks] = useState<boolean[]>([true, true, false]);
  const score = marks.filter(Boolean).length;

  return (
    <section id="para-quien" className="bg-paper-2/60 border-y border-ink/10 py-14 sm:py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-clay">● Primera pregunta: ¿para quién es?</p>
          <h2 className="font-fraunces mt-2 max-w-3xl text-4xl sm:text-5xl font-black tracking-tight leading-[0.95]">
            Si subrayas en Kindle, <span className="italic font-light text-clay">esto se hizo para ti.</span>
          </h2>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {PERSONAS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <article className={`relative h-full rounded-[24px] p-6 sm:p-7 overflow-hidden transition hover:-translate-y-1.5 hover:shadow-xl ${p.color}`}>
                <span className={`inline-block rounded-full px-3 py-1 font-jbmono text-[10px] font-bold uppercase tracking-[0.16em] ${p.chip}`}>{p.tag}</span>
                <span className="mt-4 block w-fit">{p.icon}</span>
                <h3 className="font-fraunces mt-3 text-[24px] font-black leading-tight">{p.title}</h3>
                <p className={`mt-2 text-[14px] leading-relaxed ${p.color.startsWith("bg-ink") ? "text-paper/65" : "text-ink/60"}`}>{p.desc}</p>
                <p className={`mt-4 flex items-center gap-2 text-[13px] font-bold ${p.color.startsWith("bg-ink") ? "text-gold" : "text-clay"}`}>
                  <CircleCheck className="h-4 w-4" /> {p.check}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid lg:grid-cols-[1fr_1fr] gap-4">
          {/* test interactivo */}
          <Reveal>
            <div className="h-full rounded-[24px] bg-ink text-paper p-6 sm:p-8 grain-light relative overflow-hidden">
              <div className="relative">
                <p className="font-jbmono text-[11px] uppercase tracking-[0.22em] text-gold">Test de 5 segundos · tócalo</p>
                <h3 className="font-fraunces mt-2 text-2xl sm:text-3xl font-black">¿Es para ti? Marca y sal de dudas.</h3>
                <div className="mt-5 space-y-2.5">
                  {TEST.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setMarks((m) => m.map((v, j) => (j === i ? !v : v)))}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[14px] font-medium transition ${marks[i] ? "border-gold/60 bg-paper/[0.08]" : "border-paper/12 hover:border-paper/30"}`}
                    >
                      {marks[i] ? <CircleCheck className="h-5 w-5 shrink-0 text-gold" /> : <Circle className="h-5 w-5 shrink-0 text-paper/30" />}
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl bg-paper/[0.07] border border-paper/12 p-4">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((s) => (
                      <span key={s} className={`h-2 flex-1 rounded-full transition-all ${score > s ? "bg-gold" : "bg-paper/15"}`} />
                    ))}
                  </div>
                  <p className="mt-2.5 text-[14.5px]">
                    {score === 3 && <><span className="font-bold text-gold">🎯 3/3 — Definitivamente.</span> Esta app se hizo para ti. Descárgala y publica hoy.</>}
                    {score === 2 && <><span className="font-bold text-gold">✓ 2/3 — Sí, es para ti.</span> Con dos ya te ahorra horas al mes.</>}
                    {score <= 1 && <span className="text-paper/65">Solo {score}/3… quizá aún no subrayas mucho. Guarda la página: cuando tu Kindle se llene, vuelve.</span>}
                  </p>
                  {score >= 2 && (
                    <button onClick={onStart} className="mt-3 flex items-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-bold text-white transition hover:bg-clay-deep">
                      Descargar la app <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
          {/* no es para */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-between rounded-[24px] border border-dashed border-ink/25 bg-paper p-6 sm:p-8">
              <div>
                <p className="flex items-center gap-2 font-jbmono text-[11px] uppercase tracking-[0.22em] text-ink/50"><Ban className="h-4 w-4" /> Honestidad: no es para todo el mundo</p>
                <h3 className="font-fraunces mt-2 text-2xl sm:text-3xl font-black">¿Cuándo NO usar CitandoAndo?</h3>
                <ul className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-ink/65">
                  <li className="flex gap-2.5"><span className="font-bold text-ink">✕</span> <span>Si buscas <strong>leer o editar ebooks</strong>: esto no es un lector, solo convierte citas en imágenes.</span></li>
                  <li className="flex gap-2.5"><span className="font-bold text-ink">✕</span> <span>Si quieres <strong>guardar en la nube</strong> y sincronizar entre dispositivos: aquí todo es local a propósito.</span></li>
                  <li className="flex gap-2.5"><span className="font-bold text-ink">✕</span> <span>Si <strong>nunca subrayas nada</strong>: no hay magia sin materia prima. Vuelve cuando empieces.</span></li>
                </ul>
              </div>
              <p className="font-instrument mt-6 rounded-2xl bg-gold-soft/70 p-4 text-[16px] italic leading-snug">
                “Prefiero decirte a quién no sirve que venderte humo. Si subrayas aunque sea un poco, te va a encantar.”
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
