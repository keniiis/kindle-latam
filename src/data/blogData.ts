
export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    coverImage?: string;
    content: string; // MDX or HTML string
    tags: string[];
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'cronologia-outlander',
        title: 'Cronología Completa de la Saga Outlander',
        description: 'La guía definitiva para leer los libros de Diana Gabaldon en orden, incluyendo las novelas de Lord John Grey.',
        date: '2024-01-20',
        readTime: '8 min lectura',
        coverImage: '/outlander-cover.png',
        tags: ['Libros', 'Guía', 'Fantasía'],
        content: `
<h2>La Columna Vertebral: Las Novelas Principales</h2>
<p>Esta es la historia central de Claire y Jamie Fraser. Aunque Diana Gabaldon juega con el tiempo, se recomienda leer estas novelas en el orden de publicación para evitar spoilers y seguir la evolución natural de los personajes.</p>

<h3>1. Forastera (Outlander, 1991)</h3>
<p>La historia comienza en 1945 (o 1946 en la edición británica), cuando Claire Randall, una enfermera de combate, atraviesa las piedras de Craigh na Dun y aterriza en la Escocia de 1743. Aquí se ve obligada a casarse con el guerrero escocés Jamie Fraser para protegerse del antepasado de su marido, el Capitán "Black Jack" Randall.</p>

<h3>2. Atrapada en el tiempo (Dragonfly in Amber, 1992)</h3>
<p>La narrativa salta veinte años al futuro, a 1968, donde Claire revela a su hija Brianna la verdad sobre su paternidad. La historia retrocede a la París de 1744, donde Jamie y Claire intentan detener el Levantamiento Jacobita y evitar la masacre de Culloden.</p>

<h3>3. Viajera (Voyager, 1993)</h3>
<p>Este libro comienza en el campo de batalla de Culloden en 1746, siguiendo la supervivencia de Jamie y sus años de soledad. Paralelamente, en 1968, Claire descubre que Jamie sobrevivió y decide regresar al siglo XVIII para reunirse con él tras veinte años de separación.</p>

<h3>4. Tambores de otoño (Drums of Autumn, 1996)</h3>
<p>La acción se traslada al Nuevo Mundo. Jamie y Claire intentan establecerse en Carolina del Norte en 1767. Mientras tanto, en el siglo XX, Brianna descubre un recorte de periódico que presagia un desastre para sus padres y decide viajar a través de las piedras para salvarlos, seguida por Roger Wakefield.</p>

<h3>5. La cruz ardiente (The Fiery Cross, 2001)</h3>
<p>Situada entre 1770 y 1772, esta novela narra los desafíos de la vida en el asentamiento de Fraser's Ridge en medio de las crecientes tensiones políticas que preceden a la Guerra de Independencia de los Estados Unidos. Comienza con un famoso "día largo" durante una reunión de clanes y la boda de Brianna y Roger.</p>

<h3>6. Viento y ceniza (A Breath of Snow and Ashes, 2005)</h3>
<p>Abarca los años 1773 a 1776. La Revolución Americana se acerca a la puerta de los Fraser. Jamie debe equilibrar su lealtad a la Corona con el conocimiento de Claire sobre el resultado de la guerra, mientras un recorte de periódico predice un incendio fatal en la casa de los Fraser.</p>

<h3>7. Ecos del pasado (An Echo in the Bone, 2009)</h3>
<p>La guerra está en pleno apogeo (1776-1778). La narrativa se expande para incluir las perspectivas de Lord John Grey y William Ransom (el hijo ilegítimo de Jamie). En el siglo XX, Brianna y Roger enfrentan sus propios peligros en Lallybroch.</p>

<h3>8. Escrito con la sangre de mi corazón (MOBY, 2014)</h3>
<p>Conocido por los fans como "MOBY", retoma la acción inmediatamente donde la dejó el libro anterior en 1778, en medio de la Batalla de Monmouth. Trata las complejas dinámicas familiares tras el regreso de personajes que se creían muertos.</p>

<h3>9. Cuenta a las abejas que me fui (Go Tell the Bees That I Am Gone, 2021)</h3>
<p>Ambientada en 1779 y años posteriores, la familia Fraser está reunida en el Ridge, pero las secuelas de la guerra y nuevas amenazas internas ponen en peligro su paz.</p>
    
<h3>10. A Blessing For A Warrior Going Out (Próximamente)</h3>
<p>Confirmado por la autora como el décimo y probablemente último libro de la saga principal de Jamie y Claire.</p>

<hr />

<h2>El Universo Expandido: Lord John Grey</h2>
<p>Para los lectores que deseen la experiencia completa, Diana Gabaldon ha escrito una serie de misterio centrada en Lord John Grey. La mayoría ocurre durante los años en que Jamie y Claire estuvieron separados.</p>

<h3>Orden de Lectura Sugerido para Completistas</h3>

<ul>
    <li>
        <strong>Antes de Forastera:</strong>
        <br/>Vírgenes (Virgins): Novela corta (Jamie con 19 años).
        <br/>The Exile: Novela gráfica (Punto de vista de Murtagh).
    </li>
    
    <li>
        <strong>Durante "Viajera" (1756-1761):</strong>
        <ul>
            <li>Lord John y el club Hellfire</li>
            <li>Lord John y un asunto privado (2003)</li>
            <li>Lord John y el súcubo</li>
            <li>Lord John y la hermandad de la espada (2007)</li>
            <li>El prisionero escocés (2011) - <strong>Esencial</strong></li>
        </ul>
    </li>
</ul>

<div class="my-8 p-6 bg-slate-50 rounded-2xl">
    <h3>Proyectos Futuros</h3>
    <p>Diana Gabaldon está trabajando en una precuela sobre los padres de Jamie (Brian y Ellen) y un libro sobre el Maestro Raymond.</p>
</div>
`
    },
    {
        slug: 'del-kindle-a-bookstagram-guia',
        title: 'Del Kindle a Bookstagram: Guía Completa',
        description: 'El acto de leer en la era digital ha dejado de ser una actividad de simple absorción para convertirse en un proceso dinámico de captura, organización y redistribución de conocimiento.',
        content: `
            <p>El acto de leer en la era digital ha dejado de ser una actividad de simple absorción para convertirse en un proceso dinámico de captura, organización y redistribución de conocimiento. El Kindle de Amazon se encuentra en el centro de esta transformación, permitiendo que tus anotaciones trasciendan el dispositivo para integrarse en sistemas de "segundo cerebro" y comunidades visuales como Bookstagram.</p>
            
            <h2>1. El fundamento técnico: El archivo My Clippings.txt</h2>
            <p>Cada subrayado, nota o marcador que realizas en tu Kindle se guarda en un archivo de texto plano llamado <strong>My Clippings.txt</strong>, ubicado en la carpeta de documentos del dispositivo. Este archivo es el registro histórico acumulativo de tu actividad y es la única forma de acceder a las anotaciones de libros cargados externamente (sideloaded), ya que estos no se sincronizan en la nube.</p>
            <p>Sin embargo, este archivo tiene limitaciones: las entradas se añaden cronológicamente sin importar el libro, lo que genera un flujo desordenado. Además, el software del Kindle no borra las entradas del archivo cuando las eliminas en el dispositivo.</p>
            
            <h2>2. Herramientas para organizar tu "Segundo Cerebro"</h2>
            <p>Para transformar esos datos en bruto en conocimiento útil, la privacidad y la facilidad de uso son claves:</p>
            <ul>
                <li><strong>CitandoAndo:</strong> Nuestra herramienta destaca por procesar los datos directamente en tu navegador, garantizando que la información nunca toque servidores externos (Privacidad Total). Además, organiza tus fragmentos en segundos y te permite exportarlos visualmente.</li>
                <li><strong>Formatos estandarizados:</strong> Es importante poder tener tus notas limpias y ordenadas por libro, algo que el archivo original no ofrece.</li>
            </ul>
            
            <h2>3. De la memorización a la síntesis inteligente</h2>
            <p>Muchos sistemas se centran solo en recordar, pero la verdadera lectura busca generar nuevas ideas y conexiones. Al visualizar tus subrayados limpios y ordenados, puedes detectar patrones entre diferentes libros y construir una base de conocimiento sólida.</p>
            
            <h2>4. Estética literaria: Curaduría visual en redes sociales</h2>
            <p>El éxito en comunidades como <strong>Bookstagram, TikTok o Pinterest</strong> depende de convertir el texto plano en imágenes impactantes. Aquí es donde CitandoAndo brilla:</p>
            <ul>
                <li><strong>Generador de "Stories":</strong> Crea imágenes con tipografías elegantes y fondos estéticos en un clic, listas para compartir.</li>
                <li><strong>Portadas Automáticas:</strong> Detectamos el libro y le asignamos su portada real para que tu feed luzca profesional.</li>
                <li><strong>Formatos estratégicos:</strong> Tus citas salen optimizadas para captar la atención en el feed infinito de las redes sociales.</li>
            </ul>
            
            <h2>5. El flujo de trabajo del lector moderno</h2>
            <p>Para implementar este ecosistema con éxito, sigue estos pasos:</p>
            <ol>
                <li><strong>Captura:</strong> Subraya activamente en tu Kindle, incluso en documentos personales.</li>
                <li><strong>Carga:</strong> Conecta tu Kindle y arrastra el archivo My Clippings a CitandoAndo.</li>
                <li><strong>Organización:</strong> Usa nuestra interfaz para filtrar y seleccionar tus mejores hallazgos.</li>
                <li><strong>Creación:</strong> Convierte las frases en imágenes estéticas con nuestro editor integrado.</li>
                <li><strong>Distribución:</strong> Publica en redes sociales con hashtags como #bookstagram o #readinglife.</li>
            </ol>
            <p>Al reclamar la propiedad sobre tus subrayados y transformarlos en algo nuevo, estás ejerciendo tu soberanía digital y preservando tu patrimonio intelectual personal.</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2698&auto=format&fit=crop',
        date: '2026-01-14',
        readTime: '6 min lectura',
        tags: ['Guías', 'Kindle', 'Bookstagram']
    },
    {
        slug: 'como-exportar-notas-kindle',
        title: 'Cómo exportar tus notas y subrayados de Kindle fácilmente',
        description: 'Aprende paso a paso cómo extraer tus frases favoritas de tu Amazon Kindle y convertirlas en imágenes compartibles para redes sociales.',
        content: `
            <h2>¿Por qué tus notas se quedan atrapadas en el Kindle?</h2>
            <p>El Kindle es una herramienta maravillosa para la lectura, pero su sistema para compartir notas puede sentirse arcaico. Muchos lectores enfrentan la "sobrecarga de información" y necesitan estrategias efectivas para organizar y recuperar lo que leen. Aquí es donde tus subrayados se convierten en la base de un "Segundo Cerebro" o base de conocimiento personal (PKB), un sistema que extiende tus capacidades cognitivas al permitirte revisitar y conectar ideas en el futuro.</p>
            
            <h2>El archivo "My Clippings.txt"</h2>
            <p>Cada vez que subrayas un fragmento o añades una nota, el Kindle guarda esa información en un archivo de texto plano llamado <code>My Clippings.txt</code>, ubicado en la raíz del dispositivo (dentro de la carpeta "documents"). Aunque Amazon ofrece una web propia (read.amazon.com/notebook), esta suele limitarse a libros comprados en su tienda, dejando fuera tus documentos personales o archivos cargados externamente. Por ello, el archivo .txt es el verdadero tesoro de tu conocimiento acumulado.</p>
            
            <h3>El problema del formato</h3>
            <p>El gran inconveniente es que este archivo es difícil de procesar visualmente. Tiene un formato caótico lleno de metadatos, fechas y líneas separadoras que ensucian tus frases favoritas. Además, el archivo tiene una limitación técnica: solo recibe nuevas inserciones. Si borras un subrayado en tu Kindle, este permanecerá en el archivo de texto, obligándote a una limpieza manual muy tediosa.</p>
            
            <h2>La solución: CitandoAndo</h2>
            <p>Para transformar este caos en algo útil y estético, surge CitandoAndo. Nuestra herramienta lee ese archivo complejo y lo transforma en una biblioteca visual hermosa. No solo organiza tus lecturas, sino que potencia tu presencia en la comunidad de Bookstagram (la comunidad de Instagram dedicada a los libros).</p>
            
            <p>Con CitandoAndo puedes:</p>
            <ul>
                <li><strong>Crear imágenes estéticas:</strong> Ideal para compartir quotes y frases en Stories y Posts con un diseño cuidado que encaje con tu aesthetic.</li>
                <li><strong>Limpiar tu contenido:</strong> Edita erratas o elimina esos subrayados accidentales que el archivo original no borró.</li>
                <li><strong>Portabilidad total:</strong> Guarda tus frases favoritas en tu móvil para consultarlas en cualquier momento, como si fuera un feed de inspiración personal.</li>
            </ul>
            
            <h2>Paso a paso para usar CitandoAndo</h2>
            <ol>
                <li>Conecta tu Kindle al PC mediante un cable USB.</li>
                <li>Localiza el archivo: Busca <code>My Clippings.txt</code> en la carpeta raíz o en "documents".</li>
                <li>Sube el archivo a CitandoAndo: Nuestra herramienta procesará los metadatos y organizará todo por libros.</li>
                <li>¡Listo! Ya puedes buscar, etiquetar y exportar tus ideas para que nunca se queden en el olvido.</li>
            </ol>
            
            <p><strong>Tip extra:</strong> Al organizar tus notas visualmente, no solo guardas información, sino que facilitas el proceso de descubrimiento, permitiéndote aplicar lo aprendido en tu vida diaria o en tus propios proyectos creativos.</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2574&auto=format&fit=crop',
        date: '2026-01-14',
        readTime: '5 min lectura',
        tags: ['Tutoriales', 'Kindle', 'Tips']
    },
    {
        slug: 'mejores-frases-libros-2025',
        title: 'Las 10 frases de libros más compartidas en 2025',
        description: 'Una recopilación de las citas literarias que definieron el discurso digital este año. Desde Rebecca Yarros hasta Suzanne Collins.',
        content: `
            <p>El panorama literario de 2025 ha consolidado una tendencia donde el valor de un libro ya no solo reside en su trama, sino en su capacidad de ser fragmentado en citas que sirven como herramientas de construcción identitaria y validación emocional. Estas "micro-unidades de sentido" se han vuelto virales en plataformas como BookTok e Instagram, reflejando las preocupaciones de una sociedad marcada por la ansiedad y la búsqueda de conexiones auténticas.</p>
            
            <p>A continuación, presentamos las diez frases que han definido el discurso digital este año:</p>

            <h2>1. Rebecca Yarros – Onyx Storm</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Súbete a tus cueros. Tenemos dragones que montar".</p>
            <p>Esta frase se ha convertido en el lema de resiliencia por excelencia en 2025. Los lectores la utilizan masivamente como una metáfora para enfrentar jornadas difíciles o iniciar proyectos personales ambiciosos.</p>

            <h2>2. Rebecca Yarros – Onyx Storm</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Soy celoso de la armadura que te sostiene cuando yo no puedo, de las sábanas de tu cama que acarician tu piel cada noche y de las dagas que sienten tus manos".</p>
            <p>Este fragmento destaca por su vulnerabilidad cruda, alejándose de la posesión romántica tradicional para abrazar una entrega emocional total frente a la incertidumbre del mundo.</p>

            <h2>3. R.F. Kuang – Katabasis</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Meteorológicamente, el Infierno no parecía mucho peor que una primavera inglesa".</p>
            <p>Con un humor seco y cínico, esta sentencia ha capturado la ironía de una generación que conecta el sufrimiento mitológico con la cotidianidad mundana y el absurdo de la existencia moderna.</p>

            <h2>4. Suzanne Collins – Sunrise on the Reaping</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"No usarán mis lágrimas para su entretenimiento".</p>
            <p>Proveniente de la precuela de Los Juegos del Hambre, esta frase ha trascendido la ficción para convertirse en un reclamo de soberanía emocional frente a una "economía de la atención" que exige la exposición constante del trauma.</p>

            <h2>5. Suzanne Collins – Sunrise on the Reaping</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Eras capaz de imaginar un futuro diferente. Y tal vez no se realice hoy... tal vez tome generaciones. Todos somos parte de un continuo. ¿Eso lo hace inútil?".</p>
            <p>Esta cita ofrece un antídoto al nihilismo, sugiriendo que la integridad moral de una acción es valiosa independientemente de si los resultados son inmediatos.</p>

            <h2>6. Emily Henry – Great Big Beautiful Life</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"El amor no es algo que puedas sostener en tus manos, y tengo que creer que eso significa que es algo que nunca se puede perder".</p>
            <p>Es la frase más compartida de Henry este año, adoptada especialmente en contenidos dedicados al duelo y la reconstrucción personal por su visión del amor como una energía persistente.</p>

            <h2>7. John Green – Everything is Tuberculosis</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"La muerte por tuberculosis ya no es causada por una bacteria; es causada por la elección humana. Es causada por estructuras y sistemas construidos por el hombre".</p>
            <p>Green ha logrado que un dato de no ficción se convierta en un mantra de justicia social, desplazando la responsabilidad de lo biológico hacia lo político y sistémico.</p>

            <h2>8. V.E. Schwab – Bury Our Bones in the Midnight Soil</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Entierra mis huesos en el suelo de medianoche, plántalos superficialmente y riégalos profundamente, y en mi lugar crecerá una rosa feral, pétalos rojos suaves ocultando dientes blancos afilados".</p>
            <p>Esta sentencia funciona casi como un encantamiento sobre el renacimiento y la identidad, simbolizando una feminidad que elige ser peligrosa en lugar de meramente decorativa.</p>

            <h2>9. Fredrik Backman – My Friends</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Somos un puñado de simios solitarios en una roca en el universo, nuestro aliento consiste en un ochenta por ciento de nitrógeno, veinte por ciento de oxígeno y cien por ciento de ansiedad".</p>
            <p>Aclamada por su honestidad brutal, esta cita normaliza la sensación de agobio constante como una parte intrínseca de la experiencia humana contemporánea.</p>

            <h2>10. Taylor Jenkins Reid – Atmosphere</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Admitir que tenías miedo siempre requirió más agallas que fingir que no lo tenías. Estar dispuesto a cometer un error te llevaba más lejos que no intentarlo nunca".</p>
            <p>Esta frase se ha consolidado como un pilar del desarrollo personal en 2025, valorando la vulnerabilidad y el coraje de fallar por encima de la invulnerabilidad tradicional.</p>

            <p class="mt-8 border-t pt-4"><strong>Conclusión:</strong> Compartir estas frases en 2025 no es solo un acto de recomendación, sino una moneda social que señala los valores de quien las publica: desde la preocupación por la justicia global hasta la aceptación de la propia fragilidad.</p>
        `,
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2670&auto=format&fit=crop',
        date: '2026-01-10',
        readTime: '8 min lectura',
        tags: ['Tendencias', 'Citas', '2025']
    },
    {
        slug: 'que-es-my-clippings-txt-kindle',
        title: 'Qué es el archivo My Clippings.txt y dónde encontrarlo en tu Kindle',
        description: 'Todo lo que subrayas en tu Kindle termina en un archivo llamado My Clippings.txt. Te explicamos qué guarda, dónde está y cómo sacarlo paso a paso.',
        content: `
            <p>Si alguna vez te preguntaste dónde quedan todos los subrayados que haces en tu Kindle, la respuesta es un archivo de texto llamado <strong>My Clippings.txt</strong>. Es el registro completo de tus lecturas: cada frase que marcaste, cada nota que escribiste y cada marcador que dejaste, de todos tus libros, en un solo lugar.</p>

            <h2>¿Qué es My Clippings.txt?</h2>
            <p>Es un archivo de texto plano que el Kindle crea y actualiza automáticamente. Cada vez que subrayas algo, el Kindle agrega una nueva entrada al final del archivo. Cada entrada tiene más o menos esta forma:</p>
            <pre><code>El principito (Antoine de Saint-Exupéry)
- Tu subrayado en la posición 1100-1101 | Añadido el lunes, 3 de marzo de 2025 21:14:07

Lo esencial es invisible a los ojos.
==========</code></pre>
            <p>Primero va el título y el autor, después el tipo de anotación (subrayado, nota o marcador) con su posición y fecha, luego el texto y, al final, una línea de signos <code>=</code> que separa una entrada de la siguiente. Si tu Kindle está en inglés, verás lo mismo pero con textos como <em>Your Highlight</em> o <em>Added on</em>.</p>

            <h2>¿Dónde está el archivo?</h2>
            <p>El archivo vive dentro de tu Kindle, no en la nube. Para encontrarlo:</p>
            <ol>
                <li>Conecta tu Kindle a la computadora con el cable USB.</li>
                <li>Abre la unidad que aparece con el nombre <strong>Kindle</strong> (en Windows, desde el Explorador de archivos; en Mac, desde el Finder).</li>
                <li>Entra en la carpeta <strong>documents</strong>.</li>
                <li>Ahí verás <strong>My Clippings.txt</strong>. Cópialo a tu computadora; no lo muevas, para que el Kindle siga usándolo.</li>
            </ol>
            <p>En algunos modelos recientes, el Kindle no aparece como una unidad normal en Mac y hace falta una app de transferencia. Si tu Mac no lo detecta, revisa la página de ayuda de Amazon para tu modelo.</p>
            <p><strong>Tip:</strong> también puedes verlo desde el propio Kindle. En tu biblioteca aparece como un documento llamado <em>My Clippings</em> (o <em>Mis recortes</em>, según el idioma).</p>

            <h2>Cosas que conviene saber</h2>
            <ul>
                <li><strong>Incluye libros de cualquier origen.</strong> A diferencia de la web de Amazon, guarda también los subrayados de libros y documentos que pasaste por USB o que no compraste en la tienda.</li>
                <li><strong>Nunca se limpia solo.</strong> Si borras un subrayado en el Kindle, la entrada sigue en el archivo. Por eso suelen aparecer frases repetidas o subrayados accidentales.</li>
                <li><strong>Algunos libros tienen límite.</strong> Las editoriales pueden limitar cuánto texto de un libro se guarda. Cuando llegas al límite, en lugar de la frase verás un aviso de que se alcanzó el límite de recortes.</li>
                <li><strong>Está todo mezclado.</strong> Las entradas aparecen en el orden en que las creaste, no agrupadas por libro, lo que hace que el archivo sea difícil de leer cuando tienes cientos de subrayados.</li>
                <li><strong>Haz una copia de seguridad.</strong> Si algún día reseteas el Kindle, el archivo se pierde. Guardar una copia de vez en cuando es la forma más sencilla de conservar todo lo que leíste.</li>
            </ul>

            <h2>Cómo darle vida a tus subrayados</h2>
            <p>Abrir el archivo en un editor de texto sirve para buscar algo puntual, pero no es cómodo para releer ni para compartir. Con <strong>CitandoAndo</strong> puedes importar tu My Clippings.txt en el iPhone: la app lo ordena por libro y te permite convertir cualquier frase en una imagen lista para Instagram. Todo se procesa en tu teléfono, sin cuentas ni servidores.</p>
            <p>Si quieres conocer otras formas de revisar tus subrayados, lee <a href="/blog/ver-subrayados-kindle">cómo ver todos tus subrayados de Kindle</a>. Y si ya tienes tu frase favorita, aquí te contamos <a href="/blog/compartir-frases-libros-instagram-stories">cómo compartirla en Instagram Stories</a>.</p>
        `,
        coverImage: '/blog/kindle-computadora.webp',
        date: '2026-11-20',
        readTime: '5 min lectura',
        tags: ['Tutoriales', 'Kindle', 'My Clippings']
    },
    {
        slug: 'ver-subrayados-kindle',
        title: 'Cómo ver todos tus subrayados de Kindle (en el Kindle, la app y la web)',
        description: 'Tres formas de encontrar tus subrayados y notas de Kindle: desde el propio dispositivo, desde la app Kindle y desde la web de Amazon. Y qué hacer con los libros que no compraste en Amazon.',
        content: `
            <p>Subrayar es fácil; encontrar después lo que subrayaste no tanto. Amazon reparte tus anotaciones en varios lugares y cada uno muestra cosas distintas. Aquí tienes las tres formas de verlas y cuándo conviene cada una.</p>

            <h2>1. En el propio Kindle</h2>
            <p>Es la forma más rápida si estás leyendo y quieres repasar lo que marcaste en ese libro:</p>
            <ol>
                <li>Abre el libro.</li>
                <li>Toca la parte superior de la pantalla para mostrar el menú.</li>
                <li>Abre el menú de opciones (los tres puntos) y elige <strong>Notas</strong>.</li>
            </ol>
            <p>Verás la lista de subrayados y notas de ese libro, y al tocar uno saltas a esa parte del texto. La desventaja: solo ves un libro a la vez.</p>
            <p>Si quieres ver los subrayados de <strong>todos</strong> tus libros en el Kindle, busca en tu biblioteca el documento <em>My Clippings</em> (o <em>Mis recortes</em>). Ahí está todo junto, aunque mezclado y sin orden por libro.</p>

            <h2>2. En la app Kindle (iPhone, Android, tablet o computadora)</h2>
            <p>Si sincronizas tus libros con tu cuenta de Amazon, tus subrayados también aparecen en la app:</p>
            <ol>
                <li>Abre el libro en la app Kindle.</li>
                <li>Toca el centro de la pantalla para mostrar las opciones.</li>
                <li>Toca el icono del <strong>cuaderno</strong> para ver tus subrayados y notas.</li>
            </ol>
            <p>Desde ahí puedes filtrar por color de subrayado y, en muchas versiones, compartir o exportar las notas de ese libro.</p>

            <h2>3. En la web de Amazon (Kindle Notebook)</h2>
            <p>Entra en <strong>read.amazon.com/notebook</strong> con tu cuenta de Amazon. En la columna de la izquierda aparecen tus libros y, al elegir uno, ves todos sus subrayados y notas. Es la forma más cómoda de leerlos en una pantalla grande o de copiarlos.</p>

            <h2>El detalle que casi nadie te cuenta</h2>
            <p>La app y la web solo muestran los subrayados que se sincronizan con tu cuenta, que en la práctica son los de libros comprados en la tienda de Amazon. Los libros o documentos que pasaste al Kindle por USB <strong>no aparecen</strong> ahí.</p>
            <p>La única fuente que tiene <strong>todo</strong>, venga de donde venga el libro, es el archivo <strong>My Clippings.txt</strong> que guarda tu Kindle. Te explicamos <a href="/blog/que-es-my-clippings-txt-kindle">qué es y cómo encontrarlo</a> paso a paso.</p>

            <h2>¿Cuál conviene usar?</h2>
            <ul>
                <li><strong>Para repasar el libro que estás leyendo:</strong> el menú Notas del Kindle o el cuaderno de la app.</li>
                <li><strong>Para leer o copiar los subrayados de libros comprados:</strong> la web Kindle Notebook.</li>
                <li><strong>Para tener todo, incluidos los libros que no compraste en Amazon:</strong> el archivo My Clippings.txt.</li>
            </ul>

            <h2>De la lista a algo que dé ganas de compartir</h2>
            <p>Ver tus subrayados en una lista está bien, pero la mayoría se quedan ahí para siempre. Con <strong>CitandoAndo</strong> importas tu My Clippings.txt en el iPhone (o escribes la frase a mano) y la conviertes en una imagen con estilo en segundos, lista para tus Stories. Es gratis, sin registro y tus citas no salen de tu teléfono.</p>
        `,
        coverImage: '/blog/kindle-mesa-cafe.webp',
        date: '2026-11-20',
        readTime: '5 min lectura',
        tags: ['Guías', 'Kindle', 'Subrayados']
    },
    {
        slug: 'compartir-frases-libros-instagram-stories',
        title: 'Cómo compartir frases de libros en Instagram Stories',
        description: 'Guía práctica para publicar tus citas favoritas en Instagram Stories: formato, diseño, cómo dar crédito al autor y qué hacer para que tus seguidores interactúen.',
        content: `
            <p>Una buena frase de un libro puede ser la Story más compartida de tu semana. Pero una captura de pantalla del Kindle, con la letra pequeña y el número de página, rara vez funciona. Estos son los pasos para que tus citas se vean bien y la gente quiera leerlas.</p>

            <h2>1. Elige bien la frase</h2>
            <ul>
                <li><strong>Que se entienda sola.</strong> Si hace falta conocer el libro para entenderla, busca otra o recórtala.</li>
                <li><strong>Mejor corta.</strong> En una Story la gente se queda unos segundos. Entre una y tres líneas es lo ideal.</li>
                <li><strong>Sin spoilers.</strong> Evita frases que revelen giros de la trama, sobre todo de libros recientes.</li>
            </ul>
            <p>¿Buscas inspiración? Tenemos una selección de <a href="/blog/frases-de-libros-cortas-bonitas">frases de libros cortas y bonitas</a> listas para compartir.</p>

            <h2>2. Usa el formato correcto</h2>
            <p>Las Stories son verticales: <strong>1080 × 1920 píxeles</strong> (proporción 9:16). Si subes una imagen cuadrada, Instagram la rellena con un fondo que casi nunca combina.</p>
            <p>Deja libre la parte de arriba y la de abajo de la imagen: ahí Instagram muestra tu nombre, la barra de progreso y el campo para responder. Centra el texto.</p>

            <h2>3. Cuida el diseño</h2>
            <ul>
                <li><strong>Contraste:</strong> texto oscuro sobre fondo claro o al revés. Las fotos de fondo muy cargadas hacen la frase ilegible.</li>
                <li><strong>Tipografía grande:</strong> que se lea sin hacer zoom en un teléfono.</li>
                <li><strong>Un estilo propio:</strong> usar siempre los mismos colores y la misma tipografía hace que tus seguidores reconozcan tus citas al instante.</li>
            </ul>

            <h2>4. Da siempre el crédito</h2>
            <p>Escribe el autor y el título del libro debajo de la frase. Es lo justo con quien la escribió y, además, es lo que más preguntan tus seguidores: «¿de qué libro es?». Si es una traducción, no hace falta citar al traductor en una Story, pero sí respetar el texto tal como aparece en el libro.</p>

            <h2>5. Haz que la gente interactúe</h2>
            <ul>
                <li>Agrega una <strong>encuesta</strong> («¿Lo leíste?») o una <strong>caja de preguntas</strong> («¿Qué libro me recomiendas después de este?»).</li>
                <li>Usa el <strong>sticker de enlace</strong> si escribiste una reseña o tienes un club de lectura.</li>
                <li>Usa hashtags como <strong>#bookstagram</strong>, <strong>#citasdelibros</strong> o <strong>#leeresvivir</strong> en tus publicaciones del feed, donde ayudan a que te descubran.</li>
                <li>Guarda tus mejores citas en una <strong>historia destacada</strong> para que los nuevos seguidores las encuentren.</li>
            </ul>

            <h2>6. Hazlo en segundos con CitandoAndo</h2>
            <p>Diseñar cada cita en Canva puede llevarte 20 minutos. Con <strong>CitandoAndo</strong> el proceso es así:</p>
            <ol>
                <li>Importa tu archivo <a href="/blog/que-es-my-clippings-txt-kindle">My Clippings.txt</a> del Kindle o escribe la frase a mano (sirve para Kobo, Apple Books o libros en papel).</li>
                <li>Elige la frase y aplica un estilo.</li>
                <li>Guarda la imagen en vertical y súbela a tus Stories.</li>
            </ol>
            <p>Es gratis, no necesitas cuenta y tus citas se quedan en tu iPhone.</p>
        `,
        coverImage: '/blog/instagram-telefono.webp',
        date: '2026-11-20',
        readTime: '5 min lectura',
        tags: ['Guías', 'Instagram', 'Bookstagram']
    },
    {
        slug: 'frases-de-libros-cortas-bonitas',
        title: 'Frases de libros cortas y bonitas para compartir',
        description: 'Una selección de frases cortas de libros clásicos y de autores latinoamericanos, con su autor y su obra, perfectas para tus Stories, tu bio o una dedicatoria.',
        content: `
            <p>A veces una sola línea de un libro dice más que un párrafo entero. Reunimos frases cortas de clásicos y de grandes autores en español, cada una con su autor y su libro, para que puedas compartirlas dando el crédito correcto.</p>

            <h2>1. Antoine de Saint-Exupéry – El principito</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Solo se ve bien con el corazón. Lo esencial es invisible a los ojos".</p>
            <p>Es probablemente la frase literaria más compartida del mundo. Funciona igual para hablar de amor, de amistad o de lo que de verdad importa.</p>

            <h2>2. Julio Cortázar – Rayuela</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Andábamos sin buscarnos pero sabiendo que andábamos para encontrarnos".</p>
            <p>Una de las frases más románticas de la literatura latinoamericana. Ideal para una dedicatoria.</p>

            <h2>3. Pablo Neruda – Veinte poemas de amor y una canción desesperada</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Es tan corto el amor, y es tan largo el olvido".</p>
            <p>Del famoso Poema 20. En diez palabras resume lo que cuesta dejar ir a alguien.</p>

            <h2>4. Gabriel García Márquez – Vivir para contarla</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"La vida no es la que uno vivió, sino la que uno recuerda y cómo la recuerda para contarla".</p>
            <p>El epígrafe de las memorias de García Márquez. Perfecta para quienes escriben un diario o guardan recuerdos.</p>

            <h2>5. Antonio Machado – Campos de Castilla</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Caminante, no hay camino, se hace camino al andar".</p>
            <p>Un clásico para empezar un proyecto, un viaje o una etapa nueva.</p>

            <h2>6. Miguel de Cervantes – Don Quijote de la Mancha</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"El que lee mucho y anda mucho, ve mucho y sabe mucho".</p>
            <p>La frase perfecta para cualquier lector viajero.</p>

            <h2>7. Jorge Luis Borges – Poema de los dones</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Yo, que me figuraba el Paraíso bajo la especie de una biblioteca".</p>
            <p>Suele citarse como «siempre imaginé que el Paraíso sería algún tipo de biblioteca», pero el verso original es este.</p>

            <h2>8. Jorge Luis Borges – Elogio de la sombra</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Que otros se jacten de las páginas que han escrito; a mí me enorgullecen las que he leído".</p>
            <p>Del poema «Un lector». Para cualquiera que se sienta más lector que escritor.</p>

            <h2>9. J. R. R. Tolkien – La Comunidad del Anillo</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"No todo lo que es oro reluce, ni toda la gente errante anda perdida".</p>
            <p>Muy compartida por quienes no siguen el camino que se esperaba de ellos.</p>

            <h2>10. León Tolstói – Ana Karénina</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Todas las familias felices se parecen unas a otras; cada familia desdichada lo es a su manera".</p>
            <p>Uno de los comienzos más famosos de la literatura.</p>

            <h2>11. Charles Dickens – Historia de dos ciudades</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Era el mejor de los tiempos, era el peor de los tiempos".</p>
            <p>Para describir esas épocas en las que todo pasa a la vez.</p>

            <h2>12. George Orwell – Rebelión en la granja</h2>
            <p class="font-bold italic text-lg pl-4 border-l-4 border-purple-300">"Todos los animales son iguales, pero algunos animales son más iguales que otros".</p>
            <p>Una frase que sigue sonando actual casi ochenta años después.</p>

            <h2>Cómo compartirlas con estilo</h2>
            <p>Ten en cuenta que las frases de libros traducidos pueden variar un poco según la edición; si tienes el libro, copia el texto tal como aparece en tu ejemplar. Y si quieres que tu frase se vea como las tarjetas de este artículo, con <strong>CitandoAndo</strong> la conviertes en una imagen lista para Instagram en segundos. Te contamos todo el proceso en <a href="/blog/compartir-frases-libros-instagram-stories">cómo compartir frases de libros en Instagram Stories</a>.</p>
            <p>¿Las frases que más te gustan están en tu Kindle? Descubre <a href="/blog/que-es-my-clippings-txt-kindle">dónde se guardan tus subrayados</a> y llévalas a la app.</p>
        `,
        coverImage: '/blog/libro-abierto.webp',
        date: '2026-11-20',
        readTime: '6 min lectura',
        tags: ['Libros', 'Citas', 'Frases']
    }
];
