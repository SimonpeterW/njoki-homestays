import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D2691E",
        secondary: "#2D5016",
        accent: "#F0A04D",
      },
    },
  },
  plugins: [],
}
export default config
