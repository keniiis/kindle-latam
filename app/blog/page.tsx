import { Metadata } from 'next';
import BlogShell from '@/components/blog/BlogShell';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { allSummaries } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog | CitandoAndo',
    description: 'Artículos sobre lectura, organización de citas, Kindle y trucos para lectores ávidos.',
};

export default function BlogIndex() {
    return (
        <BlogShell>
            <BlogIndexClient posts={allSummaries()} />
        </BlogShell>
    );
}
