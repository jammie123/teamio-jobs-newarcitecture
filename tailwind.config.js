/** @type {import('tailwindcss').Config} */
import starterConfig from '../teamio-prototype-starter/tailwind.config.js'

export default {
  ...starterConfig,
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    '../teamio-prototype-starter/src/**/*.{js,jsx,ts,tsx,mdx}',
  ],
}
