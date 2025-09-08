import { create } from "zustand";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  company?: string;
  avatar?: string;
  profileCompletion: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isDocumentVerified: boolean;
  memberSince: string;
  location: string;
  lastLogin: string;
}

export interface DashboardState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Profile completion calculation
  calculateProfileCompletion: () => number;
}

export const useDashboardStore = create<DashboardState>()(
  (set, get) => ({
    user: {
      id: "1",
      firstName: "Ahmed",
      lastName: "Al-Rashid",
      email: "ahmed@alrashid-eng.com",
      phone: "+966 50 123 4567",
      role: "Engineering Office",
      company: "Al-Rashid Engineering Consultants",
      avatar: "/avatars/user.jpg",
      profileCompletion: 72,
      isEmailVerified: true,
      isPhoneVerified: false,
      isDocumentVerified: true,
      memberSince: "January 2024",
      location: "Riyadh, Saudi Arabia",
      lastLogin: "2 hours ago",
    },
    isLoading: false,
    error: null,

    setUser: (user) => set({ user }),

    updateUser: (updates) =>
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),

    calculateProfileCompletion: () => {
      const state = get();
      if (!state.user) return 0;

      let completion = 0;
      const totalFields = 10; // Total number of profile fields to check

      // Basic info (30%)
      if (state.user.firstName) completion += 3;
      if (state.user.lastName) completion += 3;
      if (state.user.email) completion += 4;
      if (state.user.phone) completion += 5;

      // Verification status (30%)
      if (state.user.isEmailVerified) completion += 15;
      if (state.user.isPhoneVerified) completion += 10;
      if (state.user.isDocumentVerified) completion += 15;

      // Profile details (40%)
      if (state.user.avatar) completion += 10;
      if (state.user.company) completion += 10;
      if (state.user.location) completion += 10;

      return Math.min(completion, 100);
    },
  })
);
