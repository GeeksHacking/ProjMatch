/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      'logo-blue': '#39529D',
      'logo-lblue': "#779EE9",
      'light-blue': '#C2D5F9',
      'white': "#FFFFFF",
      'black': "#000000",
      "JS": "#FFD057",
      "React": "#61DAFB",
      "Discord": "#7289DA",
      "Email": "#FFA15A",
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
    extend: {
      dropShadow: {
        'custom': '0px 4px 4px #98C0EB',
      }
    },
  },
  plugins: [],
}
