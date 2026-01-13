declare global {
    interface Window {
        workbox: any;
    }
}
'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/Toast';

export default function PwaUpdater() {
    const { showToast } = useToast();

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            window.workbox !== undefined
        ) {
            const wb = window.workbox;

            // Escuchar evento de que hay una nueva versión esperando controlar
            wb.addEventListener('waiting', () => {
                showToast(
                    'Hay una nueva versión de la app. Haz clic para actualizar.',
                    'success'
                );

                // Forzar recarga o preguntar al usuario?
                // Lo más agresivo es wb.messageSkipWaiting();
                // O podemos mostrar un botón en el Toast. (Nuestro Toast no tiene botones aún...)

                // Opción simple: Recargar al clicar (si el toast lo permitiera)
                // Como nuestro custom Toast es simple, vamos a refrescar automáticamente
                // o mostrar el mensaje y dejar que el usuario recargue manualmente.
                // PERO con "skipWaiting: true" en next.config, el nuevo SW tomará el control inmediato
                // y la página se refrescará sola o necesitará reload.

                // Con @ducanh2912/next-pwa handling por defecto:
                // Si skipWaiting es true (default), el nuevo SW se activa solo.
                // Pero los clientes abiertos (tabs) no ven el cambio hasta que recargan.

                // Mejor estrategia simple:
                // next-pwa con register: true y skipWaiting: true hace el trabajo sucio.
                // Nosotros solo avisamos "Contenido actualizado".

                // Pero un reload completo es lo mejor para asegurar que el usuario ve lo nuevo.
                // window.location.reload(); 
            });

            // Detectar cuando el SW toma el control (después de instalarse)
            wb.addEventListener('controlling', () => {
                // window.location.reload();
            });

            wb.register();
        }
    }, [showToast]);

    return null;
}
