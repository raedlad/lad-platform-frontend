"use client";

import { useAuthStore } from "@auth/store/authStore";
import { roleFlowMeta } from "../../constants/roleFlowMeta";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingRightCard from "./OnboardingRightCard";
import { motion, AnimatePresence } from "framer-motion";

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, currentStep } = useAuthStore();

  if (!currentRole || !currentStep) return <>{children}</>;
  const steps = roleFlowMeta[currentRole];

  return (
    <div className="min-h-[calc(100vh-100px)] w-full grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
      {/* Left Side - Image Card */}
      <div className="w-full h-full hidden lg:flex lg:col-span-4 bg-blue-400">
        <OnboardingRightCard />
      </div>

      {/* Right Side - Content */}
      <div className="container-centered lg:col-span-8">
        <div className="auth-form-container">
          {/* Progress Header */}

          {/* Main Content with smooth transitions */}
          <div className="auth-form-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full flex flex-col items-center justify-center max-w-md mx-auto gap-4"
              >
                <OnboardingProgress total={steps.length} />
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
