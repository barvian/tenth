const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin')
const { parseToRgba } = require('color2k')

/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bank: `rgb(var(--color-bank, ${parseToRgba(colors.orange[500]).slice(0,3).join(' ')}) / <alpha-value>)`,
      black: colors.black,
      white: colors.white,
      gray: {...colors.neutral, '450': '#8c8c8c' },
      orange: colors.orange,
      red: colors.red,
      rose: colors.red
    },
    boxShadow: {
      sm: 'theme(space[0.5]) theme(space[1]) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))',
      DEFAULT: 'theme(space.1) theme(space[1.5]) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))',
      elevated: 'theme(space.1) theme(space[2.5]) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))',
      md: 'theme(space[1.5]) theme(space.2) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))',
      lg: 'theme(space.2) theme(space.3) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))'
    },
    extend: {
      screens: {
        'xs': '520px',
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.black'),
      }),
      fontFamily: {
        'sans': ['Value Sans Pro', ...defaultTheme.fontFamily.sans],
      },
      // fontSize: {
      //   // '4xl': '2.6rem'
      // },
      spacing: {
        xl: 'calc(theme(space.10) + 5vh)',
        '2xl': 'calc(theme(space.16) + 5vh)'
      },
      padding: {
        'page': '5vw'
      },
      maxWidth: {
        prose: '54ch'
      },
      animation: {
        'spin': 'spin 0.9s cubic-bezier(0.62, 0.37, 0.3, 0.63) infinite',
        'shake': 'shake 1s ease-in-out',
        'fly-b': 'fly-b 150ms ease-out',
        'fly-t': 'fly-t 150ms ease-out',
      },
      keyframes: {
        'shake': {
          '0%, 50%': {
            'transform': 'translateY(0)'
          },
          '6.5%': {
            'transform': 'translateY(-25%)/* rotateX(-9deg)*/'
          },
          '18.5%': {
            'transform': 'translateY(21%)/* rotateX(7deg)*/'
          },
          '31.5%': {
            'transform': 'translateY(-12.5%)/* rotateX(-5deg)*/'
          },
          '43.5%': {
            'transform': 'translateY(8.333%)/* rotateX(3deg)*/'
          }
        },
        'fly-b': {
          '0%': {
            'transform': 'translateY(-1rem)',
            'opacity': 0
          }
        },
        'fly-t': {
          '0%': {
            'transform': 'translateY(1rem)',
            'opacity': 0
          }
        }
      },
      lineHeight: {
        'extra-tight': '1.15'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-bg-svg'),
    plugin(function({ addBase, addUtilities, addVariant, matchUtilities, addComponents, theme }) {
      addVariant('not-disabled', '&:not(:disabled)')
      addVariant('peer-not-disabled', ':merge(.peer):not(:disabled) ~ &')
      addVariant('has-error', '&.has-error')
      addVariant('peer-has-error', ':merge(.peer).has-error ~ &')
      addComponents({
        '.inner': {
          'max-width': `calc(${theme('maxWidth.5xl')} + ${theme('padding.page')} * 2)`,
          'padding-left': theme('padding.page'),
          'padding-right': theme('padding.page'),
          'margin-left': 'auto',
          'margin-right': 'auto',
          'width': '100%',
          '&:focus': {
            'outline': 'none'
          }
        }
      })
      addUtilities({
        '.inherit-case': {
          'text-transform': 'inherit',
        },
        '.break-words': { /* default one doesn't work in Webkit */
            'overflow-wrap': 'break-word',
            'word-break': 'break-word'
        },
        '.overlap': {
          'display': 'grid',
          'grid-template-areas': "'overlap'"
        },
        '.overlap-inline': {
          'display': 'inline-grid',
          'grid-template-areas': "'overlap'"
        },
        '.overlap > *, .overlap-inline > *': {
            'grid-area': 'overlap'
        }
      })
      matchUtilities(
        {
          'clip': (value) => ({
            'clip-path': value
          }),
        },
        { values: theme('clipPath') }
      )
      matchUtilities(
        {
          'text-border': (value) => ({
            'text-shadow': `-1px 0 0 ${value}, 0 1px 0 ${value}, 1px 0 0 ${value}, 0 -1px 0 ${value}`
          }),
        },
        { values: theme('borderColor') }
      )
    })
  ]
};