/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // START of added utilities
      screens: {
        'xs': '475px',
      },
      // END of added utilities

      colors: {
        tapir: {
          cyan: '#24d1dc',        // Mermaid Net - Primary accent
          green: '#74ef93',       // Grotesque Green - Highlights
          dark: '#0c6874',        // Kingfisher Bright - Dark backgrounds
          accent: '#449454',      // Discover Deco - Buttons
          success: '#0f892e',     // Oriental Herbs - Success states
          darkest: '#2c533f',     // Green Stain - Deep backgrounds
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(36, 209, 220, 0.5)',
            transform: 'scale(1)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(36, 209, 220, 0.8)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
  },
  plugins: [],
}