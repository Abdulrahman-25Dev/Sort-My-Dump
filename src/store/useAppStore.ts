import { create } from 'zustand';
import { StorageService } from '../lib/storage';
import { Plan } from '../types';

interface AppState {
  env: 'dev' | 'prod';
  apiKey: string;
  localIp: string;
  history: Plan[];
  setEnv: (env: 'dev' | 'prod') => void;
  setApiKey: (key: string) => void;
  setLocalIp: (ip: string) => void;
  addPlan: (plan: Plan) => void;
  toggleTask: (planId: string, catIdx: number, ideaIdx: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  env: StorageService.getEnvironment(),
  apiKey: StorageService.getApiKey(),
  localIp: StorageService.getLocalIp(),
  history: StorageService.getHistory(),

  setEnv: (env) => {
    StorageService.setEnvironment(env);
    set({ env });
  },
  setApiKey: (apiKey) => {
    StorageService.setApiKey(apiKey);
    set({ apiKey });
  },
  setLocalIp: (localIp) => {
    StorageService.setLocalIp(localIp);
    set({ localIp });
  },
  addPlan: (plan) => {
    StorageService.savePlan(plan);
    set({ history: StorageService.getHistory() });
  },
  toggleTask: (planId, catIdx, ideaIdx) => {
    StorageService.toggleTaskDone(planId, catIdx, ideaIdx);
    set({ history: StorageService.getHistory() });
  }
}));