import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          500: '#8b5cf6', // violet électrique
          600: '#7c3aed',
          700: '#6d28d9',
          900: '#4c1d95',
        },
        neon: {
          green: '#00ff88',
          purple: '#bf00ff',
          blue: '#0099ff',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#2a2a2a',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px #8b5cf6' },
          '100%': { boxShadow: '0 0 30px #8b5cf6, 0 0 40px #8b5cf6' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseNeon: {
          '0%, 100%': { 
            boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88',
            textShadow: '0 0 5px #00ff88'
          },
          '50%': { 
            boxShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88',
            textShadow: '0 0 10px #00ff88'
          },
        },
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'modern': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
export default config;