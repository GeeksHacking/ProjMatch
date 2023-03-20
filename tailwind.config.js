/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      'logo-blue': '#39529D',
      'light-blue': '#C2D5F9',
      'blue': '#779EE9',
      'white': '#FFFFFF',
      'black': '#000000',
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    // margin: {
    //   '2.75': '0.6875rem',
    // },
    extend: {},
  },
  plugins: [],
}
