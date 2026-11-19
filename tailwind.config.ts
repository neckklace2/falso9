import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#06090e",
          900: "#0a0f18",
          850: "#0e1522",
          800: "#131b2c",
          700: "#1d2940",
          600: "#2d3e5e",
        },
        turf: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        impostor: {
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          950: "#450a0a",
        },
        trophy: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slight": "bounceSlight 2s infinite ease-in-out",
        "radar-sweep": "radarSweep 3s linear infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        bounceSlight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
