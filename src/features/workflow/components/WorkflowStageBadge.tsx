"use client";

import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import {
  FileText,
  Clock,
  Search,
  FileSignature,
  PenTool,
  Hammer,
  CheckCircle,
  Archive,
  LucideIcon,
} from "lucide-react";
import { useWorkflowStage, UseWorkflowStageParams } from "../hooks/useWorkflowStage";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Clock,
  Search,
  FileSignature,
  PenTool,
  Hammer,
  CheckCircle,
  Archive,
};

interface WorkflowStageBadgeProps extends UseWorkflowStageParams {
  showIcon?: boolean;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * WorkflowStageBadge
 * Displays the current workflow stage as a badge with optional icon and description
 */
export const WorkflowStageBadge: React.FC<WorkflowStageBadgeProps> = ({
  showIcon = true,
  showDescription = false,
  size = "md",
  className = "",
  ...workflowParams
}) => {
  const { stageDefinition, display } = useWorkflowStage(workflowParams);
  const IconComponent = ICON_MAP[stageDefinition.icon] || FileText;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <Badge
        variant="secondary"
        className={`${display.colorClass} ${sizeClasses[size]} inline-flex items-center gap-2 font-medium`}
      >
        {showIcon && <IconComponent className={iconSizes[size]} />}
        <span>{display.label}</span>
      </Badge>
      {showDescription && (
        <p className="text-xs text-muted-foreground mt-1">
          {display.description}
        </p>
      )}
    </div>
  );
};
