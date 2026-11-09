import type { Metadata } from 'next';
import LegalLayout, { SUPPORT_EMAIL } from '@/components/LegalLayout';

export const metadata: Metadata = {
    title: 'Política de privacidad',
    description: 'Cómo CitandoAndo trata tus datos: tu biblioteca vive solo en tu dispositivo.',
    alternates: { canonical: '/privacidad' },
};

export default function Privacidad() {
    return (
        <LegalLayout title="Política de privacidad" updated="9 de noviembre de 2026">
            <p>
                Esta política explica qué datos trata <strong>CitandoAndo</strong>, tanto la app para iPhone como el sitio web
                citando-ando.vercel.app. Resumen: no pedimos cuenta, no recopilamos tus citas y no vendemos datos.
            </p>

            <h2>App para iPhone</h2>
            <p><strong>Tu biblioteca es tuya.</strong> Las citas, los libros, las portadas que eliges y tus ajustes se guardan únicamente en tu dispositivo. No tenemos servidores que reciban tu biblioteca y no hay registro ni inicio de sesión.</p>
            <p>La app <strong>no incluye analítica, publicidad ni rastreadores</strong> de terceros, y no recopila información que te identifique.</p>

            <h2>Conexiones a servicios externos</h2>
            <p>Para ofrecerte funciones concretas, la app envía el título y el autor de un libro (nunca el texto de tus citas) a estos servicios, que pueden registrar la consulta según sus propias políticas:</p>
            <ul>
                <li><strong>Open Library, Google Books y Apple iTunes Search</strong>: para sugerir libros, buscar portadas y obtener el género.</li>
            </ul>
            <p>Si prefieres evitarlo, puedes escribir los datos a mano y dejar el libro sin portada.</p>

            <h2>Permisos del dispositivo</h2>
            <ul>
                <li><strong>Fotos (solo guardar):</strong> para guardar en tu galería las imágenes de citas que creas. La app no lee tu galería.</li>
                <li><strong>Archivos:</strong> cuando importas My Clippings.txt o guardas y restauras una copia, tú eliges el archivo.</li>
                <li><strong>Compartir:</strong> la extensión de compartir recibe el texto que tú envías desde otra app, y solo lo usa para abrir la pantalla de nueva cita.</li>
            </ul>

            <h2>Copias de seguridad</h2>
            <p>Si guardas una copia de seguridad, el archivo se crea en tu dispositivo y tú decides dónde almacenarlo (por ejemplo, en iCloud Drive o enviarlo por correo). CitandoAndo no lo recibe.</p>

            <h2>Sitio web</h2>
            <p>
                El sitio web usa <strong>Google Tag Manager</strong> y <strong>Vercel Analytics</strong> para medir visitas de forma agregada (páginas vistas, país, tipo de dispositivo).
                Estas herramientas pueden usar cookies o identificadores técnicos. La herramienta web guarda tu biblioteca en el almacenamiento local de tu navegador y no la envía a nuestros servidores.
            </p>

            <h2>Menores</h2>
            <p>CitandoAndo no está dirigida a menores de 13 años ni recopila datos de ellos de forma consciente.</p>

            <h2>Tus derechos y eliminación de datos</h2>
            <p>Como tus datos están en tu dispositivo, tú los controlas: puedes borrarlos desde Ajustes → Borrar todo o desinstalando la app. Si tienes dudas sobre datos del sitio web, escríbenos.</p>

            <h2>Cambios</h2>
            <p>Si esta política cambia, actualizaremos la fecha de arriba. Los cambios importantes se avisarán dentro de la app.</p>

            <h2>Contacto</h2>
            <p>Escríbenos a <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
        </LegalLayout>
    );
}
