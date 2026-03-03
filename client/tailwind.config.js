/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '450px',
      sm: '500px',
      mmd: '600px',
      md: '768px',
      lg: '976px',
      llg: '1200px',
      xl: '1440px',
    },

  },
  plugins: [],
}