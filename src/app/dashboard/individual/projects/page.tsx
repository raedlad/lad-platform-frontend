"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { projectApi } from "@/features/project/services/projectApi";
import {
  Project,
  ProjectResponse,
  PaginatedApiResponse,
} from "@/features/project/types/project";
import { ProjectCard } from "@/features/project/components/display/ProjectCard";
import { ProjectTabs } from "@/features/project/components/display/ProjectTabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/shared/components/ui/pagination";
import { Package, Plus, Building2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

const ProjectsPage = () => {
  const t = useTranslations("projectsList");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    per_page: 50,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const loadProjects = async (statusFilter?: string, page: number = 1) => {
    setLoading(true);
    try {
      const response = await projectApi.getUserProjects({
        status: statusFilter,
        per_page: 6,
        page: page,
      });

      if (
        response.success &&
        response.response &&
        response.response.data &&
        Array.isArray(response.response.data)
      ) {
        const transformedProjects = response.response.data.map(
          (apiProject: ProjectResponse) => {
            return {
              id: apiProject.id.toString(),
              essential_info: {
                title: apiProject.title,
                project_type_id: parseInt(apiProject.project_type_id),
                city_id: apiProject.location?.city_id?.toString() || "",
                district: apiProject.location?.district || "",
                address_line: apiProject.location?.address_line || "",
                latitude: apiProject.location?.latitude || undefined,
                longitude: apiProject.location?.longitude || undefined,
                budget_min: apiProject.budget_min || 0,
                budget_max: apiProject.budget_max || 0,
                budget_unit: "SAR",
                duration_value: parseInt(apiProject.duration_value),
                duration_unit: apiProject.duration_unit,
                area_sqm: apiProject.area_sqm,
                description: apiProject.description,
                project_type_name: apiProject.type?.name || "",
                city_name: apiProject.location?.city_name || "",
                full_address: apiProject.location?.full_address || "",
                created_at: apiProject.created_at,
                updated_at: apiProject.updated_at,
                is_active: apiProject.is_active,
                client_id: apiProject.client_id,
                contractor_id: apiProject.contractor_id,
              },
              classification: {
                id: 0,
                jobId: 0,
                workTypeId: 0,
                levelId: 0,
                notes: "",
              },
              documents: {
                architectural_plans: [],
                licenses: [],
                specifications: [],
                site_photos: [],
              },
              status: {
                status: apiProject.status as Project["status"]["status"],
              },
              publish_settings: {
                notify_matching_contractors: false,
                notify_client_on_offer: false,
                offers_window_days: 0,
              },
              boq: {
                items: [],
                total_amount: 0,
              },
            } as Project;
          }
        );

        setProjects(transformedProjects);

        setPaginationMeta({
          total: response.response.total,
          per_page: response.response.per_page,
          current_page: response.response.current_page,
          last_page: response.response.last_page,
          from: response.response.from,
          to: response.response.to,
        });
      } else {
        toast.error(response.message || "Failed to load projects");
        setProjects([]);
        setPaginationMeta({
          total: 0,
          per_page: 50,
          current_page: 1,
          last_page: 1,
          from: 0,
          to: 0,
        });
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "all") {
      loadProjects(activeTab);
    } else {
      loadProjects();
    }
  }, [activeTab]);

  const getProjectTypeName = (project: Project) => {
    return (
      t(`projectTypes.${project.essential_info.project_type_id}`) ||
      t("projectTypes.unknown")
    );
  };

  const getStatusText = (project: Project) => {
    const status = project.status.status;
    return t(`projectCard.status.${status}`) || status;
  };

  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return projects;

    return projects.filter((project) => {
      const projectStatus = project.status.status;

      switch (activeTab) {
        case "draft":
          return projectStatus === "draft";
        case "review_pending":
          return projectStatus === "review_pending";
        case "published":
          return projectStatus === "published";
        case "receiving_bids":
          return projectStatus === "receiving_bids";
        case "offer_accepted":
          return projectStatus === "offer_accepted";
        case "awaiting_contract_signature":
          return projectStatus === "awaiting_contract_signature";
        case "contract_signed":
          return projectStatus === "contract_signed";
        case "in_progress":
          return projectStatus === "in_progress";
        case "cancelled":
          return projectStatus === "cancelled";
        case "rejected":
          return projectStatus === "rejected";
        case "completed":
          return projectStatus === "completed";
        case "closed_completed":
          return projectStatus === "closed_completed";
        default:
          return true;
      }
    });
  }, [projects, activeTab]);

  const totalPages = paginationMeta.last_page;
  const startIndex = paginationMeta.from - 1;
  const endIndex = paginationMeta.to;
  const paginatedProjects = projects;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex items-center justify-between gap-6 pb-4 border-b-2 border-design-main/20">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-n-9 dark:text-n-1 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-design-main to-design-main-dark shadow-lg">
                  <Building2 className="h-4 w-4 sm:h-7 sm:w-7 text-white" />
                </div>
                {t("title")}
              </h1>
            </div>
            <Link href="/dashboard/individual/projects/new">
              <Button
                size="sm"
                className="gap-2 bg-design-main hover:bg-design-main-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold"
              >
                <Plus className="h-5 w-5" />
                {t("emptyState.createButton")}
              </Button>
            </Link>
          </div>

          <div className="w-full">
            <ProjectTabs
              projects={projects}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800"
              >
                <div className="flex flex-col gap-5">
                  {/* Header Section Skeleton */}
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>

                  {/* Project Details Section Skeleton */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>

                      {/* Status */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Type */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-4 w-28" />
                      </div>

                      {/* Budget */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>

                      {/* Duration */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>

                      {/* Area */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-4 h-4 rounded" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex gap-3 pt-2">
                    <Skeleton className="flex-1 h-9 rounded-md" />
                    <Skeleton className="flex-1 h-9 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between gap-6 pb-4 border-b-2 border-design-main/20">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-n-9 dark:text-n-1 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-design-main to-design-main-dark shadow-lg">
                <Building2 className="h-4 w-4 sm:h-7 sm:w-7 text-white" />
              </div>
              {t("title")}
            </h1>
          </div>
          <Link href="/dashboard/individual/projects/new">
            <Button
              size="sm"
              className="gap-2 bg-design-main hover:bg-design-main-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold"
            >
              <Plus className="h-5 w-5" />
              {t("emptyState.createButton")}
            </Button>
          </Link>
        </div>

        <div className="w-full">
          <ProjectTabs
            projects={projects}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {paginatedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              getProjectTypeName={() => getProjectTypeName(project)}
              getStatusText={getStatusText}
            />
          ))}
        </div>

        {paginationMeta.total > paginationMeta.per_page && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-n-1 to-p-1/20 dark:from-n-8/30 dark:to-p-9/10 rounded-xl border border-n-3 dark:border-n-7 shadow-sm">
            <div className="text-sm font-medium text-n-7 dark:text-n-3">
              {t("pagination.showing")}{" "}
              <span className="font-bold text-design-main">
                {paginationMeta.from}
              </span>{" "}
              -{" "}
              <span className="font-bold text-design-main">
                {paginationMeta.to}
              </span>{" "}
              {t("pagination.of")}{" "}
              <span className="font-bold text-design-main-dark dark:text-design-main">
                {paginationMeta.total}
              </span>{" "}
              {t("pagination.results")}
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        loadProjects(
                          activeTab === "all" ? undefined : activeTab,
                          newPage
                        );
                      }
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-design-main/10 hover:border-design-main/30"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                          loadProjects(
                            activeTab === "all" ? undefined : activeTab,
                            pageNumber
                          );
                        }}
                        isActive={currentPage === pageNumber}
                        className={`cursor-pointer ${
                          currentPage === pageNumber
                            ? "bg-design-main text-white hover:bg-design-main-dark"
                            : "hover:bg-design-main/10 hover:border-design-main/30"
                        }`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        loadProjects(
                          activeTab === "all" ? undefined : activeTab,
                          newPage
                        );
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer hover:bg-design-main/10 hover:border-design-main/30"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-design-main/20 to-p-4/20 blur-3xl rounded-full" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-n-1 to-p-1/50 dark:from-n-8 dark:to-p-9/30 rounded-full flex items-center justify-center border-4 border-design-main/20 shadow-xl">
                <Package className="h-16 w-16 text-design-main" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-n-9 dark:text-n-1 mb-3">
              {t("emptyState.title")}
            </h3>
            <p className="text-n-6 dark:text-n-4 mb-8 max-w-md mx-auto text-center leading-relaxed">
              {t("emptyState.description")}
            </p>
            <Link href="/dashboard/individual/projects/new">
              <Button
                size="lg"
                className="gap-2 bg-design-main hover:bg-design-main-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-base font-semibold"
              >
                <Plus className="h-5 w-5" />
                {t("emptyState.createButton")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
