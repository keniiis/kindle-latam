'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Usb, Quote, Share2, UploadCloud, CheckCircle2, Smartphone, Shield, Zap, Palette, Monitor, Folder, Lock, Image as ImageIcon, HeartHandshake, Twitter, Pencil, Download } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
    onManualEntry: () => void;
}

export default function LandingPage({ onStart, onManualEntry }: LandingPageProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            // Si no se puede instalar (o ya está instalada/es iOS), ejecutamos la acción por defecto
            onStart();
        }
    };

    return (
        <div className="bg-background-light font-display text-[#140d1c] transition-colors duration-300">

            {/* HEADER LANDING */}
            <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b border-primary/10 px-6 lg:px-40 py-3">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <BookOpen size={20} />
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">CitandoAndo</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#como-funciona">Cómo funciona</a>
                        <a className="text-sm font-semibold hover:text-primary transition-colors" href="#features">Beneficios</a>
                    </nav>
                    <button
                        onClick={handleInstallClick}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        {deferredPrompt ? <Download size={18} /> : null}
                        {deferredPrompt ? 'Instalar App' : 'Abrir App'}
                    </button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto">

                {/* HERO SECTION */}
                <section className="px-6 lg:px-20 py-16 md:py-24 min-h-[80vh] flex items-center">
                    <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-6">
                                <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-bold w-fit uppercase tracking-widest shadow-sm border border-purple-200">
                                    Beta abierta
                                </span>
                                <h1 className="text-5xl lg:text-7xl font-black leading-[1.0] tracking-tight text-[#140d1c]">
                                    Tus lecturas <br className="hidden lg:block" />
                                    merecen ser <br className="hidden lg:block" />
                                    <span className="text-primary">compartidas</span>
                                </h1>
                                <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg font-medium">
                                    Transforma tus highlights de Kindle en arte listo para tus redes sociales en segundos. Sin descargas.
                                </p>
                            </div>

                            {/* Avatares (Oculto temporalmente)
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
                                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                                    ].map((img, i) => (
                                        <div key={i} className="size-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={img} alt="Usuario" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => <div key={s} className="size-3 text-yellow-400 fill-yellow-400">★</div>)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 mt-1">+2k lectores ya lo usan</span>
                                </div>
                            </div>
                            */}
                        </div>

                        {/* HERO UPLOAD ZONE */}
                        <div className="relative w-full max-w-md mx-auto lg:max-w-none group perspective-1000">
                            {/* Glow Effect - Matches reference purple haze */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                            <div
                                onClick={onStart}
                                className="relative bg-white rounded-[2.5rem] border border-white/50 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-transform duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_80px_-20px_rgba(147,51,234,0.15)] bg-gradient-to-br from-white to-purple-50/30"
                            >
                                {/* Upload Icon Circle */}
                                <div className="size-24 bg-[#A855F7] rounded-full flex items-center justify-center text-white mb-8 shadow-xl shadow-purple-500/30 group-hover:scale-110 -translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                    <UploadCloud size={44} strokeWidth={2.5} />
                                </div>

                                {/* Main Title */}
                                <h3 className="text-3xl font-black text-[#0f0a16] mb-3 tracking-tight">Sube tu archivo</h3>

                                {/* Subtitle with Code Style */}
                                <p className="text-slate-600 font-medium mb-8 max-w-[260px] leading-relaxed text-sm">
                                    Arrastra tu <code className="font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded border border-purple-100/50">My Clippings.txt</code> o haz clic para buscarlo.
                                </p>

                                {/* Platform Tags */}
                                <div className="flex items-center justify-center gap-3 mb-10">
                                    {['KINDLE', 'KOBO', 'POCKET'].map((tag, i) => (
                                        <div key={tag} className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500/80 uppercase hover:text-purple-500 transition-colors">{tag}</span>
                                            {i < 2 && <div className="size-1 rounded-full bg-purple-200"></div>}
                                        </div>
                                    ))}
                                </div>

                                {/* Manual Entry Button Section */}
                                <div className="mt-2 space-y-3 w-full">
                                    <p className="text-xs font-bold text-slate-500">¿No tienes archivo?</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onManualEntry(); }}
                                        className="w-full flex items-center justify-center gap-2 border border-purple-200 hover:border-purple-300 bg-purple-50/50 hover:bg-purple-50 text-purple-600 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5"
                                    >
                                        <Pencil size={16} />
                                        <span>Crear manualmente</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="px-6 py-20" id="como-funciona">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Comparte en 3 simples pasos</h2>
                        <p className="text-lg opacity-70">Olvídate de capturas de pantalla feas y texto plano.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { num: 1, title: 'Conecta tu Kindle', text: 'Sincroniza tus notas vía USB o correo electrónico de forma segura.', icon: Usb },
                            { num: 2, title: 'Elige tu cita', text: 'Navega por tus libros y selecciona el fragmento que más te inspiró.', icon: Quote },
                            { num: 3, title: 'Comparte en IG', text: 'Personaliza el diseño y expórtalo directamente a tus historias.', icon: Share2 }
                        ].map((step) => (
                            <div key={step.num} className="group bg-white p-8 rounded-2xl border border-primary/10 hover:border-primary/40 transition-all shadow-sm">
                                <div className="size-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 font-black text-2xl group-hover:bg-primary group-hover:text-white transition-colors">{step.num}</div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="opacity-70 leading-relaxed mb-6">{step.text}</p>
                                <div className="w-full h-32 bg-background-light rounded-xl flex items-center justify-center text-primary/20">
                                    <step.icon size={48} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PLAYGROUND INTERACTIVO (PREVIEW SECTION) */}
                <section className="px-6 py-20" id="preview">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="mb-14">
                            <h2 className="text-4xl md:text-5xl font-black mb-4">Playground Interactivo</h2>
                            <p className="text-lg opacity-60 md:w-1/2">
                                El estudio creativo donde tus lecturas cobran vida. Personaliza cada detalle y previsualiza en tiempo real.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16 items-start">
                            {/* Panel de Controles */}
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-6">Presets de Estilo</h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: 'Minimalist',
                                                desc: 'Elegancia pura en blanco y negro.',
                                                icon: <div className="size-6 border-2 border-slate-800 bg-white"></div>,
                                                active: false
                                            },
                                            {
                                                name: 'Vibrant Gradient',
                                                desc: 'Colores fluidos para redes modernas.',
                                                icon: <div className="size-6 rounded bg-gradient-to-br from-purple-400 to-indigo-600"></div>,
                                                active: true
                                            },
                                            {
                                                name: 'Dark Mode',
                                                desc: 'Estilo nocturno sofisticado.',
                                                icon: <div className="size-6 rounded bg-slate-900 border border-slate-700"></div>,
                                                active: false
                                            },
                                            {
                                                name: 'Classic Paper',
                                                desc: 'Textura de libro antiguo.',
                                                icon: <div className="size-6 rounded bg-[#f5e6d3] border border-[#d4c5b0]"></div>,
                                                active: false
                                            },
                                            {
                                                name: 'Neon Nights',
                                                desc: 'Contraste cyberpunk de alta tecnología.',
                                                icon: <div className="size-6 rounded bg-black border border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>,
                                                active: false
                                            }
                                        ].map((style) => (
                                            <div
                                                key={style.name}
                                                className={`
                                                  group p-4 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-5 border-2
                                                  ${style.active ? 'bg-white border-primary shadow-xl shadow-primary/10 scale-[1.02]' : 'bg-white border-transparent hover:border-slate-100 hover:shadow-lg'}
                                                `}
                                            >
                                                <div className="shrink-0">{style.icon}</div>
                                                <div className="flex-1">
                                                    <h4 className={`font-bold text-base ${style.active ? 'text-primary' : 'text-slate-800'}`}>{style.name}</h4>
                                                    <p className="text-xs text-slate-500 font-medium mt-0.5">{style.desc}</p>
                                                </div>
                                                {style.active && (
                                                    <div className="bg-primary text-white rounded-full p-1 shadow-md animate-in fade-in zoom-in">
                                                        <CheckCircle2 size={14} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Personalización Rápida */}
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                                    <h3 className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-6">Personalización Rápida</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-3 block">Acento de Color</label>
                                            <div className="flex gap-3">
                                                {['#8c25f4', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'].map((color) => (
                                                    <div key={color} className="size-8 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: color }}></div>
                                                ))}
                                                <button className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                                                    <span className="text-xs">+</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="font-serif text-lg italic font-bold">Tt</div>
                                                <span className="text-sm font-bold text-slate-700">Fuente Serif</span>
                                            </div>
                                            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 bg-white size-4 rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* MOCKUP DEL TELÉFONO */}
                            <div className="relative flex justify-center lg:justify-end py-10 lg:py-0">
                                {/* Fondos decorativos abstractos detrás del teléfono */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-100 via-pink-50 to-blue-50 blur-3xl opacity-60 rounded-full -z-10"></div>

                                <div className="relative w-[320px] h-[650px] bg-[#1a1a1a] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.5)] border-[8px] border-[#1a1a1a] ring-1 ring-white/10 overflow-hidden">
                                    {/* Notch */}
                                    <div className="absolute top-0 inset-x-0 h-7 bg-[#1a1a1a] z-50 rounded-b-2xl w-40 mx-auto"></div>

                                    {/* CONTENIDO PANTALLA */}
                                    <div className="w-full h-full bg-gradient-to-br from-[#8c25f4] to-[#6d28d9] flex flex-col relative text-white">

                                        {/* Elementos decorativos en pantalla */}
                                        <div className="absolute top-20 left-10 opacity-20">
                                            <Quote size={40} fill="currentColor" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center px-10 relative z-10">
                                            <p className="font-serif italic text-2xl md:text-3xl leading-relaxed font-medium drop-shadow-sm">
                                                "La lectura de todos los buenos libros es como una conversación con las mejores mentes de los siglos pasados."
                                            </p>
                                        </div>

                                        <div className="pb-16 px-10 text-center relative z-10">
                                            <div className="w-10 h-0.5 bg-white/30 mx-auto mb-6"></div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">René Descartes</p>
                                            <p className="text-[9px] opacity-60 font-medium">Discurso del método</p>
                                        </div>

                                        {/* Footer de la app en pantalla */}
                                        <div className="absolute bottom-6 w-full px-6 flex justify-between items-center opacity-40 text-[9px]">
                                            <div className="flex items-center gap-1.5">
                                                <div className="size-2 bg-white rounded-full"></div>
                                                <span>@citandoando</span>
                                            </div>
                                            <BookOpen size={12} />
                                        </div>

                                    </div>
                                </div>

                                {/* Tooltip Flotante "Vista Previa" */}
                                <div className="absolute top-[30%] -right-4 lg:-right-12 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 delay-700 duration-700">
                                    <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                                        <Smartphone size={20} />
                                    </div>
                                    <div className="pr-2">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Vista Previa</p>
                                        <p className="text-xs font-bold text-slate-800">1080 x 1920 (9:16)</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* FEATURE DEEP DIVE / WHY US */}
                <section className="px-6 py-24 bg-white" id="features">
                    <div className="max-w-[1000px] mx-auto">

                        {/* HEADER CENTRADO */}
                        <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                            <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase block mb-2">Tu Segundo Cerebro</span>
                            <h2 className="text-4xl md:text-5xl font-black text-[#140d1c] tracking-tight">
                                Tu biblioteca, <span className="text-primary">reimaginada</span>
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                Organiza tus pensamientos y haz que tus lecturas cobren vida con nuestra plataforma diseñada para el lector moderno.
                            </p>
                        </div>

                        {/* MOCKUP CENTRAL */}
                        <div className="relative w-full mb-24 group">
                            {/* Fondo Decorativo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-100/50 via-pink-50/50 to-blue-50/50 blur-3xl rounded-full -z-10"></div>

                            <div className="relative bg-slate-50 rounded-[2.5rem] border border-slate-200/60 shadow-2xl shadow-purple-900/5 overflow-hidden ring-1 ring-white/50">
                                <div className="absolute top-0 w-full h-12 bg-white/80 backdrop-blur border-b border-slate-100 flex items-center px-6 gap-2">
                                    <div className="flex gap-2">
                                        <div className="size-3 rounded-full bg-red-400/80"></div>
                                        <div className="size-3 rounded-full bg-yellow-400/80"></div>
                                        <div className="size-3 rounded-full bg-green-400/80"></div>
                                    </div>
                                    <div className="ml-6 h-6 w-64 bg-slate-100 rounded-lg hidden sm:block"></div>
                                </div>

                                {/* Contenido Mockup */}
                                <div className="pt-20 pb-12 px-8 min-h-[400px] bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl opacity-90 hover:opacity-100 transition-opacity duration-500">
                                        {['#8c25f4', '#ec4899', '#10b981', '#f59e0b'].map((color, i) => (
                                            <div key={i} className="aspect-[3/4] rounded-2xl shadow-lg border border-white/50 flex flex-col overflow-hidden group/card hover:-translate-y-2 transition-transform duration-300" style={{ backgroundColor: color }}>
                                                <div className="flex-1 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                <div className="h-1/3 bg-white p-3 space-y-2">
                                                    <div className="h-2 w-2/3 bg-slate-200 rounded-full"></div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LISTA DE FEATURES VERTICAL/GRID */}
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
                            {[
                                {
                                    icon: Shield,
                                    color: "bg-purple-100 text-purple-600",
                                    title: "Privacidad total",
                                    desc: "Tus datos nunca salen de tu navegador. Disfruta de una experiencia 100% privada y segura gestionando tu archivo personal."
                                },
                                {
                                    icon: Monitor,
                                    color: "bg-pink-100 text-pink-600",
                                    title: "Multi-dispositivo",
                                    desc: "Diseñada como PWA para funcionar perfectamente en tu laptop, tablet o móvil. Instálala y lleva tu biblioteca a donde vayas."
                                },
                                {
                                    icon: Zap,
                                    color: "bg-indigo-100 text-indigo-600",
                                    title: "Sin límites",
                                    desc: "No importa si tienes 10 o 1,000 libros. CitandoAndo procesa todos tus highlights de forma gratuita y sin restricciones de almacenamiento."
                                },
                                {
                                    icon: Palette,
                                    color: "bg-orange-100 text-orange-600",
                                    title: "Diseño moderno",
                                    desc: "Herramientas de edición intuitivas para personalizar tus citas. Crea piezas visuales impactantes optimizadas para Instagram y Twitter."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-6 group hover:bg-slate-50 p-4 rounded-3xl transition-colors -ml-4">
                                    <div className={`size-14 shrink-0 rounded-2xl ${feature.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon size={26} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#140d1c] mb-3">{feature.title}</h3>
                                        <p className="text-slate-600 leading-relaxed font-medium text-base opacity-90">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION (SEO GOLDMINE) */}
                <section className="px-6 py-24 bg-[#fcfcfc]">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="text-center mb-20 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-[#140d1c] tracking-tight">Preguntas Frecuentes</h2>
                            <p className="text-lg text-slate-600 font-medium">Todo lo que necesitas saber antes de empezar.</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-20">
                            {[
                                {
                                    icon: Folder,
                                    q: "¿Cómo encuentro el archivo My Clippings.txt?",
                                    a: "Conecta tu Kindle a tu PC con el cable USB. Aparecerá como una memoria externa. Entra a la carpeta 'documents' y ahí encontrarás el archivo 'My Clippings.txt'."
                                },
                                {
                                    icon: Shield,
                                    q: "¿Es seguro? ¿Guardan mis notas?",
                                    a: "Totalmente seguro. CitandoAndo funciona 100% en tu navegador. Tus notas NO se suben a ningún servidor, todo el procesamiento es local en tu dispositivo."
                                },
                                {
                                    icon: ImageIcon,
                                    q: "¿Funciona con Kobo o Apple Books?",
                                    a: "¡Sí! Con nuestro nuevo Modo Manual puedes crear diseños hermosos transcribiendo desde libros físicos, PDFs, Apple Books o cualquier otra fuente."
                                },
                                {
                                    icon: HeartHandshake,
                                    q: "¿Es realmente gratis?",
                                    a: "Sí, es un proyecto Open Source creado por amor a la lectura. Si te gusta, puedes invitarme un café, pero todas las funciones son y serán gratuitas."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-300 group">
                                    <div className="size-14 bg-purple-100 text-[#8c25f4] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                        <faq.icon size={26} strokeWidth={2} />
                                    </div>
                                    <h3 className="font-black text-xl mb-4 text-[#140d1c] tracking-tight">{faq.q}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
                                </div>
                            ))}
                        </div>

                        {/* Still have questions? */}
                        <div className="text-center border-t border-slate-100 pt-16">
                            <p className="text-slate-500 font-bold mb-6">¿Aún tienes dudas?</p>
                            <div className="flex justify-center gap-8">
                                {/* <a href="mailto:hola@citandoando.com" className="flex items-center gap-2 text-[#8c25f4] font-bold hover:text-purple-700 transition-colors">
                                    <Mail size={18} />
                                    <span>Contáctanos</span>
                                </a> */}
                                <a href="https://x.com/Danipena3488" target="_blank" className="flex items-center gap-2 text-[#8c25f4] font-bold hover:text-purple-700 transition-colors">
                                    <Twitter size={18} />
                                    <span>Twitter / X</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER CTA */}
                <footer className="px-6 py-20">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <h2 className="text-4xl md:text-6xl font-black max-w-2xl leading-tight">¿Listo para darle vida a tus notas?</h2>
                            <button onClick={onStart} className="bg-white text-primary h-16 px-12 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl">
                                Empezar ahora gratis
                            </button>
                        </div>
                    </div>
                    <div className="mt-12 text-center text-sm opacity-50 font-medium">
                        <p>© 2026 CitandoAndo. Hecho con ❤️ para lectores.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
