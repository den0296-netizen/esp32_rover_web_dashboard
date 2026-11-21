import { defineConfig, type PluginOption } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

const compressionPlugin = viteCompression as unknown as (options?: Record<string, unknown>) => PluginOption

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'ESP32 Rover Web Dashboard',
        short_name: 'Rover',
        description: 'Control and monitor your ESP32 rover',
        theme_color: '#0f172a',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}']
      },
      devOptions: {
        enabled: true
      }
    }),
    // Enable compression only in production mode
    /* eslint disable-next-line */
    compressionPlugin({
      verbose: process.env.NODE_ENV === 'production',
      disable: process.env.NODE_ENV !== 'production',
      success: () => {
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Compression completed successfully.')
      }
    }),
    
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  }
})
