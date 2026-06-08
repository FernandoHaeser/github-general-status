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
        pixel: ["var(--font-pixel)", "monospace"],
        vt: ["var(--font-vt)", "monospace"],
      },
      colors: {
        bg: "#0d1117",
        card: "#0a0f1a",
        green: "#00ff41",
        "green-dim": "#00b32c",
        cyan: "#00e5ff",
        yellow: "#ffd700",
        red: "#ff4444",
        purple: "#b388ff",
        blue: "#58a6ff",
        gray: "#7d8590",
        border: "#21262d",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "scan": "scan 4s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "slide-in": "slideIn 0.5s ease-out",
        "fill": "fill 1.2s ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fill: {
          from: { width: "0%" },
          to: { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
