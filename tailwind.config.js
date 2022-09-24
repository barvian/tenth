const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // future: {
  //   hoverOnlyWhenSupported: true,
  // },
  theme: {
    colors: require('./tailwind.colors.json'),
    boxShadow: null, // custom vector shadows here
    perspective: {
      1400: '1400px'
    },
    extend: {
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.black'),
      }),
      backgroundImage: {
        'noise-white': "url(/img/noise-white.png)",
        'noise-red': "url(/img/noise-red.png)"
      },
      borderRadius: {
        DEFAULT: 'var(--round)'
      },
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
        'flipcard-shadow': 'flipcard-shadow 600ms theme(transitionTimingFunction[in-out])',
        'spin': 'spin 0.9s cubic-bezier(0.62, 0.37, 0.3, 0.63) infinite',
        'ping-lg': 'ping-lg 2s 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fly-r': 'fly-r 400ms ease',
        'fly-l': 'fly-l 400ms ease',
        'fly-t': 'fly-t 400ms ease',
      },
      keyframes: {
        'flipcard-shadow': {
          '50%': { 
            'clip-path': 'inset(0 calc(40%) 0 calc(49%) round var(--round))'
          }
        },
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
    },
    bgSvg: {
      'shadow': `
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern_XQtXP" patternUnits="userSpaceOnUse" width="5.5" height="5.5" patternTransform="rotate(45)">
              <line x1="0" y="0" x2="0" y2="5.5" stroke="svgcolor" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern_XQtXP)" />
        </svg>
      `,
      'wave': `
      <svg width="153" height="17" viewBox="0 0 153 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_330_309)">
          <path d="M-114 4C-88.6667 -8 -63.3333 -8 -38 4C-12.6667 16 12.6667 16 38 4C63.3333 -8 88.6667 -8 114 4C139.333 16 164.667 16 190 4C215.333 -8 240.667 -8 266 4C291.333 16 316.667 16 342 4C367.333 -8 392.667 -8 418 4C443.333 16 468.667 16 494 4C519.333 -8 544.667 -8 570 4C595.333 16 620.667 16 646 4C671.333 -8 696.667 -8 722 4C747.333 16 772.667 16 798 4C823.333 -8 848.667 -8 874 4C899.333 16 924.667 16 950 4C975.333 -8 1000.67 -8 1026 4C1051.33 16 1076.67 16 1102 4C1127.33 -8 1152.67 -8 1178 4" stroke="svgcolor" stroke-width="4" stroke-linecap="round"/>
          <path d="M-114 21C-88.6667 9 -63.3333 9 -38 21C-12.6667 33 12.6667 33 38 21C63.3333 9 88.6667 9 114 21C139.333 33 164.667 33 190 21C215.333 9 240.667 9 266 21C291.333 33 316.667 33 342 21C367.333 9 392.667 9 418 21C443.333 33 468.667 33 494 21C519.333 9 544.667 9 570 21C595.333 33 620.667 33 646 21C671.333 9 696.667 9 722 21C747.333 33 772.667 33 798 21C823.333 9 848.667 9 874 21C899.333 33 924.667 33 950 21C975.333 9 1000.67 9 1026 21C1051.33 33 1076.67 33 1102 21C1127.33 9 1152.67 9 1178 21" stroke="svgcolor" stroke-width="4" stroke-linecap="round"/>
        </g>
        <defs>
          <clipPath id="clip0_330_309">
            <rect width="153" height="17" fill="white"/>
          </clipPath>
        </defs>
      </svg>`
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
        '.backface-auto': {
          'backface-visibility': 'auto',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
        '.transform-flat': {
          'transform-style': 'flat',
        },
        '.break-words': { /* default one doesn't work in Webkit */
            'overflow-wrap': 'break-word',
            'word-break': 'break-word'
        },
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
            'display': 'none'
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
            '-ms-overflow-style': 'none',  /* IE and Edge */
            'scrollbar-width': 'none'  /* Firefox */
        },
        '.overlap': {
          'display': 'grid',
          'grid-template-areas': "'overlap'"
        },
        '.overlap > *': {
            'grid-area': 'overlap'
        }
      })

      addVariant('in-view', ['.no-js:root &', '&.in-view'])
      addBase({
        ':not(.no-js):root [class*="in-view:"]:not(.in-view)': {
          'opacity': 0,
          'pointer-events': 'none'
        },
        ':not(.no-js):root [class*="in-view:"]:not(.did-animate)': {
          'transition': 'none'
        }
      })

      // Let you specify a shared top-level border-radius that all 'rounded' children inherit
      // (useful for i.e. shadows)
      matchUtilities(
        {
          round: (value) => ({
            '--round': value
          }),
        },
        { values: theme('borderRadius') }
      )
      matchUtilities(
        {
          perspective: (value) => ({
            'perspective': value
          }),
        },
        { values: theme('perspective') }
      )
      matchUtilities(
        {
          'text-border': (value) => ({
            'text-shadow': `-1px 0 0 ${value}, 0 1px 0 ${value}, 1px 0 0 ${value}, 0 -1px 0 ${value}`
          }),
        },
        { values: theme('borderColor') }
      )
      matchUtilities(
        {
          'translate-z': (value) => ({
            'transform': `translateZ(${value})`
          }),
        },
        { values: theme('translate') }
      )
      matchUtilities(
        {
          'rotate-y': (value) => ({
            'transform': `rotateY(${value})`
          }),
        },
        { values: theme('rotate') }
      )
      matchUtilities(
        {
          'clip': (value) => ({
            'clip-path': value
          }),
        },
        { values: theme('clipPath') }
      )
    })
  ]
};