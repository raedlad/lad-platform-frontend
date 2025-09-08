"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

import { Project } from "../../types";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
  title?: string;
  maxItems?: number;
  showProgress?: boolean;
  className?: string;
  onViewAll?: () => void;
  onProjectClick?: (projectId: string) => void;
}

function getStatusColor(status: Project["status"]): string {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "on_hold":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusDisplayName(status: Project["status"]): string {
  const statusMap: Record<Project["status"], string> = {
    draft: "Draft",
    published: "Published",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    on_hold: "On Hold",
  };

  return statusMap[status] || status;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency || "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ar-SA", {
    month: "short",
    day: "numeric",
  });
}

function ProjectCard({
  project,
  showProgress = true,
  onClick,
}: {
  project: Project;
  showProgress?: boolean;
  onClick?: (projectId: string) => void;
}) {
  const statusColor = getStatusColor(project.status);
  const statusDisplay = getStatusDisplayName(project.status);
  const budgetRange = `${formatCurrency(
    project.budget.min,
    project.budget.currency
  )} - ${formatCurrency(project.budget.max, project.budget.currency)}`;
  const endDate = formatDate(project.timeline.endDate);

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md cursor-pointer",
        project.isUrgent && "border-orange-200 bg-orange-50"
      )}
      onClick={() => onClick?.(project.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-base font-semibold line-clamp-1">
                {project.title}
              </CardTitle>
              {project.isUrgent && (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description}
            </p>
          </div>
          <Badge variant="secondary" className={statusColor}>
            {statusDisplay}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{project.location}</span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3 mr-1" />
            <span>{budgetRange}</span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Due: {endDate}</span>
          </div>

          {showProgress && project.progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {project.progress.percentage}%
                </span>
              </div>
              <Progress value={project.progress.percentage} className="h-1" />
              <div className="text-xs text-muted-foreground">
                {project.progress.currentPhase} •{" "}
                {project.progress.completedTasks}/{project.progress.totalTasks}{" "}
                tasks
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectList({
  projects,
  title = "Recent Projects",
  maxItems = 5,
  showProgress = true,
  className,
  onViewAll,
  onProjectClick,
}: ProjectListProps) {
  const displayProjects = maxItems ? projects.slice(0, maxItems) : projects;
  const hasMore = projects.length > maxItems;

  if (projects.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No projects available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {hasMore && onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-sm"
          >
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              showProgress={showProgress}
              onClick={onProjectClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
