// FullstackBrand
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: '#09090b',
          light: '#fafafa',
        },
        surface: {
          dark: '#18181b',
          light: '#ffffff',
          borderDark: 'rgba(255, 255, 255, 0.08)',
          borderLight: '#e4e4e7',
        },
        brand: {
          light: '#00CC60',
          dark: '#00CC60',
          electric: '#22C55E',
          obsidian: '#09090b',
          offwhite: '#fafafa',
        },
        agency: {
          DEFAULT: '#10b981',
          hover: '#059669',
          badge: '#34d399',
          glow: 'rgba(16, 185, 129, 0.35)',
          light: '#10B981',
          dark: '#059669',
          accent: '#00CC60',
          electric: '#22C55E',
          emerald: '#10B981',
          deep: '#047857',
        },
        lab: {
          DEFAULT: '#8b5cf6',
          hover: '#7c3aed',
          badge: '#c084fc',
          glow: 'rgba(139, 92, 246, 0.35)',
          light: '#A78BFA',
          dark: '#7C3AED',
          deep: '#6D28D9',
          electric: '#9333EA',
          obsidian: '#09090b',
          surface: '#18181b',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-violet': 'glowViolet 2s ease-in-out infinite alternate',
        'glow-emerald': 'glowEmerald 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 255, 102, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 102, 0.6)' },
        },
        glowViolet: {
          '0%': { boxShadow: '0 0 12px rgba(139, 92, 246, 0.25)' },
          '100%': { boxShadow: '0 0 28px rgba(139, 92, 246, 0.65)' },
        },
        glowEmerald: {
          '0%': { boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)' },
          '100%': { boxShadow: '0 0 28px rgba(16, 185, 129, 0.65)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config