/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ["Pangolin_400Regular"],
      heading: ["LilitaOne_400Regular"],
    },
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".font-bold": {
          fontFamily: "LilitaOne_400Regular",
        },
        ".font-semibold": {
          fontFamily: "LilitaOne_400Regular",
        },
        ".font-medium": {
          fontFamily: "Pangolin_400Regular",
        },
      });
    },
  ],
};
