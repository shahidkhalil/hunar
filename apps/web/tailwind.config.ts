import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF5EF",
        brown: {
          warm: "#6B4F3B",
        },
        charcoal: "#2B2B2B",
        gold: {
          soft: "#C5A880",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;

