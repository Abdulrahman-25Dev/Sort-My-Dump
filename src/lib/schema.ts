import { z } from 'zod';

export const IdeaSchema = z.object({
  title: z.string().min(1),
  priority: z.enum(['High', 'Medium', 'Low']),
  nextStep: z.string().min(1),
  estimatedEffort: z.enum(['Easy', 'Medium', 'Hard']),
});

export const CategorySchema = z.object({
  categoryName: z.string().min(1),
  ideas: z.array(IdeaSchema).min(1),
});

export const AiResponseSchema = z.object({
  categories: z.array(CategorySchema).min(1),
  mergedSuggestions: z.array(z.string()),
});

export type ValidatedAiResponse = z.infer<typeof AiResponseSchema>;