import { create } from "zustand";

interface GlobalStoreState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  role: string;
  setRole: (role: string) => void;
  locale: string;
  setLocale: (locale: string) => void;
}

export const useGlobalStore = create<GlobalStoreState>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  role: "",
  setRole: (role: string) => set({ role }),
  locale: "",
  setLocale: (locale: string) => set({ locale }),
}));