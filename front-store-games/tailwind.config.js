/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'vivid-violet': {
          '50': '#fbf7fc',
          '100': '#f6edfa',
          '200': '#eddbf3',
          '300': '#e0bee9',
          '400': '#cf98da',
          '500': '#b76ec7',
          '600': '#9c4faa',
          '700': '#8c4497',
          '800': '#6b3573',
          '900': '#5b305f',
          '950': '#38163c',
        },
        'gun-powder': {
          '50': '#f7f7f8',
          '100': '#efeef0',
          '200': '#d8d8df',
          '300': '#b7b6c3',
          '400': '#908fa1',
          '500': '#737186',
          '600': '#5d5b6e',
          '700': '#4c4a59',
          '800': '#41404c',
          '900': '#3a3842',
          '950': '#26252c',
        },
      },
      boxShadow: {
        custom: '0rem 0rem 0.5rem theme("colors.vivid-violet.500")'
      },
      borderWidth: {
        '1': '0.1rem',
      },
      borderRadius: {
        'custom': '0.25rem',
      }
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.navbar-navBar': {
          '@apply shadow-custom p-2 pl-6 pr-6 flex justify-between items-center fixed top-0 w-full z-10': {},
        }
      });
    },
  ]
}