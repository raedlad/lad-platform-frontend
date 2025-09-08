import { create } from "zustand";

export interface ProfileStoreState {
  profile: any;
  setProfile: (profile: any) => void;
}


export const useProfileStore = create<ProfileStoreState>()(
  (set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
  })
);
