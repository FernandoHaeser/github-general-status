import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        bg: "#0d1117",
        surface: "#161b22",
        "surface-2": "#1c2128",
        border: "#30363d",
        "border-subtle": "#21262d",
        "text-primary": "#e6edf3",
        "text-secondary": "#8b949e",
        "text-muted": "#6e7681",
        blue: "#58a6ff",
        green: "#3fb950",
        orange: "#f0883e",
        purple: "#a371f7",
        cyan: "#39d3f2",
        red: "#f85149",
      },
      animation: {
        "fade-up": "fadeUp 0.45s ease-out forwards",
        "fill": "fillBar 1s cubic-bezier(0.4,0,0.2,1) forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fillBar: {
          from: { width: "0%" },
          to: { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
