    /** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF1FE",
          100: "#DDE3FD",
          300: "#9CAAF7",
          500: "#5B79F1",
          600: "#4A66D9",
          700: "#3B52B3",
          DEFAULT: "#5B79F1",
        },
        secondary: {
          50: "#FFF1E8",
          100: "#FFD9C2",
          300: "#F9A36B",
          500: "#F2782B",
          600: "#D96522",
          700: "#B9541C",
          DEFAULT: "#F2782B",
        },
        // Neutral surfaces and text tokens
        ink: {
          900: "#0F172A",
          700: "#475569",
          500: "#94A3B8",
          400: "#CBD5E1",
        },
        surface: {
          base: "#FFFFFF",
          app: "#F8FAFC",
          card: "#FFFFFF",
          section: "#F1F5F9",
        },
        border: {
          DEFAULT: "#E2E8F0",
          hover: "#CBD5E1",
          strong: "#94A3B8",
        },
        status: {
          success: "#22C55E",
          info: "#5B79F1",
          warning: "#F2782B",
          error: "#EF4444",
        },
        // Legacy casing kept for existing classNames
        Secondary: "#F2782B",
      },
 
      fontFamily: {
        custom: ['Stratum', 'Barlow', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
    fontFamily: {
      body: ["Poppins", "CustomFont"],
      custom: ['Stratum', 'Barlow', 'Helvetica', 'Arial', 'sans-serif'], // Adding custom font stack here
    },
  },
  
  darkMode: 'class', // Enable dark mode using the 'class' option
  variants: {},
  plugins: [],
};