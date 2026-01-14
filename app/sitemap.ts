import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://citando-ando.vercel.app';

    // Rutas estáticas
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    // Rutas dinámicas del blog
    const posts = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(), // Idealmente esto vendría de la fecha del post, pero new Date() es válido
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...posts];
}
