import type { Metadata } from 'next';
import LegalLayout, { SUPPORT_EMAIL } from '@/components/LegalLayout';
import { HAS_IAP } from '@/lib/landing/copy';

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
                Luego, en la app, ve a Ajustes → Importar desde un lector electrónico y elígelo. Las citas repetidas se detectan y no se duplican.
            </p>

            <h3 className="font-extrabold text-[#140d1c]">¿Cómo agrego una cita desde otra app?</h3>
            <p>
                En tu app de lectura, selecciona la frase, toca <strong>Compartir</strong> y elige <strong>CitandoAndo</strong>. Se abrirá la pantalla de
                nueva cita con el texto, y el libro cuando la app de origen lo incluye. También puedes pegar el texto a mano.
            </p>

            <h3 className="font-extrabold text-[#140d1c]">¿Dónde se guardan mis citas?</h3>
            <p>
                Solo en tu dispositivo. No hay cuentas ni servidores con tu biblioteca. Por eso es importante que guardes una copia desde
                Ajustes → Guardar una copia, sobre todo antes de cambiar de teléfono o borrar la app.
            </p>

            <h3 className="font-extrabold text-[#140d1c]">Cambié de iPhone o reinstalé la app y mi biblioteca no está</h3>
            <p>Si guardaste una copia, ve a Ajustes → Restaurar una copia y selecciona el archivo. Sin copia no es posible recuperar los datos, porque no se guardan fuera de tu dispositivo.</p>

            <h3 className="font-extrabold text-[#140d1c]">La portada de un libro no es la correcta</h3>
            <p>Abre el libro, toca la portada y elige otra de la lista, o prueba buscando con el título en otro idioma. También puedes dejar el libro sin portada.</p>

            <h3 className="font-extrabold text-[#140d1c]">No puedo guardar la imagen en Fotos</h3>
            <p>Comprueba que CitandoAndo tenga permiso para guardar fotos: Ajustes del iPhone → CitandoAndo → Fotos. Mientras tanto, usa el botón Compartir para enviar la imagen a otra app.</p>

            {HAS_IAP && (
                <>
                    <h3 className="font-extrabold text-[#140d1c]">¿Qué incluye Pro?</h3>
                    <p>
                        CitandoAndo es gratis. <strong>Pro</strong> es un pago único y opcional, sin suscripción, que desbloquea el color libre, los fondos con tu foto o la portada del libro, y los stickers.
                        Puedes probar esas funciones antes de pagar: Pro se te pide solo al guardar o compartir una imagen que las use. Todo lo demás sigue siendo gratis.
                    </p>

                    <h3 className="font-extrabold text-[#140d1c]">Cambié de iPhone o reinstalé la app: ¿cómo recupero Pro?</h3>
                    <p>
                        Abre Ajustes → <strong>CitandoAndo Pro</strong> y toca <strong>Restaurar compra</strong>. Usa el mismo Apple ID con el que pagaste. No se cobra de nuevo.
                    </p>

                    <h3 className="font-extrabold text-[#140d1c]">Pagué, pero Pro no se desbloqueó</h3>
                    <p>
                        Prueba primero con Ajustes → CitandoAndo Pro → Restaurar compra. Si no funciona, escríbenos a <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> y adjunta
                        el recibo de Apple que te llegó por correo.
                    </p>

                    <h3 className="font-extrabold text-[#140d1c]">¿Cómo pido un reembolso?</h3>
                    <p>
                        Las compras las gestiona Apple, así que los reembolsos se solicitan en <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
                    </p>
                </>
            )}

            <h3 className="font-extrabold text-[#140d1c]">¿Cómo borro todos mis datos?</h3>
            <p>En Ajustes → Borrar toda la biblioteca. También se eliminan al desinstalar la app.</p>

            <p className="text-sm text-slate-500 pt-4">
                CitandoAndo es independiente y no está afiliada ni respaldada por Amazon. Kindle es una marca de Amazon.com, Inc.
            </p>
        </LegalLayout>
    );
}
