"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@auth/store/authStore";

export function useRoleRedirect() {
  const router = useRouter();
  const currentRole = useAuthStore((s) => s.currentRole);
  const isVerified = useAuthStore((s) => s.isVerified);

  useEffect(() => {
    if (!currentRole) {
      router.replace("/login"); // or onboarding
      return;
    }

    if (!isVerified) {
      router.replace("/verify-otp"); // optional: OTP/verification flow
      return;
    }

    const roleRoutes: Record<string, string> = {
      contractor: "/dashboard/contractor",
      individual: "/dashboard/individual",
      supplier: "/dashboard/supplier",
      organization: "/dashboard/organization",
      engineer: "/dashboard/engineer",
    };

    router.replace(roleRoutes[currentRole] || "/dashboard/common/profile");
  }, [currentRole, isVerified, router]);
}
