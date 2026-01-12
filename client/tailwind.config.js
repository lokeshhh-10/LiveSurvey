/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        light: {
          bg: '#F9FAFB',
          card: '#FFFFFF',
          primary: '#4F46E5',
          text: '#111827',
          border: '#E5E7EB',
        },
        dark: {
          bg: '#0F172A',
          card: '#020617',
          primary: '#6366F1',
          text: '#E5E7EB',
          border: '#1E293B',
        },
      },
    },
  },
  plugins: [],
}

