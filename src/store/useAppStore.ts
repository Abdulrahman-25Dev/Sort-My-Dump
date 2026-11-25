import { create } from 'zustand';
import { StorageService } from '../lib/storage';
import { Plan } from '../types';

interface AppState {
  // الحالة
  environment: 'dev' | 'prod';
  apiKey: string;
  localIp: string;
  modelName: string;
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  isOnboardingCompleted: boolean;
  history: Plan[];

  // مزامنة التخزين المحلي بعد التحميل
  hydrate: () => void;

  // الدوال (Actions)
  setEnvironment: (env: 'dev' | 'prod') => void;
  setApiKey: (key: string) => void;
  setLocalIp: (ip: string) => void;
  setModelName: (model: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ar' | 'en') => void;
  completeOnboarding: () => void;
  addPlan: (plan: Plan) => void;
  clearHistory: () => void;
  toggleIdea: (planId: string, catIdx: number, ideaIdx: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // قيم افتراضية آمنة (لا تستدعي التخزين وقت تقييم السيرفر)
  environment: 'prod',
  apiKey: '',
  localIp: '',
  modelName: '',
  theme: 'light',
  language: 'ar',
  isOnboardingCompleted: false,
  history: [],

  hydrate: () => {
    try {
      set({
        environment: StorageService.getEnvironment(),
        apiKey: StorageService.getApiKey(),
        localIp: StorageService.getLocalIp(),
        modelName: StorageService.getModelName(),
        theme: StorageService.getTheme(),
        language: StorageService.getLanguage(),
        isOnboardingCompleted: StorageService.getIsOnboardingCompleted(),
        history: StorageService.getHistory(),
      });
    } catch {
      // تجاهل في حال عدم توفر التخزين في بيئة غير مدعومة
    }
  },

  // الدوال
  setEnvironment: (environment) => {
    StorageService.setEnvironment(environment);
    set({ environment });
  },
  setApiKey: (apiKey) => {
    StorageService.setApiKey(apiKey);
    set({ apiKey });
  },
  setLocalIp: (localIp) => {
    StorageService.setLocalIp(localIp);
    set({ localIp });
  },
  setModelName: (modelName) => {
    StorageService.setModelName(modelName);
    set({ modelName });
  },
  setTheme: (theme) => {
    StorageService.setTheme(theme);
    set({ theme });
  },
  setLanguage: (language) => {
    StorageService.setLanguage(language);
    set({ language });
  },
  completeOnboarding: () => {
    StorageService.setOnboardingCompleted(true);
    set({ isOnboardingCompleted: true });
  },
  addPlan: (plan) => {
    StorageService.savePlan(plan);
    set({ history: StorageService.getHistory() });
  },
  clearHistory: () => {
    StorageService.clearHistory();
    set({ history: [] });
  },
  toggleIdea: (planId, catIdx, ideaIdx) => {
    StorageService.toggleIdeaDone(planId, catIdx, ideaIdx);
    set({ history: StorageService.getHistory() });
  },
}));