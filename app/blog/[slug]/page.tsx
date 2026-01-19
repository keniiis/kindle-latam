import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogData';
import { Metadata } from 'next';
import BlogShareFooter from '@/components/BlogShareFooter';

// Esta función permite generar metadatos dinámicos para SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = blogPosts.find((p) => p.slug === resolvedParams.slug);
    if (!post) return { title: 'Post no encontrado' };

    return {
        title: `${post.title} | Blog CitandoAndo`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            authors: ['Danidev'],
        }
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

    return (
        <main className="min-h-screen bg-white font-sans selection:bg-purple-100">
            {/* Header / Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-[800px] mx-auto grid grid-cols-3 items-center">
                    {/* Left: Volver */}
                    <Link href="/blog" className="justify-self-start flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm">
                        <ArrowLeft size={18} />
                        Volver al Blog
                    </Link>

                    {/* Center: Logo */}
                    <div className="justify-self-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white group-hover:rotate-3 transition-transform">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-slate-900">
                                CitandoAndo
                            </span>
                        </Link>
                    </div>

                    {/* Right: CTA */}
                    <div className="justify-self-end">
                        <Link href="/" className="bg-[#140d1c] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-primary transition-colors shadow-lg hover:translate-y-px">
                            Ir a la App
                        </Link>
                    </div>
                </div>
            </nav>

            <article className="max-w-[800px] mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Cabecera del Artículo */}
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight text-balance">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-slate-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            {post.readTime}
                        </div>
                    </div>
                </header>

                {/* Imagen de Portada */}
                {post.coverImage && (
                    <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-video relative">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}

                {/* Contenido (Renderizado de HTML seguro) */}
                <div
                    className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
                <BlogShareFooter customQuotes={customQuotes} />
            </article>

            {/* Newsletter / CTA Footer */}
            <section className="bg-slate-50 py-16 px-6 mt-0 border-t border-slate-100">
                <div className="max-w-xl mx-auto text-center space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900">¿Te gustó el artículo?</h3>
                    <p className="text-slate-600">
                        CitandoAndo es una herramienta gratuita para lectores. Si te sirvió, considera usar nuestra app para guardar tus frases favoritas de Outlander.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/10"
                    >
                        Ir a la App
                    </Link>
                </div>
            </section>
        </main >
    );
}
