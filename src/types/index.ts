export type Priority = 'عاجل' | 'مهم' | 'لاحقاً';
export type Effort = 'سهل' | 'متوسط' | 'صعب';

export interface Idea {
  title: string; // الفكرة أو الملاحظة
  priority: Priority;
  nextStep: string; // خطوة عملية مقترحة للفكرة
  estimatedEffort: Effort;
  isDone: boolean;
}

export interface Category {
  categoryName: string;
  ideas: Idea[];
}

export interface AiResponse {
  categories: Category[];
  mergedSuggestions: string[];
}

export interface Plan {
  id: string;
  createdAt: string;
  originalText: string;
  data: AiResponse;
}