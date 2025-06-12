import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Nen Tracker',
        short_name: 'NenNen',
        description: 'A simple app to track your breastfeeding sessions',
        theme_color: '#4F46E5',
        background_color: '#fff',
        icons: [
          {
            src: '/bf-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/bf-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        id: '/',
      }
    })
  ],
})

