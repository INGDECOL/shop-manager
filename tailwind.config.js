module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        colors: {
          'primary': '#4f515a',
          'secondary': '#ebebeb',
          'warning': '#da0f41',
          'slategray': '#708090'
        },
        fontFamily : {
          'tangerine' : ['Tangerine', 'Helvetica', 'Arial', 'sans-serif']
        },
        dropShadow: {
          '1xl': '0 2px 2px  rgba(37, 36, 36)',
        },
        fontSize: {
          '4xl': '2.5rem'
        },
        keyframes: {
          loading: {
            '0%': { transform: 'rotateZ(360deg)' },
            '0%': { transform:'rotateZ(100deg)',border: '#ff8000' },
            '50%': { border: '#ffee00' },
            '80%': { border: '#00ffbf' },
            '80%': { border: '#0084ff' },
          }
        },
        animation: {
          loading: 'loading 1s ease infinite'
        }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
