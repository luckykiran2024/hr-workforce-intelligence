import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9ddfd",
          300: "#7cc2fb",
          400: "#36a3f7",
          500: "#0c87eb",
          600: "#026ac9",
          700: "#0354a2",
          800: "#074786",
          900: "#0c3c6f",
          950: "#08264a",
        },
        slate: {
          850: "#151e2e",
          950: "#090d16",
        }
      },
    },
  },
  plugins: [],
};
export default config;
