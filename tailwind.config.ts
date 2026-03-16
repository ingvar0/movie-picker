import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: "#0a0a0b",
          900: "#121214",
          800: "#1a1a1e",
          700: "#252529",
          600: "#2e2e33",
        },
        gold: {
          400: "#d4af37",
          500: "#c9a227",
          600: "#b8860b",
        },
        velvet: {
          500: "#722f37",
          600: "#5c262c",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-cinema":
          "linear-gradient(135deg, #0a0a0b 0%, #1a1a1e 40%, #252529 100%)",
        "gradient-gold": "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(212, 175, 55, 0.3)",
        "glow-strong": "0 0 60px -5px rgba(212, 175, 55, 0.4)",
        inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
