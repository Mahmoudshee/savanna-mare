import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#172b25',
        green: { DEFAULT: '#24473a', dark: '#18352b' },
        moss: '#758b54',
        cream: '#fffdf7',
        sand: '#f2eadb',
        coral: { DEFAULT: '#dc7855', dark: '#c86646', deeper: '#a94e31' },
        muted: '#727c73',
        line: '#e7e4dc',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      maxWidth: {
        shell: '1320px',
        'shell-sm': '860px',
        'shell-xs': '760px',
      },
    },
  },
  plugins: [],
}
export default config

