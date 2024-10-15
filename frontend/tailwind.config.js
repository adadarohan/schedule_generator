/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  
  theme: {
    fontFamily: {
      serif: ['Playfair Display', 'serif'],
      display: ['Young Serif' , 'serif'],
      sans : ['Raleway', 'sans']
    },
    extend: {
    },
  },
  plugins: [],
}

