import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      transitionProperty: {
        "colors-all":
          "color, background-color, border-color, text-decoration-color, fill, stroke",
      },
      transitionDuration: {
        "250": "250ms",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-8px) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-8px) scale(0.95)",
          },
        },
        float: {
          "0%": {
            transform: "translateY(0) scale(0.9)",
            opacity: "0.3",
          },
          "50%": {
            transform: "translateY(-4px) scale(1.1)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(0) scale(0.9)",
            opacity: "0.3",
          },
        },
        ripple: {
          "0%": {
            transform: "scale(0.8)",
            opacity: "0.9",
          },
          "40%": {
            transform: "scale(2)",
            opacity: "0.5",
          },
          "70%": {
            transform: "scale(3.5)",
            opacity: "0.2",
          },
          "100%": {
            transform: "scale(5)",
            opacity: "0",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.3s ease-out",
        "slide-down": "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 2s ease-in-out infinite",
        ripple: "ripple 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
