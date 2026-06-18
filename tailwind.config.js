export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#0A0E1A',
        primary: '#6366F1',
        text: '#F8FAFC',
        secondary: '#94A3B8',
        accent: '#10B981',
        card: '#111827',
        border: '#1E293B',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(99,102,241,0.22)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
