module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['HelveticaNowDisplay-Medium', 'sans-serif'],
        body: ['HelveticaNowDisplayW01-Rg', 'sans-serif'],
        bengali: ['Hind Siliguri', 'serif']
      },
      colors: {
        violet: '#7C3AED',
        pink: '#EC4899',
        yellow: '#FACC15',
        navy: '#0F172A'
      }
    },
  },
  plugins: [],
}
