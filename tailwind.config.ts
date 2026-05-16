import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom awareness platform colors
        neon: {
          cyan: "#00f5ff",
          purple: "#b400ff",
          green: "#00ff88",
          orange: "#ff6b00",
          pink: "#ff00aa",
        },
        void: {
          950: "#03050a",
          900: "#060c18",
          800: "#0a1628",
          700: "#0f2040",
          600: "#162d58",
        },
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glow-cyan": "radial-gradient(ellipse at center, rgba(0,245,255,0.15) 0%, transparent 70%)",
        "glow-purple": "radial-gradient(ellipse at center, rgba(180,0,255,0.15) 0%, transparent 70%)",
        "mesh-dark": "radial-gradient(at 27% 37%, hsla(215,98%,61%,0.08) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(266,98%,61%,0.08) 0px, transparent 50%)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "ripple": "ripple 1.5s linear infinite",
        "particle-drift": "particle-drift 20s linear infinite",
        "chain-pulse": "chain-pulse 2s ease-in-out infinite",
        "text-shimmer": "text-shimmer 3s linear infinite",
        "border-beam": "border-beam 4s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(0,245,255,0.3)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(0,245,255,0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "particle-drift": {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "100%": { transform: "translate(100px, -100px) rotate(360deg)" },
        },
        "chain-pulse": {
          "0%, 100%": { strokeDashoffset: "0" },
          "50%": { strokeDashoffset: "20" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "-200%" },
          "100%": { backgroundPosition: "200%" },
        },
        "border-beam": {
          "0%": { offsetDistance: "0%" },
          "100%": { offsetDistance: "100%" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.2)",
        "glow-purple": "0 0 20px rgba(180,0,255,0.4), 0 0 60px rgba(180,0,255,0.2)",
        "glow-green": "0 0 20px rgba(0,255,136,0.4), 0 0 60px rgba(0,255,136,0.2)",
        "glow-orange": "0 0 20px rgba(255,107,0,0.4), 0 0 60px rgba(255,107,0,0.2)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-glow": "0 4px 24px rgba(0,245,255,0.1), 0 0 0 1px rgba(0,245,255,0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
