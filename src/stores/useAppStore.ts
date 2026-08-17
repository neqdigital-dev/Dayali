import { create } from 'zustand';
import type { Language, Theme } from '../lib/constants';

interface AppState {
  // Theme
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Network
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved);
}

const savedTheme = (localStorage.getItem('dayali-theme') as Theme) || 'system';
const savedLanguage = (localStorage.getItem('dayali-language') as Language) || 'pt';
const initialResolved = resolveTheme(savedTheme);

// Apply theme immediately to prevent flash
applyTheme(initialResolved);

export const useAppStore = create<AppState>((set) => ({
  theme: savedTheme,
  resolvedTheme: initialResolved,
  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    localStorage.setItem('dayali-theme', theme);
    applyTheme(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  language: savedLanguage,
  setLanguage: (language) => {
    localStorage.setItem('dayali-language', language);
    set({ language });
  },

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  isOnline: navigator.onLine,
  setIsOnline: (online) => set({ isOnline: online }),
}));

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useAppStore.getState();
    if (state.theme === 'system') {
      const resolved = getSystemTheme();
      applyTheme(resolved);
      useAppStore.setState({ resolvedTheme: resolved });
    }
  });

  // Listen for online/offline
  window.addEventListener('online', () => useAppStore.setState({ isOnline: true }));
  window.addEventListener('offline', () => useAppStore.setState({ isOnline: false }));
}
