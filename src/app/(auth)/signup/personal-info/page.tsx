"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@auth/components/onboarding/OnboardingLayout";
import CombinedRegistrationForm from "@auth/components/forms/CombinedRegistrationForm";

export default function PersonalInfoPage() {
  const router = useRouter();
  const store = useAuthStore();
  const role = store.currentRole;
  const currentStep = store.currentStep;
  const isLoading = store.isLoading;
  const [isNavigating, setIsNavigating] = React.useState(false);
  const prevStepRef = React.useRef(currentStep);

  // Redirect if no role selected
  React.useEffect(() => {
    if (!role) {
      router.push("/signup/role");
    }
  }, [role, router]);

  // Navigate to verification page only when step CHANGES to verification (not if already verification)
  React.useEffect(() => {
    if (
      currentStep === "verification" && 
      prevStepRef.current !== "verification" && 
      !isNavigating
    ) {
      setIsNavigating(true);
      router.push("/signup/verify");
    }
    prevStepRef.current = currentStep;
  }, [currentStep, router, isNavigating]);

  if (!role) {
    return null;
  }

  // Show loading state while navigating to prevent glitch
  if (isNavigating && isLoading) {
    return (
      <OnboardingLayout>
        <div className="w-full max-w-md flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-main mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout>
      <div className="w-full max-w-md">
        <CombinedRegistrationForm role={role} />
      </div>
    </OnboardingLayout>
  );
}