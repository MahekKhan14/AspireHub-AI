/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f3d0fe",
          300: "#e9a8fd",
          400: "#d874f9",
          500: "#c346f0",
          600: "#a827d6",
          700: "#8e1cb0",
          800: "#761b8f",
          900: "#611a74",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
        "fade-in": "fadeIn 0.4s ease both",
        "slide-in": "slideIn 0.4s ease both",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "typing": "typing 1.2s steps(3) infinite",
        "gradient-x": "gradientX 6s ease infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(-16px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        typing: {
          "0%, 100%": { content: "''" },
          "33%": { content: "'·'" },
          "66%": { content: "'··'" },
        },
        gradientX: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
