import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode, AccentPalette } from '../../types/portfolio';
import { safeStorage, STORAGE_KEYS } from '../../lib/storage';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: ThemeMode) => void;
  accent: AccentPalette;
  setAccent: (accent: AccentPalette) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (safeStorage.get(STORAGE_KEYS.THEME) as ThemeMode) || 'dark';
  });

  const [accent, setAccentState] = useState<AccentPalette>(() => {
    return (safeStorage.get(STORAGE_KEYS.ACCENT) as AccentPalette) || 'violet';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const computeTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      return theme;
    };

    const res = computeTheme();
    setResolvedTheme(res);

    document.documentElement.setAttribute('data-theme', res);
    document.documentElement.setAttribute('data-accent', accent);

    if (res === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, accent]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    safeStorage.set(STORAGE_KEYS.THEME, newTheme);
  };

  const setAccent = (newAccent: AccentPalette) => {
    setAccentState(newAccent);
    safeStorage.set(STORAGE_KEYS.ACCENT, newAccent);
  };

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, accent, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
