import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',    // Custom breakpoint for small devices like iPhone
        'sm': '640px',    
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',  // Holonick's screen 2560x1440
      },
      colors: {
        offwhite:     '#F7F7F7',
        pearlwhite:   '#E8E8E8',
        gainsboro:    '#DCDCDC',
        lightmedgray: '#BDBDBD',
        mediumgray:   '#9E9E9E',
        bgray:        '#808080',
        midtonegray:  '#757575',
        naughtygray:  '#696969',
        agray:        '#616161',
        davysgray:    '#555555',
        darkgray2:    '#494949',
        gunmetalgray: '#424242',
        onyxgray:     '#393939',
        charcoalgray: '#333333',
        deepgray:     '#282828',
        darkgray:     '#212121',
        verydarkgray: '#1A1A1A',
        closetoblack: '#141414',
      },
      placeholderColor: {
        mediumgray:   '#9E9E9E',
      },
      variants: {
        extend: {
            placeholderColor: ['focus', 'hover'],
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica'],
      },
      spacing: {
        'navbar': '56px',      // custom spacing for navbar height
      },
      top: {
        'navbar': '56px',     // navbar height)
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

