import { blogPosts, type BlogPost } from '@/data/blogData';

export const CATEGORIES = ['Todos', 'Libros', 'Guías', 'Tutoriales', 'Tendencias'] as const;
export type Category = Exclude<(typeof CATEGORIES)[number], 'Todos'>;

export const CAT_STYLE: Record<Category, string> = {
  Libros: 'bg-clay text-white',
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
