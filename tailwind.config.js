/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // All surfaces use CSS vars so they switch on dark mode automatically
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-surface-subtle) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-ink-subtle) / <alpha-value>)',
        },
        brand: {
          DEFAULT: '#0E3D2E',
          50: '#E8F1EC',
          100: '#C9DDD2',
          200: '#95BAA6',
          300: '#5E957C',
          400: '#2F745A',
          500: '#1A5A45',
          600: '#0E3D2E',
          700: '#0A2E22',
          800: '#061F17',
          900: '#04140F',
        },
        success: {
          DEFAULT: '#16A34A',
          bg: 'rgb(var(--color-success-bg) / <alpha-value>)',
          fg: 'rgb(var(--color-success-fg) / <alpha-value>)',
        },
        warning: {
          DEFAULT: '#D97706',
          bg: 'rgb(var(--color-warning-bg) / <alpha-value>)',
          fg: 'rgb(var(--color-warning-fg) / <alpha-value>)',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg: 'rgb(var(--color-danger-bg) / <alpha-value>)',
          fg: 'rgb(var(--color-danger-fg) / <alpha-value>)',
        },
        gold: {
          DEFAULT: '#C9A961',
          50: '#FCF7EC',
          100: '#F5E9CB',
          200: '#EAD292',
          300: '#DCBB6A',
          400: '#D0A852',
          500: '#C9A961',
          600: '#A8884A',
          700: '#836B3B',
          800: '#5F4D2C',
          900: '#3D321E',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cal Sans"', 'Inter Variable', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      borderRadius: {
        badge: '6px',
        element: '8px',
        card: '14px',
        pill: '999px',
        dialog: '20px',
      },
      boxShadow: {
        xs: '0 1px 2px rgb(0 0 0 / 0.04)',
        card: '0 1px 3px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.04)',
        'card-hover': '0 12px 32px rgb(0 0 0 / 0.10), 0 4px 8px rgb(0 0 0 / 0.04)',
        elevated: '0 16px 48px rgb(0 0 0 / 0.12), 0 4px 16px rgb(0 0 0 / 0.06)',
        focus: '0 0 0 3px rgb(14 61 46 / 0.25)',
        glow: '0 0 40px rgb(14 61 46 / 0.30)',
        'glow-gold': '0 0 40px rgb(201 169 97 / 0.35)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-up': {
          '0%': { transform: 'translateY(20px) scale(0.8)', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { transform: 'translateY(-60px) scale(1.2)', opacity: '0' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1) rotate(180deg)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out',
        'slide-in-right': 'slide-in-right .35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up .3s cubic-bezier(0.16, 1, 0.3, 1)',
        shake: 'shake 0.4s ease-in-out',
        shimmer: 'shimmer 2s linear infinite',
        'float-up': 'float-up 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        sparkle: 'sparkle 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
