import { create } from "zustand";

interface GlobalStoreState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  role: string;
  setRole: (role: string) => void;

}

export const useGlobalStore = create<GlobalStoreState>((set) => ({
  
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  role: "",
  setRole: (role: string) => set({ role }),
}));