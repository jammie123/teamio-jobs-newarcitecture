import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { starterRoot } from './starterRoot.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const starterSrc = path.resolve(starterRoot, 'src')
const reactPkg = path.resolve(__dirname, 'node_modules/react')
const reactDomPkg = path.resolve(__dirname, 'node_modules/react-dom')
const poppinsPkg = path.resolve(__dirname, 'node_modules/@fontsource/poppins')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@teamio/starter': starterSrc,
      // Starter global.css @imports Poppins; resolve the files from this app
      // so Vite does not serve them from starter/node_modules (blocked in dev).
      '@fontsource/poppins': poppinsPkg,
      react: reactPkg,
      'react-dom': reactDomPkg,
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [__dirname, starterRoot],
    },
  },
})
