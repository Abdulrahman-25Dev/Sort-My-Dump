import { createMMKV } from 'react-native-mmkv';
import { Plan } from '../types/index';

export const storage = createMMKV();

// مفاتيح التخزين
const KEYS = {
  OPENROUTER_KEY: 'openrouter_key',
  ENVIRONMENT: 'environment', // 'dev' | 'prod'
  LOCAL_IP: 'local_ip',
  HISTORY: 'history',
};

export const StorageService = {
  // الإعدادات
  getApiKey: () => storage.getString(KEYS.OPENROUTER_KEY) || '',
  setApiKey: (key: string) => storage.set(KEYS.OPENROUTER_KEY, key),
  
  getEnvironment: () => (storage.getString(KEYS.ENVIRONMENT) as 'dev' | 'prod') || 'dev',
  setEnvironment: (env: 'dev' | 'prod') => storage.set(KEYS.ENVIRONMENT, env),
  
  getLocalIp: () => storage.getString(KEYS.LOCAL_IP) || '192.168.1.x',
  setLocalIp: (ip: string) => storage.set(KEYS.LOCAL_IP, ip),

  // الخطط السابقة (نحتفظ بآخر 20 خطة فقط)
  getHistory: (): Plan[] => {
    const data = storage.getString(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },
  savePlan: (plan: Plan) => {
    const history = StorageService.getHistory();
    const updated = [plan, ...history].slice(0, 20); // آخر 20 خطة
    storage.set(KEYS.HISTORY, JSON.stringify(updated));
  },
  toggleTaskDone: (planId: string, categoryIndex: number, ideaIndex: number) => {
    const history = StorageService.getHistory();
    const plan = history.find(p => p.id === planId);
    if (plan) {
      const idea = plan.data.categories[categoryIndex].ideas[ideaIndex];
      idea.isDone = !idea.isDone;
      storage.set(KEYS.HISTORY, JSON.stringify(history));
    }
  }
};