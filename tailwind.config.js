/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'korean': [
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          '맑은 고딕',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}