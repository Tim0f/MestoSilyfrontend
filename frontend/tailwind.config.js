/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      customyellow: 'rgb(var(--color-customyellow) / <alpha-value>)',
      customgrey:   'rgb(var(--color-customgrey) / <alpha-value>)',
      customwhite:  'rgb(var(--color-customwhite) / <alpha-value>)',
      customblack:  'rgb(var(--color-customblack) / <alpha-value>)',
        primary: {
          1: '#F5C78B',
          2: '#FEFAF3',
          3: '#464042',
          4: '#2D282A',
          400: '#d4a574',
          500: '#c89860',
          600: '#b88548',
          700: '#9a6d3c',
          800: '#7d5935',
          900: '#66482d',
        },
        light: {
          50: '#f5f5f5',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/src/img/Mask_group.png')",
      },
      fontFamily: {
        h1: ['ZeroCool', 'sans-serif'],
        h2: ['UnboundedBold', 'sans-serif'],
        p: ['UnboundedRegular', 'sans-serif'],
      },
      fontSize: {
        h1: ['4rem'],
        h2: ['2rem'],
        p: ['1rem'],
      },
    },
  },
 plugins: [
  plugin(({ addComponents }) => {
  addComponents({
    '.textured-border': {
      border: '20px solid transparent',
      borderImageSource: "url('/src/assets/svg/texturedBorder.svg')",
      borderImageSlice: '15',
      borderImageRepeat: 'stretch',
      borderRadius: '1rem',
    },
    
  })
}),

plugin(({ addUtilities }) => {
  addUtilities({
    '.textured-round': {
      position: 'relative',
      borderRadius: '9999px',
      '--ring-size': '24px',
    },

    /* КОЛЬЦО */
    '.textured-round::before': {
      content: '""',
      position: 'absolute',
      inset: '0',
      borderRadius: '9999px',
      backgroundColor: '#F5C78B',

      WebkitMaskImage: "url('/src/assets/svg/texturedRound.svg')",
      WebkitMaskRepeat: 'no-repeat',
      WebkitMaskSize: '100% 100%',

      maskImage: "url('/src/assets/svg/texturedRound.svg')",
      maskRepeat: 'no-repeat',
      maskSize: '100% 100%',

      pointerEvents: 'none',
      zIndex: '0',
    },

    /* ВНУТРЕННИЙ КРУГ — КЛЮЧЕВО */
    '.textured-round .inner': {
      position: 'absolute',
      inset: 'var(--ring-size)',
      borderRadius: '9999px',
      zIndex: '1',
      overflow: 'hidden',
    },


//    '.team': {
//   position: 'relative',
//   width: '590px',
//   height: '590px',
//   borderRadius: '9999px',
//   isolation: 'isolate',
// },


//         /* === РАМКА === */
// '.team::before': {
//   content: '""',
//   position: 'absolute',
//   inset: '-30px',
//   borderRadius: '9999px',
//   backgroundColor: '#F5C78B',

//   WebkitMaskImage: 'url("/src/assets/svg/RoundTextureTeam.svg")',
//   WebkitMaskRepeat: 'no-repeat',
//   WebkitMaskSize: '100% 100%',

//   maskImage: 'url("/src/assets/svg/RoundTextureTeam.svg")',
//   maskRepeat: 'no-repeat',
//   maskSize: '100% 100%',

//   zIndex: '1',
//   pointerEvents: 'none',
// },

// '.team .frame-padding': {
//   position: 'absolute',
//   inset: '36px', // 🔥 РЕАЛЬНЫЙ ОТСТУП ПОД РАМКУ
//   borderRadius: '9999px',
//   zIndex: '2',
// },


//         /* === ВНУТРЕННИЙ КРУГ === */
// '.team .inner': {
//   width: '100%',
//   height: '100%',
//   borderRadius: '9999px',
//   overflow: 'hidden',
// },

      })
    }),


],

}
