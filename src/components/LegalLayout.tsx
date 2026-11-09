import Link from 'next/link';
import Logo from '@/components/Logo';

export const SUPPORT_EMAIL = 'citando.ando.app@gmail.com';

export default function LegalLayout({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white font-display text-[#140d1c]">
            <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-primary/10 px-6 lg:px-40 py-4">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Logo size={32} className="group-hover:scale-105 transition-transform" />
                        <span className="text-xl font-extrabold tracking-tight">CitandoAndo</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-bold">
                        <Link href="/soporte" className="hover:text-primary transition-colors">Soporte</Link>
                        <Link href="/privacidad" className="hover:text-primary transition-colors">Privacidad</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12 lg:py-20">
                <h1 className="text-4xl font-black tracking-tight mb-3">{title}</h1>
                {updated && <p className="text-sm text-slate-500 mb-10">Última actualización: {updated}</p>}
                <div className="space-y-5 text-[17px] leading-relaxed text-slate-700 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#140d1c] [&_h2]:mt-10 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:font-bold [&_a]:underline">
                    {children}
                </div>
            </main>

            <footer className="border-t border-slate-100 px-6 py-8 text-center text-sm text-slate-500">
                © {new Date().getFullYear()} CitandoAndo ·{' '}
                <Link href="/soporte" className="underline">Soporte</Link> ·{' '}
                <Link href="/privacidad" className="underline">Privacidad</Link>
            </footer>
        </div>
    );
}
