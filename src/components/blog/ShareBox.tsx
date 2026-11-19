"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

export default function ShareBox({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = () => (typeof window !== "undefined" ? window.location.href : "");
  const text = `${title} — vía CitandoAndo`;

  function copy() {
    navigator.clipboard?.writeText(url()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className="mt-10 flex flex-wrap items-center gap-2.5 rounded-2xl border border-ink/12 bg-white/70 p-4">
      <span className="flex items-center gap-2 text-[14px] font-bold"><Share2 className="h-4 w-4" /> ¿Te ha gustado? Compártelo:</span>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url())}`, "_blank", "noopener")}
        className="rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-paper transition hover:bg-clay"
      >X</button>
      <button
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url()}`)}`, "_blank", "noopener")}
        className="rounded-full bg-forest px-4 py-2 text-[13px] font-bold text-white transition hover:opacity-90"
      >WhatsApp</button>
      <button onClick={copy} className="flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-[13px] font-bold transition hover:border-ink">
        {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}
