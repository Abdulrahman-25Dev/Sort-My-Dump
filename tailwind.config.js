/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // لون رئيسي أهدأ وأكثر تميزاً من الأزرق التقليدي
        primary: {
          light: '#4F46E5', // Indigo 600 — واضح وأنيق في النهار
          dark: '#818CF8',  // Indigo 400 — مريح وواضح في الداكن
        },
        // خلفيات هادئة بدون حدة
        bg: {
          light: '#F6F5F2', // Warm Stone / Off-white مريح للعين
          dark: '#09090B',  // Zinc 950 عميق ونظيف
        },
        // بطاقات متدرجة بوضوح عن الخلفية
        card: {
          light: '#FFFFFF', // أبيض نقي يبرز فوق الخلفية الدافئة
          dark: '#18181B',  // Zinc 900 متزن مع الخلفية الداكنة
        },
        // حدود وشارات ثانوية خفيفة
        surface: {
          light: '#ECEAE4',
          dark: '#27272A',
        },
      },
    },
  },
  plugins: [],
};