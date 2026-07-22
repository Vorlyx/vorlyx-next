/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "1024px",
      lg: "1280px",
      xl: "1536px",
      "2xl": "1920px",
      ipad: { min: "768px", max: "1366px" },
      ipadpro: { min: "1024px", max: "1366px" },
    },
    extend: {
      colors: {
        vorlyx: {
          black: "#000000",
          "dark-gray": "#171717",
          "light-gray": "#EDEDED",
          gray: "#4A4A4A",
          "text-gray": "#7F7F7F",
          "light-text": "#E1E1E1",
        },
      },
      fontFamily: {
        lato: ["var(--font-lato)", "sans-serif"],
      },
      fontSize: {
        nav: "30px",
        "hero-headline": "73px",
        "hero-body": "58px",
        button: "60px",
        "section3-headline": "58px",
        "section3-body": "52px",
        "section4-title": "50px",
        "section4-body": "52px",
        "section4-headline": "234px",
        "footer-nav": "74px",
        "footer-title": "24px",
        "footer-link": "33px",
        "footer-email": "49px",
        "footer-copyright": "19px",
      },
    },
  },
  plugins: [],
};
