"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  PenTool,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContractStatus } from "../types/contract";
import { Card } from "@shared/components/ui/card";

interface ContractStatusBarProps {
  currentStatus: ContractStatus;
}

interface StatusStep {
  label: string;
  icon: React.ElementType;
  statuses: ContractStatus[];
}

// Move statusSteps inside component to access translations
const getStatusSteps = (t: any): StatusStep[] => [
  {
    label: t("progress.draft"),
    icon: FileText,
    statuses: ["Waiting for Contract Draft"],
  },
  {
    label: t("progress.review"),
    icon: Clock,
    statuses: [
      "Awaiting Client Review",
      "Awaiting Contractor Review",
      "Awaiting Client Modification",
    ],
  },
  {
    label: t("progress.approved"),
    icon: FileCheck,
    statuses: ["Approved - Awaiting Signatures"],
  },
  {
    label: t("progress.sign"),
    icon: PenTool,
    statuses: ["Awaiting Contractor Signature"],
  },
  {
    label: t("progress.active"),
    icon: CheckCircle2,
    statuses: ["Signed - Active"],
  },
];

export const ContractStatusBar: React.FC<ContractStatusBarProps> = ({
  currentStatus,
}) => {
  const t = useTranslations("contract");
  const statusSteps = getStatusSteps(t);

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step: StatusStep) =>
      step.statuses.includes(currentStatus)
    );
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Card className="w-full bg-card shadow-none p-6 mb-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-6 h-0.5 w-full bg-design-main/50 ">
          <div
            className="h-full bg-design-main transition-all duration-500"
            style={{
              width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {statusSteps.map((step: StatusStep, index: number) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div key={step.label} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-background  border-2",
                    {
                      "border-design-main bg-design-main text-white":
                        isActive || isCompleted,
                      "border-design-main/50 text-design-main/50": isPending,
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn("mt-2 text-sm font-medium transition-colors", {
                    "text-design-main": isActive || isCompleted,
                    "text-design-main/50": isPending,
                  })}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
