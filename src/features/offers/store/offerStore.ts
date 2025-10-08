import { create } from "zustand";

interface OfferStoreState {
  currentStep: number;
  completedSteps: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  setCompletedSteps: (steps: number) => void;
  setTotalSteps: (steps: number) => void;
  resetOfferCreation: () => void;
}

export const useOfferStore = create<OfferStoreState>((set) => ({
  // Initial state
  currentStep: 1,
  completedSteps: 0,
  totalSteps: 5, // Adjust based on your actual steps
  
  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  setCompletedSteps: (steps) => set({ completedSteps: steps }),
  setTotalSteps: (steps) => set({ totalSteps: steps }),
  
  resetOfferCreation: () =>
    set({
      currentStep: 1,
      completedSteps: 0,
      totalSteps: 5,
    }),
}));

export default useOfferStore;
