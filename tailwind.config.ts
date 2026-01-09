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
                primary: "#8c25f4", // <--- EL PÚRPURA IMPORTANTE
                "background-light": "#f7f5f8",
                "background-dark": "#191022",
            },
            fontFamily: {
                // Aquí conectamos la variable del layout con Tailwind
                display: ['var(--font-jakarta)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;