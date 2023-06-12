/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      'logo-blue': '#39529D',
      'logo-lblue': "#779EE9",
      'light-blue': '#C2D5F9',
      'blue': '#779EE9',
      'white': '#FFFFFF',
      'black': "#000000",
      "delete-red": "#ef4444",
      "edit-green": "#059668",
      gray: colors.gray,
      slate: colors.slate,
      zinc: colors.zinc
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
