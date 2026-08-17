import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const starterSrc = path.resolve(__dirname, '../teamio-prototype-starter/src')
const reactPkg = path.resolve(__dirname, 'node_modules/react')
const reactDomPkg = path.resolve(__dirname, 'node_modules/react-dom')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@teamio/starter': starterSrc,
      react: reactPkg,
      'react-dom': reactDomPkg,
    },
    dedupe: ['react', 'react-dom'],
  },
})
