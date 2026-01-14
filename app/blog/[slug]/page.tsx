import { BLOG_POSTS } from '@/data/blogPosts';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, BookOpen, Share2, Quote } from 'lucide-react';
import { notFound } from 'next/navigation';
import BlogShareFooter from '@/components/BlogShareFooter';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

// Generar rutas estáticas para todos los posts en build time (importante para exportación estática si se usa)
export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) return { title: 'Post no encontrado' };

    return {
        title: `${post.title} | Blog CitandoAndo`,
        description: post.excerpt,
        authors: [{ name: post.author }],
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `/blog/${post.slug}`,
            siteName: 'CitandoAndo',
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            locale: 'es_LA',
            type: 'article',
            publishedTime: post.date, // Note: post.date might need formatting if strict ISO is required, but string is okay for basic OG
            authors: [post.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.coverImage],
            creator: '@devdanipena', // Or generic app handle
        },
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white font-display text-[#140d1c]">
            {/* Header Simplificado */}
            <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-[800px] mx-auto flex items-center justify-between relative">
                    <Link href="/blog" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm z-10">
                        <ArrowLeft size={18} />
                        <span className="hidden sm:inline">Volver al Blog</span>
                        <span className="sm:hidden">Blog</span>
                    </Link>

                    <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 group">
                        <div className="size-6 bg-primary rounded flex items-center justify-center text-white">
                            <BookOpen size={14} />
                        </div>
                        <span className="font-extrabold tracking-tight text-sm hidden sm:inline">CitandoAndo</span>
                    </Link>

                    <div className="z-10">
                        <Link href="/" className="bg-[#140d1c] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-primary transition-colors shadow-lg hover:translate-y-px">
                            Ir a la App
                        </Link>
                    </div>
                </div>
            </header>

            <article className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
                {/* Meta Header */}
                <div className="mb-8 text-center">
                    <div className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        {post.category}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 tracking-tight text-slate-900">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                                <BookOpen size={16} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-slate-700">{post.author}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>{post.date}</span>
                        </div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-12 bg-slate-100">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg md:prose-xl prose-slate mx-auto prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Share / Footer Article */}
                {/* Dynamic Share Footer */}
                <BlogShareFooter />
            </article>

            {/* CTA App */}
            <div className="bg-[#1a1520] text-white py-16 md:py-24 mt-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] rounded-full"></div>

                <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">¿Tus citas de Kindle siguen cogiendo polvo?</h2>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto">
                        Convierte ese caos de "My Clippings.txt" en una galería visual preciosa en segundos. Sin registros. Gratis.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-black text-lg shadow-xl shadow-white/10 hover:scale-105 transition-transform"
                    >
                        <BookOpen size={24} />
                        Probar CitandoAndo ahora
                    </Link>
                </div>
            </div>
        </div>
    );
}
