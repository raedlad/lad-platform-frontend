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
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    profile?: {
      firstName: string;
      lastName: string;
      email: string | undefined;
    };
    error?: string;
  } | null>(null);
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
        const profile = (await profileRes.json()) as {
          email?: string;
          given_name?: string;
          givenName?: string;
          family_name?: string;
          familyName?: string;
          name?: string;
          picture?: string;
          sub: string;
        };

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
        });
        store.setAuthMethod("thirdParty");

        if (!inRegistrationFlow) {
          // Login context: exchange for app tokens and redirect
          const response = await authApi.socialLogin("google", accessToken);
          if (response.success && response.data) {
            const data = response.data;
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

        // Registration context: don't automatically advance, let the component control the flow
        const result = {
          success: true,
          profile: { firstName, lastName, email },
        } as const;

        // Store the result so the component can access it
        setLastResult(result);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Google sign-in failed";
        setError(errorMessage);
        const errorResult = { success: false as const, error: errorMessage };
        setLastResult(errorResult);
        return errorResult;
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
      const errorMessage = (err as Error)?.message || "Google sign-in failed";
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
    lastResult,
    clearError: () => setError(null),
    clearLastResult: () => setLastResult(null),
  };
};

export default useGoogleAuth;
