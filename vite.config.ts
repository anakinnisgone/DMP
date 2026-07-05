import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Electron paketlemesinde ELECTRON=1 ortam değişkeni set edilir.
// file:// protokolünde varlıkların yüklenebilmesi için göreli taban gerekir.
const isElectron = !!process.env.ELECTRON

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isElectron ? './' : '/',
  server: {
    port: 5173,
    strictPort: true,
    open: !isElectron,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Büyük bağımlılıkları ayrı chunk'lara böl: ana bundle küçülür,
        // tarayıcı/Electron önbelleği sürümler arasında daha iyi çalışır.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
})
