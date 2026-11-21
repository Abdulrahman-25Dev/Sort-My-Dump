/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // اللون الأساسي: Sage متزن ومقروء في الوضعين
        primary: {
          light: '#3D6352',
          dark: '#7AA891',
        },
        // لون التمييز (مثل زر الترتيب أو المؤشرات النشطة): أهدأ من الليموني الفاقع
        accent: {
          light: '#2F5242',
          dark: '#8BB8A1',
        },
        // الخلفيات: مريحة للعين بدون حدة
        bg: {
          light: '#F5F7F5',
          dark: '#0F1412',
        },
        // البطاقات: تباين لطيف ومريح فوق الخلفية
        card: {
          light: '#FFFFFF',
          dark: '#18201D',
        },
        // الحدود والأسطح الثانوية
        surface: {
          light: '#E3EAE6',
          dark: '#26322D',
        },
      },
    },
  },
  plugins: [],
};