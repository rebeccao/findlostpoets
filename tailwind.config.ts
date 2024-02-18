import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
        //'inner-top-left': 'inset -2px 2px 4px 1px rgba(0, 0, 0, 0.08)',
        'inner-top-left': 'inset -2px 2px 6px -1px rgba(0, 0, 0, 0.1)',
        //'inner-top-left': 'inset -2px 2px 6px -1px rgba(0, 0, 0, 0.1), inset 0px 1px 4px -1px rgba(0, 0, 0, 0.06)',
        //'inner':         'inset 0px 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config

