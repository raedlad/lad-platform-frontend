"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { assets } from "@/constants/assets";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@auth/store/authStore";
import { roleFlowMeta } from "../../constants/roleFlowMeta";
import { Shield, UserCheck, User } from "lucide-react";

const OnboardingRightCard = () => {
  const t = useTranslations("auth");
  const { currentRole, currentStep } = useAuthStore();

  // Get current step info
  const getCurrentStepInfo = () => {
    if (!currentRole || !currentStep) return null;

    // Handle socialLoginForm step specially
    if (currentStep === "socialLoginForm") {
      return {
        key: "socialLoginForm",
        showInUI: true,
        label: t("onboarding.steps.socialLoginForm.label"),
        icon: "🔗",
        description: t("onboarding.steps.socialLoginForm.description"),
      };
    }

    const steps = roleFlowMeta[currentRole];
    return steps.find((step) => step.key === currentStep);
  };

  // Get image based on current step
  const getStepImage = () => {
    switch (currentStep) {
      case "authMethod":
        return assets.smartMatching; // Use AI/smart matching image for auth method
      case "personalInfo":
        return assets.user; // Use user image for personal info
      case "socialLoginForm":
        return assets.user; // Use user image for social login form
      case "verification":
        return assets.dashboardBackground; // Use dashboard background for verification
      default:
        return assets.smartMatching;
    }
  };

  // Get icon based on current step
  const getStepIcon = () => {
    switch (currentStep) {
      case "authMethod":
        return <Shield className="size-8" />;
      case "personalInfo":
        return <UserCheck className="size-8" />;
      case "socialLoginForm":
        return <UserCheck className="size-8" />;
      case "verification":
        return <User className="size-8" />;
      default:
        return <Shield className="size-8" />;
    }
  };

  const currentStepInfo = getCurrentStepInfo();
  const stepImage = getStepImage();
  const stepIcon = getStepIcon();

  // Get steps for indicator
  const getSteps = () => {
    if (!currentRole) return [];
    const baseSteps = roleFlowMeta[currentRole];

    // For third-party users, add socialLoginForm step
    if (currentStep === "socialLoginForm") {
      const socialStep = {
        key: "socialLoginForm",
        showInUI: true,
        label: t("onboarding.steps.socialLoginForm.label"),
        icon: "🔗",
        description: t("onboarding.steps.socialLoginForm.description"),
      };

      // Insert socialLoginForm between personalInfo and verification
      const personalInfoIndex = baseSteps.findIndex(
        (step) => step.key === "personalInfo"
      );
      if (personalInfoIndex !== -1) {
        const newSteps = [...baseSteps];
        newSteps.splice(personalInfoIndex + 1, 0, socialStep);
        return newSteps;
      }
    }

    return baseSteps;
  };

  const steps = getSteps();
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  if (!currentStepInfo) return null;

  return (
    <div className="h-full w-full max-h-[calc(100vh)] relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex-1">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-design-main/20 via-p-6/10 to-design-main/20"></div>

      {/* Dynamic Background Image with smooth transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Image
            src={stepImage}
            alt={currentStepInfo.label}
            loading="lazy"
            fill
            className="object-cover"
            onError={(e) => {}}
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Top Step Indicators - Individual Step Lines */}
      <div className="absolute top-8 left-8 right-8">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const shouldShowPrimary = isCompleted || isCurrent;

            return (
              <motion.div
                key={step.key}
                className={`
                  h-1 rounded-full transition-all duration-500 ease-in-out
                  ${
                    shouldShowPrimary
                      ? "bg-design-main" // Primary color for completed and current steps
                      : "bg-white/30" // Muted color for upcoming steps
                  }
                `}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: 1, // Always show the line
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  width: "40px", // Consistent width for all lines
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Content Overlay with smooth transitions */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-content`}
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Title with Icon */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm text-design-main">
                {stepIcon}
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
                {t(`onboarding.steps.${currentStepInfo.key}.label`)}
              </h1>
            </motion.div>

            {/* Accent Line */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="w-20 h-1 bg-gradient-to-r from-design-main via-p-6 to-design-main rounded-full"></div>
              <div className="absolute inset-0 w-20 h-1 bg-gradient-to-r from-design-main via-p-6 to-design-main rounded-full blur-sm opacity-50"></div>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg text-white/90 leading-relaxed font-light max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {t(`onboarding.steps.${currentStepInfo.key}.description`)}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-br-3xl"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-design-main/20 to-transparent rounded-tl-3xl"></div>
    </div>
  );
};

export default OnboardingRightCard;
