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
  history: Plan[];

  // الدوال (Actions)
  setEnvironment: (env: 'dev' | 'prod') => void;
  setApiKey: (key: string) => void;
  setLocalIp: (ip: string) => void;
  setModelName: (model: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addPlan: (plan: Plan) => void;
  toggleIdea: (planId: string, catIdx: number, ideaIdx: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // القيم الابتدائية (تُقرأ من التخزين عند فتح التطبيق)
  environment: StorageService.getEnvironment(),
  apiKey: StorageService.getApiKey(),
  localIp: StorageService.getLocalIp(),
  modelName: StorageService.getModelName(), // سنضيف هذه الدالة في storage
  theme: StorageService.getTheme(),
  history: StorageService.getHistory(),

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
  addPlan: (plan) => {
    StorageService.savePlan(plan);
    set({ history: StorageService.getHistory() });
  },
  toggleIdea: (planId, catIdx, ideaIdx) => {
    // هنا نستدعي دالة التخزين التي تعدل الحالة، ثم نحدث الحالة العامة
    StorageService.toggleIdeaDone(planId, catIdx, ideaIdx);
    set({ history: StorageService.getHistory() });
  },
}));