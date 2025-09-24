"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
import { useProjectStore } from "../../store/projectStore";

const CreateProjectProgress: React.FC = () => {
  const store = useProjectStore();
  const totalSteps = store.totalSteps;
  const currentStep = store.currentStep;
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex w-full items-center gap-3 select-none">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isCompleted = index + 1 < currentStep;
          const circleClasses = isActive
            ? "bg-gradient-to-b from-[#AC8852] to-[#7F5619] text-white"
            : "bg-white text-design-main border-design-main";
          return (
            <React.Fragment key={step}>
              <div
                className={twMerge(
                  "relative z-10 shadow-md flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-full border ",
                  circleClasses,
                  isCompleted &&
                    "bg-design-green text-white border-design-green"
                )}
              >
                <span className="text-lg font-bold">{step}</span>
              </div>
              {index !== steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-neutral-200/70"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CreateProjectProgress;
