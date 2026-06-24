import type { Config } from 'tailwindcss'

/**
 * Design tokens Saraillon — contracts.md §6.
 * Les couleurs sont définies en variables CSS (canaux RGB) dans src/index.css,
 * ce qui permet les modificateurs d'opacité Tailwind (ex. `border-sara-ink/10`).
 * AUCUNE feature ne doit écrire une couleur en dur : tout passe par ces tokens.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sara: {
          blue: 'rgb(var(--sara-blue) / <alpha-value>)',
          pink: 'rgb(var(--sara-pink) / <alpha-value>)',
          yellow: 'rgb(var(--sara-yellow) / <alpha-value>)',
          green: 'rgb(var(--sara-green) / <alpha-value>)',
          purple: 'rgb(var(--sara-purple) / <alpha-value>)',
          orange: 'rgb(var(--sara-orange) / <alpha-value>)',
          ink: 'rgb(var(--sara-ink) / <alpha-value>)',
          paper: 'rgb(var(--sara-paper) / <alpha-value>)',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui', 'sans-serif'],
        body: ['"Baloo 2"', 'system-ui', 'sans-serif'],
      },
      // Ombres dures « 8-bit » (sans flou), couleur = encre.
      boxShadow: {
        hard: '4px 4px 0 rgb(var(--sara-ink))',
        'hard-sm': '3px 3px 0 rgb(var(--sara-ink))',
        'hard-lg': '12px 12px 0 rgb(var(--sara-ink))',
      },
      borderWidth: {
        3: '3px',
      },
      keyframes: {
        pop: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        zoom: {
          '0%': { opacity: '0', transform: 'scale(.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '.2' },
        },
      },
      animation: {
        pop: 'pop .25s ease',
        zoom: 'zoom .3s ease',
        blink: 'blink .8s steps(1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
