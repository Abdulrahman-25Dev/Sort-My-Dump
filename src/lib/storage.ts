import { createMMKV } from 'react-native-mmkv';
import { Plan } from '../types';

export const storage = createMMKV();

const KEYS = {
  ENV: 'app_environment',
  API_KEY: 'openrouter_api_key',
  LOCAL_IP: 'ollama_local_ip',
  MODEL_NAME: 'ai_model_name', // تمت إضافته
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  HISTORY: 'plans_history',
};

export const StorageService = {
  // ---------- الإعدادات ----------
  getEnvironment: (): 'dev' | 'prod' => {
    return (storage.getString(KEYS.ENV) as 'dev' | 'prod') || 'dev';
  },
  setEnvironment: (env: 'dev' | 'prod') => {
    storage.set(KEYS.ENV, env);
  },

  getApiKey: (): string => {
    return storage.getString(KEYS.API_KEY) || '';
  },
  setApiKey: (key: string) => {
    storage.set(KEYS.API_KEY, key);
  },

  getLocalIp: (): string => {
    return storage.getString(KEYS.LOCAL_IP) || '';
  },
  setLocalIp: (ip: string) => {
    storage.set(KEYS.LOCAL_IP, ip);
  },

  // ---------- اسم النموذج ----------
  getModelName: (): string => {
    return storage.getString(KEYS.MODEL_NAME) || 'qwen2.5:3b';
  },
  setModelName: (model: string) => {
    storage.set(KEYS.MODEL_NAME, model);
  },

  getTheme: (): 'light' | 'dark' => {
    return (storage.getString(KEYS.THEME) as 'light' | 'dark') || 'light';
  },
  setTheme: (theme: 'light' | 'dark') => {
    storage.set(KEYS.THEME, theme);
  },

  getLanguage: (): 'ar' | 'en' => {
    return storage.getString(KEYS.LANGUAGE) === 'en' ? 'en' : 'ar';
  },
  setLanguage: (language: 'ar' | 'en') => {
    storage.set(KEYS.LANGUAGE, language);
  },

  // ---------- سجل الخطط ----------
  getHistory: (): Plan[] => {
    const data = storage.getString(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },
  
  savePlan: (plan: Plan) => {
    const history = StorageService.getHistory();
    const updated = [plan, ...history].slice(0, 20); // آخر 20 خطة
    storage.set(KEYS.HISTORY, JSON.stringify(updated));
  },

  clearHistory: () => {
    storage.set(KEYS.HISTORY, JSON.stringify([]));
  },

  // ---------- تأشير المهمة كمنجزة ----------
  toggleIdeaDone: (planId: string, categoryIndex: number, ideaIndex: number) => {
    const history = StorageService.getHistory();
    const plan = history.find(p => p.id === planId);
    
    if (plan && plan.data.categories[categoryIndex]?.ideas[ideaIndex]) {
      const idea = plan.data.categories[categoryIndex].ideas[ideaIndex];
      idea.isDone = !idea.isDone;
      storage.set(KEYS.HISTORY, JSON.stringify(history));
      return history;
    }
    return history;
  }
};