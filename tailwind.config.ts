import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors
        background: '#fafbf7',
        surface: '#ffffff',
        border: '#e2e8df',
        
        // Primary Green Palette
        primary: {
          DEFAULT: '#2d5a3d',
          light: '#4a7c59',
          muted: '#8fae98',
          bg: '#f0f7f2',
        },
        
        // Accent Colors
        accent: {
          warm: '#c4856a',
          sky: '#7ba3c9',
        },
        
        // Risk Level Colors
        risk: {
          critical: '#d97559',
          endangered: '#d4915a',
          vulnerable: '#c9a94e',
          near: '#6b9bc3',
          least: '#6aab7a',
        },
        
        // Text Hierarchy
        heading: '#1a3325',
        body: '#3d4f42',
        muted: '#6b7d6f',
        subtle: '#9ba89f',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(45, 90, 61, 0.04), 0 4px 12px rgba(45, 90, 61, 0.06)',
        'card-hover': '0 4px 16px rgba(45, 90, 61, 0.08), 0 8px 24px rgba(45, 90, 61, 0.06)',
        'button': '0 1px 2px rgba(45, 90, 61, 0.08)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '6px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
