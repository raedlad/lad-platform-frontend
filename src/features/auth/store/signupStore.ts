import { create } from "zustand";

interface SignUpState {
  authMethod: "email" | "phone" | "thirdParty" | null;
  setAuthMethod: (method: "email" | "phone" | "thirdParty" | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  emailSignUpData: any; 
  setEmailSignUpData: (data: any) => void;
  phoneSignUpData: any;
  setPhoneSignUpData: (data: any) => void;
  thirdPartySignUpData: any;
  setThirdPartySignUpData: (data: any) => void;
  verificationCodeSent: boolean;
  setVerificationCodeSent: (sent: boolean) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  resetSignupFlow: () => void;
}

export const useSignUpStore = create<SignUpState>((set) => ({
  authMethod: null,
  setAuthMethod: (method) => set({ authMethod: method, currentStep: 1 }),
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  emailSignUpData: null,
  setEmailSignUpData: (data) => set({ emailSignUpData: data }),
  phoneSignUpData: null,
  setPhoneSignUpData: (data) => set({ phoneSignUpData: data }),
  thirdPartySignUpData: null,
  setThirdPartySignUpData: (data) => set({ thirdPartySignUpData: data }),
  verificationCodeSent: false,
  setVerificationCodeSent: (sent) => set({ verificationCodeSent: sent }),
  verificationCode: "",
  setVerificationCode: (code) => set({ verificationCode: code }),
  isVerified: false,
  setIsVerified: (verified) => set({ isVerified: verified }),
  resetSignupFlow: () =>
    set({
      authMethod: null,
      currentStep: 1,
      emailSignUpData: null,
      phoneSignUpData: null,
      thirdPartySignUpData: null,
      verificationCodeSent: false,
      verificationCode: "",
      isVerified: false,
    }),
}));
