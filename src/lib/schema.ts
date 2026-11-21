import { z } from 'zod';

// 1. دالة مساعدة لتنظيف النصوص من علامات التنصيص والمسافات الزائدة
const cleanString = (val: unknown) => {
  if (typeof val === 'string') {
    return val.replace(/^["']|["']$/g, '').trim();
  }
  return val;
};

// توحيد الأولوية (تقبل الإنجليزية أو العربية وتحوّلها للعربية)
const normalizePriority = (val: unknown) => {
  const cleaned = typeof val === 'string' ? cleanString(val) as string : '';
  const lower = cleaned.toLowerCase();
  if (lower === 'high' || cleaned === 'عاجل') return 'عاجل';
  if (lower === 'medium' || cleaned === 'مهم' || cleaned === 'متوسط') return 'مهم';
  if (lower === 'low' || cleaned === 'لاحقاً' || cleaned === 'لاحقا') return 'لاحقاً';
  return 'مهم'; // قيمة افتراضية آمنة تمنع انهيار التحليل
};

// توحيد الجهد (تقبل الإنجليزية أو العربية وتحوّلها للعربية)
const normalizeEffort = (val: unknown) => {
  const cleaned = typeof val === 'string' ? cleanString(val) as string : '';
  const lower = cleaned.toLowerCase();
  if (lower === 'easy' || cleaned === 'سهل') return 'سهل';
  if (lower === 'medium' || cleaned === 'متوسط') return 'متوسط';
  if (lower === 'hard' || cleaned === 'صعب') return 'صعب';
  return 'متوسط'; // قيمة افتراضية آمنة
};

// توحيد النوع (إذا لم يرسله النموذج نعتبره فكرة عامة)
const normalizeType = (val: unknown) => {
  const cleaned = typeof val === 'string' ? cleanString(val) as string : '';
  const lower = cleaned.toLowerCase();
  if (lower === 'task' || cleaned === 'مهمة') return 'task';
  return 'thought';
};

// 2. التحقق من الفكرة الواحدة
export const IdeaSchema = z.object({
  title: z.preprocess(cleanString, z.string().min(1)),
  type: z.preprocess(normalizeType, z.enum(['task', 'thought'])).default('thought'),
  priority: z.preprocess(normalizePriority, z.enum(['عاجل', 'مهم', 'لاحقاً'])),
  nextStep: z.preprocess(cleanString, z.string()).optional().default(''),
  estimatedEffort: z.preprocess(normalizeEffort, z.enum(['سهل', 'متوسط', 'صعب'])),
});

// 3. التحقق من المجموعة
export const CategorySchema = z.object({
  categoryName: z.preprocess(cleanString, z.string().min(1)),
  ideas: z.array(IdeaSchema).min(1),
});

// 4. التحقق من الرد الكامل
export const AiResponseSchema = z.object({
  categories: z.array(CategorySchema).min(1),
  mergedSuggestions: z.array(z.string()).optional().default([]),
});

export type ValidatedAiResponse = z.infer<typeof AiResponseSchema>;