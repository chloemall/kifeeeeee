const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add any other paths you want to include for purging
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        customGray: {
          100: "#252A34",
          200: "#1E1E1E",
          // Add more custom colors as needed
        },
        // Add other color customizations here
      },
      fontFamily: {
        // Define your custom fonts here
        lato: ["Lato", "sans-serif"],
        // Add more custom fonts as needed
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // Add any additional Tailwind CSS plugins here
    require("@tailwindcss/forms"), // If you want to use the forms plugin
    require("@tailwindcss/typography"), // If you want to use the typography plugin
  ],
};
