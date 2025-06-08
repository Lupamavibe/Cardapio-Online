
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./*.html",
  "./**/*.html",
  "./*.js",
  "./**/*.js",
  "!./node_modules", // exclui node_modules explicitamente
  ],
  theme: {
    fontFamily:{
      'sans': ['Poppins','sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}
