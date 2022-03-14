module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    screens: {
      sm: { max: "640px" },
      md: { max: "1050px" },
      lg: { max: "1500px" },
    },
    colors: {
      purple: "#ad1fea",
      "purple-hover": "#c75af6",
      blue: "#4661e6",
      "blue-hover": "#7691f9",
      navy: "#373f68",
      "navy-hover": "#656EA3",
      red: "#D73737",
      "red-hover": "#e98888",
      primary: "#3a4374",
      "primary-disabled": "hsla(231, 33%, 34%, 0.4)",
      secondary: "#647196",
      orange: "#f49f85",
      "light-blue": "#62bcfa",
      "navy-light": "#cfd7ff",
      background: "#f2f4ff",
      gray: "#f7f8fd",
      "dark-gray": "hsla(224, 20%, 49%, .1)",
      black: "hsl(0, 0%, 0%)",
      white: "#ffffff",
      transparent: "transparent",
    },
    extend: {
      borderRadius: {
        xl: "10px",
      },
      boxShadow: {
        md: "0px 10px 40px -7px hsla(230, 31%, 31%, 0.35)",
      },
    },
  },
  variants: {},
  plugins: [],
};
