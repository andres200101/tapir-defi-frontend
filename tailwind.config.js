/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ required for theme toggle to work
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tapir: {
          // ✅ Light mode base colors (NEW)
          light: '#f4faff',      // soft blue-white background
          light2: '#ffffff',     // pure white surface

          // ✅ Dark shades (existing)
          darkest: '#0a0e1a',
          dark: '#111827',
          
          // ✅ Primary colors (Cyan/Teal - refined)
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee',
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63',
          },
          
          // ✅ Accent colors (Green - success/growth)
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          
          // ✅ Warm accent (Gold/Amber - premium feel)
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          
          // ✅ Purple accent (Governance / voting color)
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
          },
        },
      },
      extend: {
        colors: {
          tapirGlow: {
            light: "#22c55e",
            mid: "#06b6d4",
            deep: "#a855f7",
          },
       },
       backgroundImage: {
         "tapir-gradient":
         "linear-gradient(135deg, #06b6d4, #22c55e, #a855f7)",
        },
         animation: {
           gradientShift: "gradientShift 8s ease infinite",
           shimmerSlow: "shimmer 3s linear infinite",
        },
         keyframes: {
           gradientShift: {
             "0%": { backgroundPosition: "0% 50%" },
             "50%": { backgroundPosition: "100% 50%" },
             "100%": { backgroundPosition: "0% 50%" },
           },
        },
      },


      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },

      backdropBlur: {
        xs: '2px',
      },

      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glow-lg': '0 0 40px rgba(6, 182, 212, 0.6)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(6, 182, 212, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 12px 48px rgba(6, 182, 212, 0.3)',
      },

      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.8)',
            transform: 'scale(1.05)',
          },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
