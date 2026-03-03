import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DWA - ドライバー健康診断',
    short_name: 'DWA',
    description: '産業医・保健師向けドライバー健康診断ツール',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1e',
    theme_color: '#638cff',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
