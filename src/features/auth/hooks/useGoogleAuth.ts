"use client";

import { useState, useCallback } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/services/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSuccess = useCallback(
    async (tokenResponse: TokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        if (!accessToken) throw new Error("Missing Google access token");

        // Always fetch profile to prefill forms
        const profileRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (!profileRes.ok) throw new Error("Failed to fetch Google profile");
        const profile = (await profileRes.json()) as any;

        const email: string | undefined = profile.email;
        const givenName: string | undefined =
          profile.given_name || profile.givenName;
        const familyName: string | undefined =
          profile.family_name || profile.familyName;
        const fullName: string | undefined = profile.name;

        let firstName = givenName || "";
        let lastName = familyName || "";
        if (!firstName && !lastName && fullName) {
          const parts = String(fullName).trim().split(/\s+/);
          firstName = parts[0] || "";
          lastName = parts.slice(1).join(" ") || "";
        }

        const store = useAuthStore.getState();
        const inRegistrationFlow = Boolean(store.currentRole);

        // Prefill store for registration flows
        store.setRoleData("thirdPartyInfo", {
          firstName,
          lastName,
          email: email || "",
          provider: "google",
        } as any);
        store.setAuthMethod("thirdParty");

        if (!inRegistrationFlow) {
          // Login context: exchange for app tokens and redirect
          const response = await authApi.socialLogin("google", accessToken);
          if (response.success && (response as any).data) {
            const data: any = (response as any).data;
            if (data.tokens && data.user) {
              tokenStorage.storeTokens(data.tokens, data.user);
            }
            router.push(`/dashboard/${data?.user?.user_type ?? ""}`);
            return { success: true } as const;
          }
          throw new Error(
            (response && response.message) || "Social login failed"
          );
        }

        // Registration context: advance to the next step now that defaults are set
        useAuthStore.getState().goToNextStep();
        return {
          success: true,
          profile: { firstName, lastName, email },
        } as const;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Google sign-in failed";
        setError(errorMessage);
        return { success: false as const, error: errorMessage };
      }
    },
    [router]
  );

  const startGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);
      try {
        await handleGoogleSuccess(tokenResponse as TokenResponse);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => {
      const errorMessage =
        (err as any)?.error_description || "Google sign-in failed";
      setError(errorMessage);
    },
    scope:
      "openid email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  });

  const signInWithGoogle = useCallback(() => {
    startGoogleLogin();
  }, [startGoogleLogin]);

  return {
    signInWithGoogle,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

export default useGoogleAuth;
