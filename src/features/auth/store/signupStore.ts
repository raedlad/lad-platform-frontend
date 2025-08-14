import { create } from 'zustand';

interface SignUpState {
  authMethod: 'email' | 'phone' | 'thirdParty' | null;
  setAuthMethod: (method: 'email' | 'phone' | 'thirdParty' | null) => void;
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
}

export const useSignUpStore = create<SignUpState>((set) => ({
  authMethod: null,
  setAuthMethod: (method) => set({ authMethod: method }),
  emailSignUpData: null,
  setEmailSignUpData: (data) => set({ emailSignUpData: data }),
  phoneSignUpData: null,
  setPhoneSignUpData: (data) => set({ phoneSignUpData: data }),
  thirdPartySignUpData: null,
  setThirdPartySignUpData: (data) => set({ thirdPartySignUpData: data }),
  verificationCodeSent: false,
  setVerificationCodeSent: (sent) => set({ verificationCodeSent: sent }),
  verificationCode: '',
  setVerificationCode: (code) => set({ verificationCode: code }),
  isVerified: false,
  setIsVerified: (verified) => set({ isVerified: verified }),
}));


