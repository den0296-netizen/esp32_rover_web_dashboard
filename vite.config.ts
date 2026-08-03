import { defineConfig, type PluginOption } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

const compressionPlugin = viteCompression as unknown as (options?: Record<string, unknown>) => PluginOption

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
    tailwindcss(),
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
