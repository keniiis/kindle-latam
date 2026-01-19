import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blogData';

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
    const posts: MetadataRoute.Sitemap = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [...routes, ...posts];
}
