export type Priority = 'High' | 'Medium' | 'Low';
export type Effort = 'Easy' | 'Medium' | 'Hard';

export interface Idea {
  title: string;
  priority: Priority;
  nextStep: string;
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