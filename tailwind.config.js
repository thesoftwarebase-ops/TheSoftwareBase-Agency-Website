/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          light: '#F7FAFC',
          dark: '#05070C',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0B1220',
        },
        elevated: {
          light: '#F0F4F8',
          dark: '#111A2E',
        },
        border: {
          light: '#B9CCDD',
          dark: '#1D2A44',
        },
        'border-strong': {
          light: '#020F40',
          dark: '#11DFF5',
        },
        text: {
          primary: {
            light: '#020F40',
            dark: '#F7FAFC',
          },
          secondary: {
            light: '#2E729F',
            dark: '#81ABCA',
          },
        },
        accent: {
          primary: {
            light: '#0D65EF',
            dark: '#11DFF5',
          },
          secondary: {
            light: '#093375',
            dark: '#0D65EF',
          },
          deep: {
            light: '#020F40',
            dark: '#093375',
          },
        },
        logo: {
          navyDeep: '#020F40',
          navy: '#093375',
          blue: '#0D65EF',
          sky: '#1EA5DE',
          cyan: '#11DFF5',
          paleCyan: '#C6EAF4',
          slate: '#2E729F',
          mist: '#81ABCA',
        },
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
      },
      fontFamily: {
        grotesk: ['var(--font-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
        'strong': '4px',
      },
      boxShadow: {
        'lg': '4px 4px 0 0 var(--accent-deep)',
        'xl': '6px 6px 0 0 var(--accent-primary)',
      },
    },
  },
  plugins: [],
}
