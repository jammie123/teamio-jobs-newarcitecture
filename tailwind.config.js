/** @type {import('tailwindcss').Config} */
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { starterRoot } from './starterRoot.js'

const starterConfig = (await import(pathToFileURL(path.join(starterRoot, 'tailwind.config.js')).href))
  .default

export default {
  ...starterConfig,
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './teamio-prototype-starter/src/**/*.{js,jsx,ts,tsx,mdx}',
    '../teamio-prototype-starter/src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
}
