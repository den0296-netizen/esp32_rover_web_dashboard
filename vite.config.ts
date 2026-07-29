import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

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
    viteCompression({
      verbose: process.env.NODE_ENV === 'production',
      disable: process.env.NODE_ENV !== 'production',
      success: () => {
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Compression completed successfully.')
      }
    }),
    
  ],
})
