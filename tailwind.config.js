/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      sans: ["Nunito_400Regular"],
    },
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".font-medium": {
          fontFamily: "Nunito_600SemiBold",
        },
        ".font-semibold": {
          fontFamily: "Nunito_700Bold",
        },
        ".font-bold": {
          fontFamily: "Nunito_700Bold",
        },
      });
    },
  ],
};
