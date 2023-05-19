/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#B2BAA1',
          'primary-content': '#0C4522',

          'secondary': '#48604f',
          'secondary-content': '#24321a',

          'accent': '#B88C1B',
          'accent-content': '#0C4522',

          'neutral': '#5c5757',
          'neutral-focus': '#272525',
          'neutral-content': '#e9e7e7',

          'base-100': '#0C4522',
          'base-200': '#d1cccc',
          'base-300': '#b9b1b1',
          'base-content': '#F7ECD5',

          'info': '#1c92f2',
          'success': '#009485',
          'warning': '#ff9900',
          'error': '#FF0000',

          '--rounded-box': '.5rem',
          '--rounded-btn': '.5rem',
          '--rounded-badge': '1.9rem',

          '--animation-btn': '.25s',
          '--animation-input': '.2s',

          '--btn-text-case': 'uppercase',
          '--navbar-padding': '.5rem',
          '--border-btn': '1px',
        },
      },
    ],
  },
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};

