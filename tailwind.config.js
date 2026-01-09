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
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

