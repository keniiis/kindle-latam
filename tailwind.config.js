/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8c25f4",
        "background-light": "#f7f5f8",
        "background-dark": "#191022",
        // Landing nueva (crema / terracota / verde bosque)
        paper: { DEFAULT: "#faf5eb", 2: "#f3ecdc", 3: "#e9ddc5" },
        ink: { DEFAULT: "#16110b", 2: "#2a2117", 3: "#4a3f30" },
        clay: { DEFAULT: "#e4572e", deep: "#c7431f", soft: "#f9d9cc" },
        gold: { DEFAULT: "#c9a86a", soft: "#f0e3c8" },
        forest: { DEFAULT: "#1c2b21", 2: "#243829" },
        sage: "#b8c9b5",
        night: "#14100c",
      },
      // Opacidades que la landing usa y no vienen en la escala de Tailwind 3
      opacity: { 6: "0.06", 8: "0.08", 12: "0.12" },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
        // Landing: los nombres no pisan a "display" (la herramienta web sigue con Jakarta)
        fraunces: ['var(--font-fraunces)', 'Georgia', 'serif'],
        instrument: ['var(--font-instrument)', 'Georgia', 'serif'],
        grotesk: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        jbmono: ['var(--font-jbmono)', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

