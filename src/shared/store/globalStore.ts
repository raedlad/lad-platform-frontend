import { Country, State, City } from "@/types/globalTypes";
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
  countries: Country[];
  setCountries: (countries: Country[]) => void;
  states: State[];
  setStates: (states: State[]) => void;
  cities: City[];
  setCities: (cities: City[]) => void;
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
  countries: [],
  setCountries: (countries: Country[]) => set({ countries }),
  states: [],
  setStates: (states: State[]) => set({ states }),
  cities: [],
  setCities: (cities: City[]) => set({ cities }),
}));
