import { create } from "zustand";
import {
  mockApiClient,
  type User,
  type ProfileData,
} from "@/features/api/mock-client";

export interface ProfileStoreState {
  // User data
  user: User | null;
  profile: ProfileData | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Profile completion modal state
  showCompletionModal: boolean;
  showCompletionBanner: boolean;

  // Actions
  loadUser: (role?: string) => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  updateProfile: (
    userId: string,
    updates: Partial<ProfileData>
  ) => Promise<void>;
  markProfileCompleted: (userId: string) => Promise<void>;

  // Modal/Banner actions
  setShowCompletionModal: (show: boolean) => void;
  setShowCompletionBanner: (show: boolean) => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileStoreState>()((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  isLoading: false,
  error: null,
  showCompletionModal: false,
  showCompletionBanner: false,

  // Load user data
  loadUser: async (role?: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await mockApiClient.getUser(role);

      if (response.success && response.data) {
        set({ user: response.data });

        // Check if we should show completion flow
        if (!response.data.profileCompleted) {
          const hasSeenModal = localStorage.getItem(
            "profileCompletionModalSeen"
          );
          const bannerDismissed = localStorage.getItem(
            "profileBannerDismissed"
          );

          if (!hasSeenModal) {
            set({ showCompletionModal: true });
          } else if (!bannerDismissed) {
            set({ showCompletionBanner: true });
          }
        }

        return;
      }

      throw new Error(response.error || "Failed to load user");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load user";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  // Load profile data
  loadProfile: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await mockApiClient.getProfile(userId);

      if (response.success && response.data) {
        set({ profile: response.data });
        return;
      }

      throw new Error(response.error || "Failed to load profile");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load profile";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update profile
  updateProfile: async (userId: string, updates: Partial<ProfileData>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await mockApiClient.updateProfile(userId, updates);

      if (response.success && response.data) {
        set({ profile: response.data });

        // Update user completion percentage if profile was updated
        const { user } = get();
        if (user) {
          // Calculate new completion percentage based on profile updates
          const newCompletion = calculateProfileCompletion(response.data);
          set({
            user: {
              ...user,
              profileCompletion: newCompletion,
              profileCompleted: newCompletion >= 100,
            },
          });
        }

        return;
      }

      throw new Error(response.error || "Failed to update profile");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  // Mark profile as completed
  markProfileCompleted: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await mockApiClient.markProfileCompleted(userId);

      if (response.success && response.data) {
        set({
          user: response.data,
          showCompletionModal: false,
          showCompletionBanner: false,
        });

        // Clear localStorage flags
        localStorage.removeItem("profileCompletionModalSeen");
        localStorage.removeItem("profileBannerDismissed");

        return;
      }

      throw new Error(response.error || "Failed to mark profile as completed");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to mark profile as completed";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  // Modal/Banner actions
  setShowCompletionModal: (show: boolean) => {
    set({ showCompletionModal: show });

    if (!show) {
      localStorage.setItem("profileCompletionModalSeen", "true");

      // Show banner if profile is still not completed
      const { user } = get();
      if (user && !user.profileCompleted) {
        const bannerDismissed = localStorage.getItem("profileBannerDismissed");
        if (!bannerDismissed) {
          set({ showCompletionBanner: true });
        }
      }
    }
  },

  setShowCompletionBanner: (show: boolean) => {
    set({ showCompletionBanner: show });

    if (!show) {
      localStorage.setItem("profileBannerDismissed", "true");
    }
  },

  // Utility actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      user: null,
      profile: null,
      isLoading: false,
      error: null,
      showCompletionModal: false,
      showCompletionBanner: false,
    }),
}));

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(profile: ProfileData): number {
  let completion = 0;
  const totalSections = 6;

  // Personal info (20%)
  if (profile.personalInfo) {
    const personalFields = [
      profile.personalInfo.firstName,
      profile.personalInfo.lastName,
      profile.personalInfo.city,
      profile.personalInfo.country,
    ];
    const completedPersonal = personalFields.filter(Boolean).length;
    completion += (completedPersonal / personalFields.length) * 20;
  }

  // Professional info (20%)
  if (profile.professionalInfo) {
    const professionalFields = [
      profile.professionalInfo.jobTitle,
      profile.professionalInfo.yearsOfExperience,
      profile.professionalInfo.specializations?.length > 0,
    ];
    const completedProfessional = professionalFields.filter(Boolean).length;
    completion += (completedProfessional / professionalFields.length) * 20;
  }

  // Technical info (15%)
  if (profile.technicalInfo) {
    const technicalFields = [
      profile.technicalInfo.skills?.length > 0,
      profile.technicalInfo.software?.length > 0,
      profile.technicalInfo.languages?.length > 0,
    ];
    const completedTechnical = technicalFields.filter(Boolean).length;
    completion += (completedTechnical / technicalFields.length) * 15;
  }

  // Documents (25%)
  if (profile.documents) {
    const totalDocs = profile.documents.length;
    const verifiedDocs = profile.documents.filter(
      (doc) => doc.status === "verified"
    ).length;
    if (totalDocs > 0) {
      completion += (verifiedDocs / totalDocs) * 25;
    }
  }

  // Settings (10%)
  if (profile.settings) {
    completion += 10;
  }

  // Additional completion for having profile data at all (10%)
  if (
    profile.personalInfo ||
    profile.professionalInfo ||
    profile.technicalInfo
  ) {
    completion += 10;
  }

  return Math.min(Math.round(completion), 100);
}
