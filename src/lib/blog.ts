import { blogPosts, type BlogPost } from '@/data/blogData';

export const CATEGORIES = ['Todos', 'Libros', 'Guías', 'Tutoriales', 'Tendencias'] as const;
export type Category = Exclude<(typeof CATEGORIES)[number], 'Todos'>;

export const CAT_STYLE: Record<Category, string> = {
  Libros: 'bg-clay-deep text-white',
  Guías: 'bg-forest text-sage',
  Tutoriales: 'bg-ink text-paper',
  Tendencias: 'bg-gold text-ink',
};

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2024-01-20" -> "20 ene 2024" (sin Date, para evitar desajustes de zona horaria/hidratación). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function readMinutes(readTime: string): number {
  const n = parseInt(readTime, 10);
  return Number.isFinite(n) ? n : 5;
}

export function categoryOf(post: BlogPost): Category {
  const t = post.tags[0];
  return (['Libros', 'Guías', 'Tutoriales', 'Tendencias'] as const).includes(t as Category) ? (t as Category) : 'Libros';
}

/** Datos livianos para las tarjetas (sin el HTML del artículo). */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  read: number;
  cover?: string;
  tags: string[];
}

export function toSummary(post: BlogPost): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.description,
    category: categoryOf(post),
    date: formatDate(post.date),
    read: readMinutes(post.readTime),
    cover: post.coverImage,
    tags: post.tags,
  };
}

export function allSummaries(): PostSummary[] {
  return blogPosts.map(toSummary);
}

export function relatedSummaries(slug: string, n = 3): PostSummary[] {
  return allSummaries().filter((p) => p.slug !== slug).slice(0, n);
}

/**
 * Convierte cada par "<h2>N. Autor – Libro</h2><p class="...border-l-4...">frase</p>"
 * en una tarjeta de cita con la marca (misma estética que las imágenes de la app).
 */
export function enhanceContent(html: string): string {
  const re = /<h2>\s*([^<]*?)\s+[–—-]\s+([^<]*?)\s*<\/h2>\s*<p class="[^"]*border-l-4[^"]*">([\s\S]*?)<\/p>/g;
  const icon =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M7.2 6C4.9 6 3 7.9 3 10.2c0 2.2 1.6 4 3.7 4.2-.2 1.4-1 2.5-2.4 3.2l.7 1.4c3-1.2 4.7-3.5 4.7-6.9V10c0-2.3-1.2-4-2.5-4zm9.5 0c-2.3 0-4.2 1.9-4.2 4.2 0 2.2 1.6 4 3.7 4.2-.2 1.4-1 2.5-2.4 3.2l.7 1.4c3-1.2 4.7-3.5 4.7-6.9V10c0-2.3-1.2-4-2.5-4z"/></svg>';
  return html.replace(re, (_m, author: string, book: string, quote: string) =>
    `<div class="quote-card">` +
    `<div class="quote-card__brand"><span class="quote-card__icon">${icon}</span><span class="quote-card__name">Citando<em>Ando</em></span></div>` +
    `<h2 class="quote-card__title">${author} <span>– ${book}</span></h2>` +
    `<p class="quote-card__text">${quote.trim()}</p>` +
    `</div>`
  );
}
