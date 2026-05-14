// Tienda (Store) global de Zustand para persistir en localStorage si el usuario prefiere tema 'dark' o 'default'
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const appThemeStore = create(
  persist(
    (set) => ({
      theme: "dark",
      setAppTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default appThemeStore;