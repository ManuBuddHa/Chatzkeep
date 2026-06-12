/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        healthcare: {
          50: '#f0f7f4',
          100: '#e1efe9',
          600: '#2d8a6b', // The primary deep teal/green button color from Figma
          700: '#236b53', 
          900: '#123b2e',
        }
      }
    },
  },
  plugins: [],
}