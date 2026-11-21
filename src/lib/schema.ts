import { z } from 'zod';

// 1. دالة مساعدة لتنظيف النصوص من علامات التنصيص والمسافات الزائدة
const cleanString = (val: unknown) => {
  if (typeof val === 'string') {
    // إزالة علامات التنصيص المفردة والمزدوجة من البداية والنهاية
    return val.replace(/^["']|["']$/g, '').trim();
  }
  return val;
};

// 2. التحقق من الفكرة الواحدة
export const IdeaSchema = z.object({
  title: z.string().min(1),
  type: z.preprocess(cleanString, z.enum(['task', 'thought'])), // أضفنا نوع الفكرة (مهمة أو فكرة)
  priority: z.preprocess(cleanString, z.enum(['عاجل', 'مهم', 'لاحقاً'])),
  nextStep: z.string().min(1),
  estimatedEffort: z.preprocess(cleanString, z.enum(['سهل', 'متوسط', 'صعب'])),
});

// 3. التحقق من المجموعة
export const CategorySchema = z.object({
  categoryName: z.string().min(1),
  ideas: z.array(IdeaSchema).min(1),
});

// 4. التحقق من الرد الكامل
export const AiResponseSchema = z.object({
  categories: z.array(CategorySchema).min(1),
  mergedSuggestions: z.array(z.string()),
});

export type ValidatedAiResponse = z.infer<typeof AiResponseSchema>;