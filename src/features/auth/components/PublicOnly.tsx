"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

interface PublicOnlyProps {
  children: React.ReactNode;
}

// Blocks authenticated users from visiting auth-only pages like login/signup
export default function PublicOnly({ children }: PublicOnlyProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Reset redirect state on path change
    setRedirecting(false);

    // If not authenticated, allow
    if (!tokenStorage.isAuthenticated()) {
      setChecked(true);
      return;
    }

    // If authenticated but still requires verification
    if (tokenStorage.isVerificationRequired()) {
      // Allow verify page to render to avoid redirect loop/blank
      if (pathname && pathname.startsWith("/verify-otp")) {
        setChecked(true);
        return;
      }
      setRedirecting(true);
      router.replace("/verify-otp");
      return;
    }

    // Otherwise, redirect to the user's role dashboard
    const user = tokenStorage.getUser();
    const userRole = (user?.user_type || "")
      .toString()
      .trim()
      .toLowerCase()
    setRedirecting(true);
    router.replace(userRole ? `/dashboard/${userRole}` : "/dashboard");
  }, [router, pathname]);

  if (!checked || redirecting) return null;
  return <>{children}</>;
}
