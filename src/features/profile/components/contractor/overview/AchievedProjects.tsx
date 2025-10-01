import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shared/components/ui/alert-dialog";
import {
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Link,
} from "lucide-react";
import { useAchievedProjectsStore } from "@/features/profile/store/achievedProjectsStore";
import { AchievedProject } from "@/features/profile/types/achievedProjects";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface AchievedProjectsProps {
  className?: string;
}

const AchievedProjects: React.FC<AchievedProjectsProps> = ({ className }) => {
  const t = useTranslations("profile.achievedProjects");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const {
    projects,
    projectTypes,
    isLoading,
    error,
    hasMore,
    fetchProjects,
    deleteProject,
    setError,
  } = useAchievedProjectsStore();

  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(
    new Set()
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  // Load projects on component mount
  useEffect(() => {
    // Only fetch if we don't have projects and we're not already loading
    if (!isLoading && (!projects || projects.length === 0)) {
      fetchProjects();
    }
  }, []); // Empty dependency array - only run once on mount

  const toggleExpanded = (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleDeleteClick = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      setDeletingId(projectToDelete);
      await deleteProject(projectToDelete);
      toast.success(t("actions.deleteSuccess"));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error(t("actions.deleteError"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const formatCurrency = (value: string | number, currency?: string) => {
    const currencyCode = currency || "USD";
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(numericValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProjectTypeDisplay = (project: AchievedProject) => {
    // Use the project_type object directly from the project
    if (project.project_type) {
      return project.project_type.name;
    }
    return tCommon("notProvided");
  };

  // Loading state
  if (isLoading && (!projects || projects.length === 0)) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex gap-2 ml-4">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground dark:text-card-foreground">
              {tCommon("error")}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={() => fetchProjects()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              {tCommon("tryAgain")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-design-main" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground dark:text-card-foreground">
              {t("empty.title")}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-4">
              {t("empty.description")}
            </p>
            <Link href="/dashboard/contractor/profile/edit/projects/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t("actions.addProject")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => {
          const isExpanded = expandedProjects.has(project.id!);
          const isDeleting = deletingId === project.id;

          return (
            <div
              key={project.id}
              className={cn(
                "bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border transition-all duration-200",
                isDeleting && "opacity-50"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Project Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-card-foreground dark:text-card-foreground">
                        {project.project_name}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        {project.city.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getProjectTypeDisplay(project)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(project.id!)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Project Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {project.start_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-design-main" />
                        <span className="text-muted-foreground">
                          {formatDate(project.start_date)}
                        </span>
                      </div>
                    )}

                    {project.specific_location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-design-main" />
                        <span className="text-muted-foreground">
                          {project.specific_location}
                        </span>
                      </div>
                    )}

                    {project.project_value && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-design-main" />
                        <span className="text-muted-foreground">
                          {formatCurrency(
                            project.project_value,
                            project.currency
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Images Preview */}
                  {project.project_images &&
                    project.project_images.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4 text-design-main" />
                        <span className="text-sm text-muted-foreground">
                          {project.project_images.length}{" "}
                          {t("imageCount", {
                            count: project.project_images.length,
                          })}
                        </span>
                      </div>
                    )}

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      {/* Description */}
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          {t("description")}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>

                      {/* Project Features */}
                      {project.project_features &&
                        project.project_features.length > 0 && (
                          <div>
                            <h4 className="font-medium text-foreground mb-2">
                              {t("features")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.project_features.map(
                                (feature, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {feature}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Challenges and Solutions */}
                      {(project.challenges_faced ||
                        project.solutions_provided) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.challenges_faced && (
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                {t("challenges")}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {project.challenges_faced}
                              </p>
                            </div>
                          )}

                          {project.solutions_provided && (
                            <div>
                              <h4 className="font-medium text-foreground mb-2">
                                {t("solutions")}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {project.solutions_provided}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Project Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {project.start_date && (
                          <div>
                            <span className="font-medium text-foreground">
                              {t("startDate")}:
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {formatDate(project.start_date)}
                            </span>
                          </div>
                        )}

                        {project.end_date && (
                          <div>
                            <span className="font-medium text-foreground">
                              {t("endDate")}:
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {formatDate(project.end_date)}
                            </span>
                          </div>
                        )}

                        {project.execution_date && (
                          <div>
                            <span className="font-medium text-foreground">
                              {t("executionDate")}:
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {formatDate(project.execution_date)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push(
                        `/dashboard/contractor/profile/edit/projects/edit/${project.id}`
                      );
                    }}
                    className="h-8 w-8 p-0"
                    title="View Project"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push(
                        `/dashboard/contractor/projects/edit/${project.id}`
                      );
                    }}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                    title="Edit Project"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(project.id!)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    title="Delete Project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation.message")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              {tCommon("actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deletingId !== null}
            >
              {deletingId !== null ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {tCommon("actions.deleting")}
                </>
              ) : (
                tCommon("actions.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AchievedProjects;
