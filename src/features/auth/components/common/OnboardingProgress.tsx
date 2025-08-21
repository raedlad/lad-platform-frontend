"use client";

import React from "react";
import { CheckCircle, Circle } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index + 1 < currentStep;
          const isCurrent = index + 1 === currentStep;
          const isUpcoming = index + 1 > currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <div className="relative">
                {isCompleted ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : isCurrent ? (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentStep}
                    </span>
                  </div>
                ) : (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}

                {/* Progress line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-8 w-16 h-0.5 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              <span
                className={`text-xs mt-2 text-center ${
                  isCompleted
                    ? "text-green-600 font-medium"
                    : isCurrent
                    ? "text-primary font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;
