const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  // future: {
  //   hoverOnlyWhenSupported: true,
  // },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: {...colors.neutral, '450': '#8c8c8c' },
      orange: colors.orange,
      red: colors.red
    },
    boxShadow: {
      DEFAULT: 'theme(space.1) theme(space[1.5]) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))',
      elevated: 'theme(space.1) theme(space[2.5]) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))',
      md: 'theme(space.2) theme(space.3) 0 var(--tw-shadow-color, rgba(0,0,0,0.08))'
    },
    extend: {
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.black'),
      }),
      fontFamily: {
        'sans': ['Value Sans Pro', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '4xl': '2.6rem'
      },
      padding: {
        'page': '5vw',
        'section': 'calc(theme(space.9) + 5vh)',
        'hero': 'calc(theme(space.9) + 8vh)'
      },
      animation: {
        'spin': 'spin 0.9s cubic-bezier(0.62, 0.37, 0.3, 0.63) infinite',
        'ping-lg': 'ping-lg 2s 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fly-r': 'fly-r 400ms ease',
        'fly-l': 'fly-l 400ms ease',
        'fly-t': 'fly-t 400ms ease',
      },
      keyframes: {
        'ping-lg': {
          '75%, 100%': {
            'transform': 'scale(4)',
            'opacity': 0
          }
        },
        'fly-r': {
          '0%': {
            'transform': 'translateX(calc(-40px - 10%)) rotate(-30deg)',
            'opacity': 0
          }
        },
        'fly-l': {
          '0%': {
            'transform': 'translateX(calc(40px + 10%)) rotate(30deg)',
            'opacity': 0
          }
        },
        'fly-t': {
          '0%': {
            'transform': 'translateY(calc(40px + 10%))',
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
      addComponents({
        '.inner': {
          'position': 'relative',
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
        '.overlap > *': {
            'grid-area': 'overlap'
        }
      })

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