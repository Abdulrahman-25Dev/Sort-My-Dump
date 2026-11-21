/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // اللون الأساسي: مستوحى من الكومبو (فيروزي)
        primary: {
          light: '#0F766E', // Teal 700 (للوضع الفاتح، داككن للتباين)
          dark: '#22D3C5',  // Teal 400 (للوضع الداكن، مقارب للصورة)
        },
        // اللون الثانوي (للتدرجات أو الأزرار الثانوية)
        accent: {
          light: '#0E7490', // Cyan 700
          dark: '#67E8F9',  // Cyan 300
        },
        // الخلفيات
        bg: {
          light: '#F8FAFC', // Slate 50 (أبيض مائل للأزرق الباهت)
          dark: '#09090B',  // Zinc 950 (أسود عميق)
        },
        // البطاقات
        card: {
          light: '#FFFFFF',
          dark: '#18181B',
        },
        // الحدود
        surface: {
          light: '#F1F5F9', // Slate 100
          dark: '#27272A',  // Zinc 800
        },
      },
    },
  },
  plugins: [],
};