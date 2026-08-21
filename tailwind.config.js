/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FFFBF3",
          soft: "#FFF6E9",
          deep: "#FCEFDD",
        },
        ink: {
          DEFAULT: "#332F45",
          soft: "#5B5670",
          faint: "#8B86A0",
        },
        sun: {
          50: "#FFF6E4",
          100: "#FFE9BE",
          200: "#FFD98A",
          300: "#FFC65C",
          400: "#FFB238",
          500: "#F79A1E",
          600: "#DE7F12",
        },
        coral: {
          50: "#FFEEE9",
          100: "#FFD8CB",
          200: "#FFB5A0",
          300: "#FF8F72",
          400: "#FA7157",
          500: "#EF5B41",
          600: "#D2452F",
        },
        sky: {
          50: "#E8F6FC",
          100: "#CDECF8",
          200: "#9FDBF2",
          300: "#67C3E6",
          400: "#3FA9D6",
          500: "#2C8FBE",
          600: "#20728F",
        },
        leaf: {
          50: "#EAF8EE",
          100: "#CFEFD9",
          200: "#A2DFB5",
          300: "#72CB8E",
          400: "#4CB670",
          500: "#369C58",
          600: "#287B44",
        },
        grape: {
          50: "#F2EEFB",
          100: "#E1D8F5",
          200: "#C6B4EB",
          300: "#A78CDD",
          400: "#8E6BCE",
          500: "#7852B8",
          600: "#5F3F96",
        },
        petal: {
          50: "#FFEFF5",
          100: "#FFD6E5",
          200: "#FFAECC",
          300: "#FA84B0",
          400: "#EF6198",
          500: "#D8477E",
          600: "#B23564",
        },
      },
      fontFamily: {
        display: ["'Baloo 2'", "system-ui", "sans-serif"],
        body: ["'Nunito'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "60% 40% 55% 45% / 45% 55% 45% 55%",
        "3xl": "1.75rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 12px 30px -12px rgba(51, 47, 69, 0.18)",
        card: "0 8px 24px -10px rgba(51, 47, 69, 0.15)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
      },
    },
  },
  plugins: [],
};
