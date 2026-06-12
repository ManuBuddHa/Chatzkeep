/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // If you have folders like pages/ or src/, include them here:
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        healthcare: {
          50: '#f0f7f4',
          100: '#e1efe9',
          600: '#2d8a6b', // Dark emerald green accent from ChatzKeep Developer Task PDF[cite: 1]
          700: '#236b53', 
          900: '#123b2e',
        }
      }
    },
  },
  plugins: [],
}