import { create } from "zustand";
import {
  AuthState,
  User,
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "@auth/types";

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual API call
      // const response = await authApi.login(credentials);
      // set({ user: response.user, token: response.token, isAuthenticated: true });

      // Mock response for now
      const mockResponse: AuthResponse = {
        user: {
          id: "1",
          email: credentials.email,
          firstName: "John",
          lastName: "Doe",
          role: "individual" as any,
          userType: "personal" as any,
          isEmailVerified: true,
          isPhoneVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: "mock-token",
      };

      set({
        user: mockResponse.user,
        token: mockResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      });
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement actual API call
      // const response = await authApi.signup(data);
      // set({ user: response.user, token: response.token, isAuthenticated: true });

      // Mock response for now
      const mockResponse: AuthResponse = {
        user: {
          id: "1",
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: data.role,
          userType: data.userType,
          isEmailVerified: false,
          isPhoneVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: "mock-token",
      };

      set({
        user: mockResponse.user,
        token: mockResponse.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Signup failed",
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },

  setToken: (token: string) => {
    set({ token });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
