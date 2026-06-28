/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0f1d',         // Deep slate blue-black for main page background
          card: '#121a2e',       // Matte dark blue for cards
          border: '#1f2e4d',     // Subtle blue border color
          text: '#f1f5f9',       // Clean off-white for headers
          muted: '#94a3b8'       // Soft gray for details
        },
        brand: {
          primary: '#00f0ff',    // Neon cyan for highlights and main actions
          secondary: '#3b82f6',  // Cool blue for charts & gradients
          accent: '#8b5cf6',     // Indigo/purple for alerts and hover effects
          success: '#10b981',    // Emerald green for INVEST badge
          danger: '#ef4444'      // Coral red for PASS badge
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 240, 255, 0.15)',
        'glow-success': '0 0 15px rgba(16, 185, 129, 0.25)',
        'glow-danger': '0 0 15px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
