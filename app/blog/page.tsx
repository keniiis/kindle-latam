
import Link from 'next/link';
import { blogPosts } from '@/data/blogData';
import { Metadata } from 'next';
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Blog | CitandoAndo',
    description: 'Artículos sobre lectura, organización de citas, Kindle y trucos para lectores ávidos.',
};

export default function BlogIndex() {
    return (
        <div className="min-h-screen bg-white font-display text-[#140d1c]">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-primary/10 px-6 lg:px-40 py-4">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">CitandoAndo</h2>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link href="/" className="bg-[#140d1c] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-primary transition-colors shadow-lg hover:translate-y-px">
                            Ir a la App
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20">
                <div className="max-w-2xl mb-16">
                    <h1 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">El Blog del Lector</h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Consejos, guías y curiosidades para sacar el máximo partido a tus lecturas y organizar tu conocimiento.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {blogPosts.map((post) => (
                        <article key={post.slug} className="group flex flex-col h-full bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
                            <Link href={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/10] relative">
                                {post.coverImage ? (
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                                        <BookOpen size={48} className="text-purple-300" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide">
                                    {post.tags[0] || 'Artículo'}
                                </div>
                            </Link>

                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-purple-400" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-purple-400" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>

                                <Link href={`/blog/${post.slug}`} className="block mb-3">
                                    <h3 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                </Link>

                                <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                                    {post.description}
                                </p>

                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="font-bold text-primary hover:text-purple-700 inline-flex items-center gap-1 text-sm uppercase tracking-wide"
                                >
                                    Leer artículo <ArrowLeft size={16} className="rotate-180" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 py-12 mt-20">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} CitandoAndo. Hecho con 💜 para lectores.</p>
                </div>
            </footer>
        </div>
    );
}
