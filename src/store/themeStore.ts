import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: localStorage.getItem('vestie_dark_mode') === 'true',
  
  toggleDarkMode: () => {
    const newMode = !get().isDarkMode;
    localStorage.setItem('vestie_dark_mode', newMode.toString());
    set({ isDarkMode: newMode });
    
    // Apply theme to document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  setDarkMode: (isDark: boolean) => {
    localStorage.setItem('vestie_dark_mode', isDark.toString());
    set({ isDarkMode: isDark });
    
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));