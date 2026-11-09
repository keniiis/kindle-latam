import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'CitandoAndo',
        short_name: 'CitandoAndo',
        description: 'Tu segundo cerebro para notas de Kindle',
        start_url: '/',
        display: 'standalone',
        background_color: '#f7f5f8',
        theme_color: '#ffffff',
        icons: [
            { src: '/icon.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
        share_target: {
            action: '/',
            method: 'GET',
            enctype: 'application/x-www-form-urlencoded',
            params: {
                title: 'title',
                text: 'text',
                url: 'url',
            },
        },
    }
}