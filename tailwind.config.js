/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "customyellow": '#F5C78B',
        "customgrey": '#464042',
        "customwhite": '#F5C78B',
        "customblack": '#2D282A',
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
        'h1': ['ZeroCool', 'sans-serif'], 
        'h2' : ['UnboundedBold', 'sans-serif'],
        'p' : ['UnboundedRegular', 'sans-serif'],
    },
    fontSize:{
      'h1': ['3rem'], 
        'h2' : ['3rem'], 
        'p' :  ['3rem'], 
    }
  },
  plugins: [],
}
}
