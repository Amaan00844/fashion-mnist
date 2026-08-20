import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        claude: {
          bg: '#f3f1eb',
          surface: '#ffffff',
          text: '#2d2d2d',
          muted: '#737373',
          border: '#e5e3db',
          accent: '#d97757',
          accentHover: '#c26547'
        }
      },
    },
  },
  plugins: [],
};

export default config;
