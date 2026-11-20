/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ArrowLeft, BookOpen, CalendarDays, Clock3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogData';
import { Metadata } from 'next';
import BlogShareFooter from '@/components/BlogShareFooter';
import BlogShell from '@/components/blog/BlogShell';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareBox from '@/components/blog/ShareBox';
import PostCard from '@/components/blog/PostCard';
import { SmartDownloadButton } from '@/components/landing/Download';
import BrandIcon from '@/components/landing/BrandIcon';
import { CAT_STYLE, categoryOf, enhanceContent, formatDate, readMinutes, relatedSummaries } from '@/lib/blog';
import { blogPostingLd, breadcrumbLd, jsonLdString } from '@/lib/seo';

// Esta función permite generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
    if (!post) return { title: 'Post no encontrado' };

    return {
        title: `${post.title} | Blog CitandoAndo`,
        description: post.description,
        keywords: post.tags,
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            url: `/blog/${post.slug}`,
            tags: post.tags,
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            authors: ['Danidev'],
            images: post.coverImage ? [post.coverImage] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: post.coverImage ? [post.coverImage] : undefined,
        },
    };
}

// Esta función genera las rutas estáticas al hacer build
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

const OUTLANDER_QUOTES = [
    {
        text: "—Mmmfm. Sí, estamos casados, es cierto. Pero no será una unión legal hasta que no se haya consumado.",
        author: "Jamie Fraser",
        source: "Forastera"
    },
    {
        text: "Aunque demasiado ávido y demasiado torpe para demostrar ternura, de todos modos hacía el amor con una especie de alegría incansable...",
        author: "Claire Fraser",
        source: "Forastera"
    },
    {
        text: "Soy tuyo, decía. Y si quieres tenerme, entonces...",
        author: "Claire Fraser",
        source: "Forastera"
    },
    {
        text: "Eres mía, mo duinne. Solamente mía. Ahora y siempre. Mía. Lo quieras o no.",
        author: "Jamie Fraser",
        source: "Escrito con la sangre de mi corazón"
    },
    {
        text: "¿Se acaba alguna vez... este deseo por ti? Incluso después de tenerte te deseo tanto, que me cuesta respirar...",
        author: "Jamie Fraser",
        source: "Forastera"
    },
    {
        text: "No he dicho que quisiera una disculpa, ¿verdad? Si mal no recuerdo, lo que he dicho ha sido: 'Muérdeme otra vez'.",
        author: "Jamie Fraser",
        source: "Forastera"
    },
    {
        text: "Cuando te penetro con fiereza y ansiedad y gimes y forcejeas como si quisieras apartarte, pero sé que sólo pugnas por acercarte más...",
        author: "Jamie Fraser",
        source: "Forastera"
    },
    {
        text: "Dije que era virgen, no un monje. Si siento que necesito ayuda, te la pediré.",
        author: "Jamie Fraser",
        source: "Forastera"
    },
    {
        text: "Si yo fuera un caballo, le dejaría llevarme a cualquier parte.",
        author: "Claire Fraser",
        source: "Forastera"
    },
    {
        text: "Deseo abrazarte fuerte y besarte y no soltarte nunca. Quiero llevarte a mi cama y usarte...",
        author: "Jamie Fraser",
        source: "Forastera"
    }
];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

    if (!post) {
        notFound();
    }

    const customQuotes = post.slug === 'cronologia-outlander' ? OUTLANDER_QUOTES : undefined;
    const category = categoryOf(post);
    const related = relatedSummaries(post.slug, 3);

    const structuredData = [
        blogPostingLd(post),
        breadcrumbLd([
            { name: 'Inicio', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
        ]),
    ];

    return (
        <BlogShell>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
            <ReadingProgress />
            <article className="bg-paper">
                {/* Hero */}
                <div className="relative overflow-hidden bg-forest">
                    {post.coverImage && (
                        <img src={post.coverImage} alt={post.title} className="h-[300px] w-full object-cover sm:h-[420px]" />
                    )}
                    {!post.coverImage && <div className="h-[300px] sm:h-[420px]" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0">
                        <div className="mx-auto max-w-3xl px-4 pb-7 sm:px-6 sm:pb-9">
                            <Link href="/blog" className="mb-4 inline-flex items-center gap-2 rounded-full border border-paper/20 bg-paper/15 px-4 py-2 text-[13px] font-bold text-paper backdrop-blur transition hover:bg-paper/25">
                                <ArrowLeft className="h-4 w-4" /> Volver al blog
                            </Link>
                            <div>
                                <span className={`inline-block rounded-full px-3.5 py-1.5 font-jbmono text-[10.5px] font-bold uppercase tracking-[0.16em] ${CAT_STYLE[category]}`}>
                                    {category}
                                </span>
                            </div>
                            <h1 className="font-fraunces mt-3 text-4xl font-black leading-[0.98] tracking-tight text-paper sm:text-[52px]">{post.title}</h1>
                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-paper/70">
                                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(post.date)}</span>
                                <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{readMinutes(post.readTime)} min de lectura</span>
                                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />Por el equipo CitandoAndo</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
                    <p className="font-instrument border-l-4 border-clay pl-5 text-[20px] italic leading-[1.6] text-ink/80">{post.description}</p>

                    {/* Contenido (HTML propio del blog) */}
                    <div className="blog-prose mt-8" dangerouslySetInnerHTML={{ __html: enhanceContent(post.content) }} />

                    {/* CTA */}
                    <div className="grain-light relative mt-10 overflow-hidden rounded-[22px] bg-ink p-7 text-center text-paper sm:p-8">
                        <div className="relative flex flex-col items-center">
                            <BrandIcon size={44} />
                            <p className="font-fraunces mt-3 max-w-md text-2xl font-black leading-tight">Convierte estas ideas en imágenes con CitandoAndo</p>
                            <p className="mt-2 text-[14px] text-paper/60">Gratis · Solo en App Store · Sin registro</p>
                            <div className="mt-5"><SmartDownloadButton /></div>
                        </div>
                    </div>

                    <BlogShareFooter customQuotes={customQuotes} />
                    <ShareBox title={post.title} />

                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <span key={t} className="rounded-full bg-ink/[0.06] px-3.5 py-1.5 font-jbmono text-[11px] uppercase tracking-widest text-ink/55">#{t}</span>
                        ))}
                    </div>
                </div>

                {/* Relacionados */}
                {related.length > 0 && (
                    <div className="border-t border-ink/10 bg-paper-2/50 py-12">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6">
                            <h2 className="font-fraunces text-3xl font-black tracking-tight sm:text-4xl">Sigue <span className="italic font-light text-clay">leyendo.</span></h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {related.map((p, i) => (
                                    <PostCard key={p.slug} post={p} delay={i * 90} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </BlogShell>
    );
}
