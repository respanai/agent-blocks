import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF6F1",
        "node-start": "#7D9B76",
        "node-prompt": "#7B96AA",
        "node-decision": "#C4836A",
        "node-human": "#B08B99",
        "node-end": "#8B5E5E",
        selected: "#C4A35A",
        surface: "#F0E8DE",
        "surface-light": "#E2D8CC",
      },
      fontFamily: {
        mono: ["EB Garamond", "serif"],
        sans: ["EB Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
