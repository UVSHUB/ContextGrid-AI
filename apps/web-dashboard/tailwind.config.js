/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#111827',
        border: '#1F2937',
        accent: {
          blue: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
