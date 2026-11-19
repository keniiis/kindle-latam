/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";
import { Reveal } from "@/components/landing/Hero";
import { CAT_STYLE, type PostSummary } from "@/lib/blog";

export default function PostCard({ post, delay = 0 }: { post: PostSummary; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-ink/12 bg-white text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-20px_rgba(22,17,11,0.3)]"
      >
        <span className="relative block aspect-[16/9] overflow-hidden bg-paper-2">
          {post.cover ? (
            <img src={post.cover} alt={post.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          ) : (
            <span className="grid h-full w-full place-items-center"><BookOpen className="h-10 w-10 text-ink/25" /></span>
          )}
          <span className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 font-jbmono text-[10px] font-bold uppercase tracking-[0.16em] ${CAT_STYLE[post.category]}`}>
            {post.category}
          </span>
        </span>
        <span className="flex flex-1 flex-col p-5 sm:p-6">
          <span className="flex items-center gap-3 font-jbmono text-[11px] uppercase tracking-widest text-ink/45">
            <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{post.read} min</span>
          </span>
          <span className="font-fraunces mt-2.5 text-[21px] font-black leading-tight transition-colors group-hover:text-clay">{post.title}</span>
          <span className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink/60">{post.excerpt}</span>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13.5px] font-bold text-clay">
            Leer artículo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </Reveal>
  );
}
