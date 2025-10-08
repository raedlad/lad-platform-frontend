/**
 * Project Status Badge Component
 * Displays the current workflow status of a project with appropriate styling
 */

"use client";

import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useWorkflow, WORKFLOW_STATUS_LABELS, WORKFLOW_STATUS_COLORS } from "../index";

interface ProjectStatusBadgeProps {
  projectId: string;
  showLabel?: boolean;
  variant?: "default" | "outline";
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({
  projectId,
  showLabel = true,
  variant = "default",
}) => {
  const { currentStatus, isLoading } = useWorkflow({
    projectId,
    autoFetch: true,
  });

  if (isLoading) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Loading...
      </Badge>
    );
  }

  if (!currentStatus) {
    return null;
  }

  const statusColor = WORKFLOW_STATUS_COLORS[currentStatus];
  const statusLabel = WORKFLOW_STATUS_LABELS[currentStatus];

  // Map workflow status colors to badge variants and custom classes
  const getStatusClassName = () => {
    const colorMap: Record<string, string> = {
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return colorMap[statusColor] || colorMap.gray;
  };

  return (
    <Badge variant={variant} className={getStatusClassName()}>
      {showLabel ? statusLabel : currentStatus}
    </Badge>
  );
};
