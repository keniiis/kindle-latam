import type { Metadata } from 'next';
import LegalLayout, { SUPPORT_EMAIL } from '@/components/LegalLayout';

export const metadata: Metadata = {
    title: 'Ayuda y soporte',
    description: 'Preguntas frecuentes y contacto de CitandoAndo para iPhone y web.',
    alternates: { canonical: '/soporte' },
};

export default function Soporte() {
    return (
        <LegalLayout title="Ayuda y soporte">
            <p>
                ¿Algo no funciona o tienes una idea? Escríbenos a{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Respondemos lo antes posible, normalmente en pocos días.
            </p>
            <p>Para ayudarte mejor, cuéntanos qué hacías, qué esperabas que pasara y el modelo de tu iPhone con su versión de iOS.</p>

            <h2>Preguntas frecuentes</h2>

            <h3 className="font-extrabold text-[#140d1c]">¿Cómo importo mis subrayados de Kindle?</h3>
            <p>
                Conecta tu Kindle al computador y copia el archivo <strong>My Clippings.txt</strong> (está en la carpeta &quot;documents&quot;).
                Luego, en la app, ve a Ajustes → Importar y elígelo. Las citas repetidas se detectan y no se duplican.
            </p>

            <h3 className="font-extrabold text-[#140d1c]">¿Cómo agrego una cita desde otra app?</h3>
            <p>
                En tu app de lectura, selecciona la frase, toca <strong>Compartir</strong> y elige <strong>CitandoAndo</strong>. Se abrirá la pantalla de
                nueva cita con el texto, y el libro cuando la app de origen lo incluye. También puedes pegar el texto a mano.
            </p>

            <h3 className="font-extrabold text-[#140d1c]">¿Dónde se guardan mis citas?</h3>
            <p>
                Solo en tu dispositivo. No hay cuentas ni servidores con tu biblioteca. Por eso es importante que guardes una copia desde
                Ajustes → Guardar copia de seguridad, sobre todo antes de cambiar de teléfono o borrar la app.
            </p>

            <h3 className="font-extrabold text-[#140d1c]">Cambié de iPhone o reinstalé la app y mi biblioteca no está</h3>
            <p>Si guardaste una copia, ve a Ajustes → Restaurar copia y selecciona el archivo. Sin copia no es posible recuperar los datos, porque no se guardan fuera de tu dispositivo.</p>

            <h3 className="font-extrabold text-[#140d1c]">La portada de un libro no es la correcta</h3>
            <p>Abre el libro, toca la portada y elige otra de la lista, o prueba buscando con el título en otro idioma. También puedes dejar el libro sin portada.</p>

            <h3 className="font-extrabold text-[#140d1c]">No puedo guardar la imagen en Fotos</h3>
            <p>Comprueba que CitandoAndo tenga permiso para guardar fotos: Ajustes del iPhone → CitandoAndo → Fotos. Mientras tanto, usa el botón Compartir para enviar la imagen a otra app.</p>

            <h3 className="font-extrabold text-[#140d1c]">¿Cómo borro todos mis datos?</h3>
            <p>En Ajustes → Borrar todo. También se eliminan al desinstalar la app.</p>

            <p className="text-sm text-slate-500 pt-4">
                CitandoAndo es independiente y no está afiliada ni respaldada por Amazon. Kindle es una marca de Amazon.com, Inc.
            </p>
        </LegalLayout>
    );
}
