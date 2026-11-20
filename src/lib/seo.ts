// Utilidades SEO: datos estructurados (JSON-LD) compartidos por las páginas.
import type { BlogPost } from '@/data/blogData';
import { APP_CONFIG } from '@/lib/landing/download';

export const SITE_URL = APP_CONFIG.WEB_URL;
export const SITE_NAME = APP_CONFIG.name;

/** Convierte rutas relativas ("/x.png") en URL absolutas, como exige schema.org. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

/** Serializa JSON-LD escapando "<" para que el contenido no pueda cerrar la etiqueta <script>. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl('/icon.png'),
  email: APP_CONFIG.CONTACT_EMAIL,
  sameAs: [APP_CONFIG.APPLE_URL],
};

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'es',
  publisher: { '@id': ORGANIZATION_ID },
};

export function blogPostingLd(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: post.title,
    description: post.description,
    image: post.coverImage ? [absoluteUrl(post.coverImage)] : [absoluteUrl('/opengraph-image.png')],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'es',
    keywords: post.tags.join(', '),
    articleSection: post.tags[0],
    author: { '@type': 'Organization', name: `Equipo ${SITE_NAME}`, url: SITE_URL },
    publisher: { '@id': ORGANIZATION_ID, '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.png') } },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function blogIndexLd(posts: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: `Blog de ${SITE_NAME}`,
    description: 'Artículos sobre lectura, organización de citas, Kindle y trucos para lectores ávidos.',
    inLanguage: 'es',
    publisher: { '@id': ORGANIZATION_ID },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };
}
