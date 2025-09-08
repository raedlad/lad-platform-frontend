"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

interface RequireAuthProps {
  children: React.ReactNode;
}

// Simple auth gate for client-side routes in the app dir
export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const isAuthPage = useMemo(() => {
    if (!pathname) return false;
    return (
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/verify-otp")
    );
  }, [pathname]);

  useEffect(() => {
    // Reset redirecting on every path change so we can render after successful navigation
    setRedirecting(false);
    // Skip guard on auth pages themselves
    if (isAuthPage) {
      setChecked(true);
      return;
    }

    const accessToken = tokenStorage.getAccessToken();
    const isExpired = tokenStorage.isAccessTokenExpired();

    if (!accessToken || isExpired) {
      setRedirecting(true);
      router.replace("/login");
      return;
    }

    // Optional: if verification required, send to verify page
    try {
      const verificationRequired = JSON.parse(
        localStorage.getItem("verification_required") || "false"
      );
      if (verificationRequired === true) {
        setRedirecting(true);
        router.replace("/verify-otp");
        return;
      }
    } catch {
      // ignore json errors
    }

    // Role-based authorization for dashboard sub-routes
    if (pathname && pathname.startsWith("/dashboard")) {
      const user = tokenStorage.getUser();
      const normalize = (v?: string | null) =>
        (v || "").toString().trim().toLowerCase();
      const userRole = normalize(user?.user_type);

      // Extract the first segment after /dashboard
      const match = pathname.match(/^\/dashboard\/?([^\/]+)?/);
      const pathRole = normalize(match?.[1] || "");

      const knownRoles = new Set([
        "individual",
        "contractor",
        "supplier",
        "organization",
        "freelance-engineer",
        "engineering-office",
      ]);

      // If visiting /dashboard root and we have user's role, route them there
      if ((pathname === "/dashboard" || pathRole === "") && userRole) {
        setRedirecting(true);
        router.replace(`/dashboard/${userRole}`);
        return;
      }

      // If path has a role segment and it's not the user's role, redirect
      if (
        pathRole &&
        knownRoles.has(pathRole) &&
        userRole &&
        pathRole !== userRole
      ) {
        setRedirecting(true);
        router.replace(`/dashboard/${userRole}`);
        return;
      }
    }

    setChecked(true);
  }, [router, pathname, isAuthPage]);

  if (!checked || redirecting) return null;
  return <>{children}</>;
}
