const memoryStore = new Map<string, string>();

export const safeStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  set: (key: string, value: string): boolean => {
    try {
      memoryStore.set(key, value);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return true;
    } catch {
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      memoryStore.delete(key);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return true;
    } catch {
      return false;
    }
  },
  getJSON: <T>(key: string, fallback: T): T => {
    try {
      const item = safeStorage.get(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  setJSON: <T>(key: string, value: T): boolean => {
    try {
      return safeStorage.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  INTRO_SKIP: 'pf:introSkip',
  THEME: 'pf:theme',
  LANG: 'pf:lang',
  ACCENT: 'pf:accent',
  DEMO_DATA: 'pf:ramzan_data_v1',
  AUTH_SESSION: 'pf:auth_session',
  DELETED_PROJECTS: 'pf:deleted_projects_v1',
} as const;
