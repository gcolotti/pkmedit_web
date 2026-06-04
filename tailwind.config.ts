import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ember: '#ef5a3c',
        lagoon: '#21a0a0',
        ink: '#10151f',
      },
      gridTemplateColumns: {
        'item-shiny': 'minmax(0,1fr) auto',
        shell: '20rem minmax(0,1fr) 26.875rem',
      },
      gridTemplateRows: {
        box: 'repeat(5,minmax(0,1fr))',
      },
      maxWidth: {
        box: '28rem',
        shell: '80rem',
        'slot-label': '4.5rem',
        toast: 'calc(100vw - 2rem)',
      },
      maxHeight: {
        'draft-changes': '16rem',
        legality: '32.5rem',
        ribbons: '14rem',
      },
      minWidth: {
        editor: '18rem',
      },
      minHeight: {
        slot: '5.375rem',
        workspace: '40rem',
      },
      boxShadow: {
        glow: '0 24px 80px rgb(33 160 160 / 18%)',
      },
    },
  },
  plugins: [],
} satisfies Config
