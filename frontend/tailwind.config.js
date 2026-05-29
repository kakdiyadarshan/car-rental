/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shared & d_style / h_style palette (Black theme)
        'x-bg': '#0a0b0f',
        'x-surface': '#111318',
        'x-surface2': '#1a1d25',
        'x-border': 'rgba(255, 255, 255, 0.07)',
        'x-border-active': 'rgba(221, 111, 39, 0.4)',
        'x-text': '#ff8615',
        'x-text-muted': 'rgba(240, 237, 232, 0.45)',
        'x-primary': '#dd6f27',
        'x-primary-glow': '#dd6f2733',
        'x-accent': '#e8c97a',
        'x-accent-hover': '#b34a08',
        'bg-primary': "#ff8615",
        'primary-text': "#ff8615",


        // z_styles palette (Dark Blue theme)
        'z-bg': '#0f172a',
        'z-card': '#1e293b',
        'z-border': '#334155',
        'z-text': '#f8fafc',
        'z-grey': '#94a3b8',
        'z-primary': '#dd6f27',
        'z-primary-dark': '#b84f1c',
      },
      // fontFamily: {
      //   bebas:   ['"Bebas Neue"', 'sans-serif'],
      //   dm:      ['"DM Sans"', 'sans-serif'],
      //   jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      //   playfair:['"Playfair Display"', 'serif'],
      //   segoe:   ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      // },
      backgroundImage: {
        'btn-orange':
          'radial-gradient(50% 50% at 50% 100%, rgb(255, 177, 104) 0%, rgb(227, 109, 0) 100%)',
        'btn-orange-hover':
          'radial-gradient(50% 50% at 50% 100%, rgb(255, 200, 140) 0%, rgb(255, 128, 0) 100%)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      boxShadow: {
        'x-shadow': '0 14px 30px rgba(0, 0, 0, 0.4)',
        'x-glow': '0 0 15px rgba(221, 111, 39, 0.2)',
        'admin-card': '0 10px 20px rgba(0, 0, 0, 0.2)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'btn-orange':
          'radial-gradient(50% 50% at 50% 100%, rgb(255, 177, 104) 0%, rgb(227, 109, 0) 100%)',
      },
      borderRadius: {
        'x-radius': '24px',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        x_slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        modalFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 30px))' },
        }
      },
      animation: {
        slideUp: 'slideUp 0.5s ease-out',
        x_slideUp: 'x_slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        fadeIn: 'fadeIn 0.3s ease',
        scaleIn: 'scaleIn 0.5s ease-out',
        modalFadeIn: 'modalFadeIn 0.3s ease-out',
        fadeInScale: 'fadeInScale 0.3s ease',
        ticker: 'ticker 40s linear infinite',
      },
      screens: {
        'xs': '360px',
      },
    },
  },
  plugins: [],
}


