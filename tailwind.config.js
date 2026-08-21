/** @type {import('tailwindcss').Config} */
import path from 'node:path'
import { createRequire } from 'node:module'
import { starterRoot } from './starterRoot.js'

const require = createRequire(import.meta.url)
const load = require('jiti')(import.meta.url)
const starterConfig = load(path.join(starterRoot, 'tailwind.config.js'))

export default {
  ...(starterConfig.default ?? starterConfig),
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './teamio-prototype-starter/src/**/*.{js,jsx,ts,tsx,mdx}',
    '../teamio-prototype-starter/src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
}
