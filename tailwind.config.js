/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        discord: {
          bg: '#141517',
          surface: '#1c1d21',
          card: '#232428',
          elevated: '#2b2d31',
          hover: '#313338',
          border: '#3a3c42',
          line: '#2a2b30',
          text: '#e3e5e8',
          muted: '#9aa0a8',
          faint: '#6a6f78',
          blurple: '#5865f2',
          'blurple-hover': '#4752c4',
          dark: '#0f0f12',
          darker: '#0a0a0d',
        },
        role: {
          leader: '#ef4444',
          'leader-soft': 'rgba(239,68,68,0.14)',
          qa: '#f43f5e',
          'qa-soft': 'rgba(244,63,94,0.14)',
          prostaff: '#3b82f6',
          'prostaff-soft': 'rgba(59,130,246,0.14)',
        },
        status: {
          pending: '#9aa0a8',
          progress: '#5865f2',
          reviewing: '#f59e0b',
          done: '#22c55e',
          cancelled: '#6a6f78',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease',
        'slide-up': 'slide-up 0.3s ease',
      },
    },
  },
  plugins: [],
}
