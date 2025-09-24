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
  Plus,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react";

import { Project, Offer } from "../../types";
import { cn } from "@/lib/utils";

interface IndividualSectionProps {
  projects: Project[];
  offers: Offer[];
  className?: string;
  onCreateProject?: () => void;
  onViewProject?: (projectId: string, projectStatus?: string) => void;
  onViewOffer?: (offerId: string) => void;
}

function ProjectProgressCard({ project }: { project: Project }) {
  if (!project.progress) return null;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-blue-600";
    if (percentage >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-sm line-clamp-1">
              {project.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {project.progress.currentPhase}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {project.status === "in_progress" ? "Active" : project.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span
              className={cn(
                "font-medium",
                getProgressColor(project.progress.percentage)
              )}
            >
              {project.progress.percentage}%
            </span>
          </div>
          <Progress value={project.progress.percentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {project.progress.completedTasks}/{project.progress.totalTasks}{" "}
              tasks
            </span>
            <span>
              Due:{" "}
              {new Date(project.timeline.endDate).toLocaleDateString("ar-SA", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentOfferCard({ offer }: { offer: Offer }) {
  const getStatusColor = (status: Offer["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      case "counter_offer":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: currency || "SAR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-1">
              {offer.projectTitle}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              by {offer.contractorName}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor(offer.status)}>
            {offer.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">
              {formatCurrency(offer.amount, offer.currency)}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgo(offer.submittedAt)}
            </span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{offer.timeline.estimatedDuration} days duration</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function IndividualSection({
  projects,
  offers,
  className,
  onCreateProject,
  onViewProject,
  onViewOffer,
}: IndividualSectionProps) {
  const activeProjects = projects.filter((p) => p.status === "in_progress");
  const recentOffers = offers.slice(0, 3);
  const urgentProjects = projects.filter(
    (p) => p.isUrgent && p.status === "in_progress"
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Active Projects Progress
              </CardTitle>
              <Button size="sm" onClick={onCreateProject}>
                <Plus className="h-4 w-4 mr-1" />
                New Project
              </Button>
            </CardHeader>
            <CardContent>
              {activeProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No Active Projects</h3>
                  <p className="text-sm">
                    Start your first project to track progress here.
                  </p>
                  <Button className="mt-4" onClick={onCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProjects.slice(0, 3).map((project) => (
                    <ProjectProgressCard key={project.id} project={project} />
                  ))}
                  {activeProjects.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => onViewProject?.("", "draft")}
                    >
                      View {activeProjects.length - 3} more projects
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Offers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Offers</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOffers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No offers yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOffers.map((offer) => (
                    <RecentOfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Urgent Projects Alert */}
      {urgentProjects.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-900">
                Urgent Projects Require Attention
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 cursor-pointer hover:shadow-sm"
                  onClick={() => onViewProject?.(project.id, project.status)}
                >
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {project.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Due:{" "}
                      {new Date(project.timeline.endDate).toLocaleDateString(
                        "ar-SA"
                      )}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 border-orange-300"
                  >
                    Urgent
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
