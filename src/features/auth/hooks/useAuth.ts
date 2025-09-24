import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@auth/store/authStore";
import { authApi } from "@auth/services/authApi";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

export const useAuth = () => {
  const store = useAuthStore();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Schedule token refresh ~1 minute before expiry
  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const schedule = () => {
  //     const msUntilExpiry = tokenStorage.getTimeUntilAccessTokenExpiryMs();
  //     if (msUntilExpiry == null) return;

  //     // Refresh 60s before expiry, but not sooner than 1s
  //     const refreshInMs = Math.max(msUntilExpiry - 60 * 1000, 1000);
  //     if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  //     refreshTimerRef.current = setTimeout(async () => {
  //       await authApi.refreshTokens();
  //       // Re-schedule after refresh
  //       schedule();
  //     }, refreshInMs);
  //   };

  //   schedule();

  //   const onStorage = (e: StorageEvent) => {
  //     if (e.key === "access_token" || e.key === "token_expires_at") {
  //       schedule();
  //     }
  //   };
  //   window.addEventListener("storage", onStorage);

  //   return () => {
  //     if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  //     window.removeEventListener("storage", onStorage);
  //   };
  // }, [store.isAuthenticated]);

  const handleForgotPassword = useCallback(
    async (arg1?: string, arg2?: string) => {
      // Backward-compatible API:
      // - If arg2 is "email" | "phone", treat arg1 as contact and map to backend shape
      // - Else treat as (email, phone)
      let payload: { email?: string; phone?: string } = {};
      if (arg2 === "email" || arg2 === "phone") {
        const contact = arg1;
        if (arg2 === "email") payload.email = contact;
        else payload.phone = contact;
      } else {
        payload = { email: arg1, phone: arg2 };
      }
      const response = await authApi.forgotPassword(payload);
      return response;
    },
    [store]
  );
  return {
    ...store,
    handleForgotPassword,
  };
};

export default useAuth;
