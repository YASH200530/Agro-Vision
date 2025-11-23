/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        agri: {
          50: '#f3faf4',
          100: '#e5f5e7',
          200: '#c6e8cb',
          300: '#9dd8a8',
          400: '#6fc47f',
          500: '#46b05c',
          600: '#2e9146',
          700: '#22773a',
          800: '#1d5e31',
          900: '#184c29'
        },
        soil: {
          50: '#f7f3f0',
          100: '#efe6df',
          200: '#dfcdc0',
          300: '#c6a892',
          400: '#a77f64',
          500: '#8c5f43',
          600: '#724a34',
          700: '#5b3b2b',
          800: '#4a3125',
          900: '#3e2a20'
        },
        crop: {
          50: '#fffbea',
          100: '#fff3c4',
          200: '#ffe58f',
          300: '#ffd166',
          400: '#f4b740',
          500: '#e09f3e',
          600: '#c5872b',
          700: '#a16b23',
          800: '#82561f',
          900: '#6b461d'
        }
      },
      boxShadow: {
        leaf: '0 10px 25px -5px rgba(46,145,70,0.2), 0 8px 10px -6px rgba(46,145,70,0.15)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      backgroundImage: {
        'agri-gradient': 'linear-gradient(135deg, #e5f5e7 0%, #fff 30%, #e5f0ff 100%)',
        'field-texture': 'radial-gradient(circle at 20% 20%, rgba(70,176,92,0.08) 0, transparent 40%), radial-gradient(circle at 80% 0%, rgba(224,159,62,0.08) 0, transparent 40%)'
      },
      borderWidth: {
        '3': '3px'
      }
    },
  },
  plugins: [],
};
