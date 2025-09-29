"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { roleFlowMeta } from "../../constants/roleFlowMeta";
import { motion } from "framer-motion";

const OnboardingStepIndicator = () => {
  const { currentRole, currentStep } = useAuthStore();

  if (!currentRole || !currentStep) return null;

  const steps = roleFlowMeta[currentRole];
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step Dot */}
            <motion.div
              className={`
                w-3 h-3 rounded-full transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-design-main scale-125 shadow-lg shadow-design-main/30"
                    : isCompleted
                    ? "bg-design-main/60"
                    : "bg-gray-300 dark:bg-gray-600"
                }
              `}
              animate={{
                scale: isActive ? 1.25 : 1,
                opacity: isActive ? 1 : isCompleted ? 0.8 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <motion.div
                className={`
                  w-8 h-0.5 transition-all duration-500 ease-in-out
                  ${
                    isCompleted
                      ? "bg-design-main"
                      : isActive
                      ? "bg-gradient-to-r from-design-main to-gray-300 dark:to-gray-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }
                `}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: isCompleted ? 1 : isActive ? 0.5 : 0,
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OnboardingStepIndicator;

