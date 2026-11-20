"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Reveal } from "@/components/landing/Hero";
import PostCard from "./PostCard";
import { CATEGORIES, CAT_STYLE, type PostSummary } from "@/lib/blog";

export default function BlogIndexClient({ posts }: { posts: PostSummary[] }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const filtered = useMemo(() => (cat === "Todos" ? posts : posts.filter((p) => p.category === cat)), [cat, posts]);
  const [featured, ...rest] = filtered;

  return (
    <section className="relative overflow-hidden bg-paper py-14 sm:py-20 grain">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-clay/10 blur-[110px]" />
        <div className="absolute inset-0 dot-grid opacity-30 [mask-image:radial-gradient(70%_50%_at_50%_10%,black,transparent)]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-jbmono text-[11px] uppercase tracking-[0.24em] text-clay-text">● El Blog del Lector</p>
              <h1 className="font-fraunces mt-2 text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
                Lee mejor.<br /><span className="italic font-light text-clay">Comparte mejor.</span>
              </h1>
            </div>
            <p className="max-w-sm text-[15px] text-ink/60">Consejos, guías y curiosidades para sacar el máximo partido a tus lecturas y a tus subrayados.</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-7 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                className={`rounded-full px-5 py-2.5 text-[13px] font-bold transition ${
                  cat === c ? "bg-ink text-paper shadow-lg" : "border border-ink/15 bg-white/60 hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {featured && (
          <Reveal delay={140}>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-6 grid w-full overflow-hidden rounded-[26px] border border-ink/12 bg-ink text-left text-paper transition hover:shadow-[0_40px_80px_-30px_rgba(20,16,12,0.6)] lg:grid-cols-2"
            >
              <span className="relative block min-h-[240px] overflow-hidden bg-forest">
                {featured.cover ? (
                  <img src={featured.cover} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center"><BookOpen className="h-12 w-12 text-paper/30" /></span>
                )}
                <span className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 font-jbmono text-[10.5px] font-bold uppercase tracking-[0.16em] ${CAT_STYLE[featured.category]}`}>
                  ★ Destacado · {featured.category}
                </span>
              </span>
              <span className="flex flex-col justify-center p-7 sm:p-10">
                <span className="flex items-center gap-3 font-jbmono text-[11px] uppercase tracking-widest text-paper/70">
                  <span>{featured.date}</span>·<span>{featured.read} min de lectura</span>
                </span>
                <span className="font-fraunces mt-3 text-3xl font-black leading-[1.02] sm:text-4xl">{featured.title}</span>
                <span className="mt-3 max-w-md text-[15px] leading-relaxed text-paper/65">{featured.excerpt}</span>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-bold text-white transition group-hover:bg-clay-deep">
                  Leer artículo <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </Reveal>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <PostCard key={p.slug} post={p} delay={(i % 3) * 90} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-ink/20 p-8 text-center text-ink/70">Nada por aquí todavía en esta categoría.</p>
        )}
      </div>
    </section>
  );
}
