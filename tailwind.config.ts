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
        luxury: {
          warmWhite: "#FDFDFB", // warm stone white
          cream: "#FAF7F2",     // soft cream
          beige: "#F0EAE1",     // soft beige
          stone: "#8B8476",     // stone beige/grey
          charcoal: "#1E1E1C",  // rich warm charcoal
          olive: "#4B5340",     // deep olive green
          gold: "#C5A880",      // muted elegant gold
          goldLight: "#DFD3C3"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 8px 30px rgba(27, 27, 27, 0.03)",
        luxuryHover: "0 20px 40px rgba(27, 27, 27, 0.06)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.04)"
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px'
      }
    },
  },
  plugins: [],
};
export default config;
