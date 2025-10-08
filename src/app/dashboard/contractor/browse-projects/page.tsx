"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAvailableProjects } from "@/features/offers/hooks/useAvailableProjects";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  ArrowRight,
  RefreshCw,
  FileText,
  Square,
  HardHat,
  BriefcaseBusiness,
  CheckCircle,
  Search,
} from "lucide-react";

const BrowseProjectsPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const { availableProjects, fetchAvailableProjects, isLoading, error } =
    useAvailableProjects();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [projectTypeId, setProjectTypeId] = React.useState<
    number | undefined
  >();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  React.useEffect(() => {
    fetchAvailableProjects({
      q: debouncedSearchQuery || undefined,
      project_type_id: projectTypeId,
      per_page: 100,
    });
  }, [fetchAvailableProjects, debouncedSearchQuery, projectTypeId]);

  const handleSubmitOffer = (project: any) => {
    // Navigate to create complete offer page
    router.push(`/dashboard/contractor/offers/create/${project.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("common.error")}
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.tryAgain")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("navigation.browseProjects")}
            </h1>
            <p className="text-gray-600">{t("offers.startBrowsingProjects")}</p>
          </div>
          <Button
            onClick={() =>
              fetchAvailableProjects({
                q: searchQuery || undefined,
                project_type_id: projectTypeId,
                per_page: 20,
              })
            }
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {t("common.refresh")}
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("offers.searchProjects")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-design-main/20 focus:border-design-main focus:ring-design-main/20"
              />
            </div>
          </div>
          <div className="w-full sm:w-64">
            <Select
              value={projectTypeId?.toString() || "all"}
              onValueChange={(value) =>
                setProjectTypeId(value === "all" ? undefined : parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("offers.allProjectTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("offers.allProjectTypes")}
                </SelectItem>
                <SelectItem value="1">{t("offers.residential")}</SelectItem>
                <SelectItem value="2">{t("offers.commercial")}</SelectItem>
                <SelectItem value="3">{t("offers.industrial")}</SelectItem>
                <SelectItem value="4">{t("offers.infrastructure")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full text-center py-16">
            <div className="text-gray-400 mb-4">
              <RefreshCw className="mx-auto h-12 w-12 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("common.loading")}
            </h3>
            <p className="text-gray-600">{t("offers.loadingProjects")}</p>
          </div>
        ) : !availableProjects || availableProjects.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-gray-400 mb-6">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("offers.noOffers")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("offers.tryDifferentSearch")}
            </p>
          </div>
        ) : (
          availableProjects?.map((project: any, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <article className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
                <div className="flex flex-col gap-5">
                  {/* Header Section */}
                  <header className="space-y-3">
                    <div className="flex flex-col gap-3">
                      <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                        {project.title}
                      </h1>

                      {/* Description */}
                      {project.description && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      )}

                      {/* Location and Status */}
                    </div>
                  </header>

                  {/* Project Details Section */}
                  <section className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.location")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.location?.full_address ||
                            t("common.notSpecified")}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-design-main">
                            <CheckCircle className="w-4 h-4" />
                          </span>
                          <span className="text-sm font-medium">
                            {t("offers.status")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.status_info?.is_accepting_offers
                            ? t("offers.open")
                            : t("offers.closed")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Project Type */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <HardHat className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.type")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.type?.name || "General"}
                        </span>
                      </div>

                      {/* Budget */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <BriefcaseBusiness className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.budget")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.budget_display || t("common.notSpecified")}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.duration")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.duration_value} {project.duration_unit}
                        </span>
                      </div>

                      {/* Bidders */}
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Users className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.bidders")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.status_info?.days_until_deadline > 0
                            ? Math.ceil(project.status_info.days_until_deadline)
                            : 0}{" "}
                          {t("common.days")} {t("common.left")}
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.startDate")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.publish_at
                            ? new Date(project.publish_at).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <Calendar className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                          <span className="text-sm font-medium">
                            {t("offers.endDate")}:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.offers_deadline_at
                            ? new Date(
                                project.offers_deadline_at
                              ).toLocaleDateString()
                            : "TBD"}
                        </span>
                      </div>
                    </div>

                    {/* Area */}
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Square className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                        <span className="text-sm font-medium">
                          {t("offers.area")}:
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {project.area_sqm} {t("offers.areaUnit")}
                      </span>
                    </div>
                  </section>

                  {/* Action Buttons */}
                  <footer className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleSubmitOffer(project)}
                      className="flex-1 bg-design-main hover:bg-design-main/90 text-white group/btn"
                      // disabled={!project.status_info?.is_accepting_offers}
                    >
                      {!project.status_info?.is_accepting_offers ? (
                        t("offers.closed")
                      ) : (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {t("offers.applyOffer")}
                        </div>
                      )}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform rtl:rotate-180" />
                    </Button>
                  </footer>
                </div>
              </article>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseProjectsPage;
