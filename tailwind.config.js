/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Color System
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3', // Primary blue
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        surface: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#bdbdbd',
        },
        // Semantic colors
        positive: '#4caf50', // Green
        negative: '#f44336', // Red/Orange
        warning: '#ff9800',
        info: '#2196f3',
        // Keep existing brand colors for specific elements
        brand: {
          50: '#f6f7f4',
          100: '#e9ebdd',
          200: '#d4d8be',
          300: '#b7bf96',
          400: '#9ca674',
          500: '#7f8c58',
          600: '#636f44',
          700: '#4e5638',
          800: '#283618',
          900: '#242f15',
        }
      },
      fontFamily: {
        // Material Design 3 Typography with Satoshi for headlines
        sans: ['Inter', 'Helvetica', 'Arial', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        headline: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Helvetica', 'Arial', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Material Design 3 Type Scale
        'display-large': ['57px', { lineHeight: '64px', fontWeight: '400' }],
        'display-medium': ['45px', { lineHeight: '52px', fontWeight: '400' }],
        'display-small': ['36px', { lineHeight: '44px', fontWeight: '400' }],
        'headline-large': ['32px', { lineHeight: '40px', fontWeight: '400' }],
        'headline-medium': ['28px', { lineHeight: '36px', fontWeight: '400' }],
        'headline-small': ['24px', { lineHeight: '32px', fontWeight: '400' }],
        'title-large': ['22px', { lineHeight: '28px', fontWeight: '500' }],
        'title-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'title-small': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'body-large': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-medium': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-small': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-large': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-medium': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-small': ['11px', { lineHeight: '16px', fontWeight: '500' }],
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        'semi-bold': '600',
        bold: '700',
      },
      borderRadius: {
        'none': '0',
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'elevation-1': '0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
        'elevation-2': '0px 2px 6px 0px rgba(0, 0, 0, 0.12)',
        'elevation-3': '0px 4px 8px 0px rgba(0, 0, 0, 0.12)',
        'elevation-4': '0px 6px 12px 0px rgba(0, 0, 0, 0.15)',
        'elevation-5': '0px 8px 16px 0px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};