import { Metadata } from 'next';
import BlogShell from '@/components/blog/BlogShell';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { allSummaries } from '@/lib/blog';
import { blogPosts } from '@/data/blogData';
import { blogIndexLd, breadcrumbLd, jsonLdString } from '@/lib/seo';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Artículos sobre lectura, organización de citas, Kindle y trucos para lectores ávidos.',
    alternates: { canonical: '/blog' },
    openGraph: {
        title: 'Blog de CitandoAndo',
        description: 'Artículos sobre lectura, organización de citas, Kindle y trucos para lectores ávidos.',
        url: '/blog',
        type: 'website',
    },
};

const structuredData = [
    blogIndexLd(blogPosts),
    breadcrumbLd([
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
    ]),
];

export default function BlogIndex() {
    return (
        <BlogShell>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
            <BlogIndexClient posts={allSummaries()} />
        </BlogShell>
    );
}
