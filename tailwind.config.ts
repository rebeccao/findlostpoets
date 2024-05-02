import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        //darkgray: '#202020'
        darkgray: '#505050'
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica'],
      },
      spacing: {
        'navbar': '56px', // Define custom spacing for navbar height
      },
      top: {
        'navbar': '56px', // Define custom top positioning, same as navbar height)
      },
      boxShadow: {
        'inner-top-left': 'inset -2px 2px 6px -1px rgba(0, 0, 0, 0.1)',
        //'r': '8px 0 15px -3px rgba(0, 0, 0, 0.1), 4px 0 6px -2px rgba(0, 0, 0, 0.05)',
        'r': '8px 0 15px -3px rgba(0, 0, 0, 0.1)',
        'l': '-8px 0 15px -3px rgba(0, 0, 0, 0.1), -4px 0 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config

