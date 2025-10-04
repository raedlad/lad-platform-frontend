"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Project } from "@/features/project/types/project";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  MapPin,
  Clock,
  Square,
  HardHat,
  BriefcaseBusiness,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  getProjectTypeName: (typeId: number) => string;
  getStatusText: (project: Project) => string;
}

export function ProjectCard({
  project,
  getProjectTypeName,
  getStatusText,
}: ProjectCardProps) {
  const t = useTranslations("projectsList");

  const formatBudget = () => {
    const { budget_min, budget_max, budget_unit } = project.essential_info;

    if (budget_min && budget_max) {
      return `${budget_min.toLocaleString()} - ${budget_max.toLocaleString()}${
        budget_unit ? ` ${budget_unit}` : ""
      }`;
    }

    if (budget_min) {
      return `${budget_min.toLocaleString()}${
        budget_unit ? ` ${budget_unit}` : ""
      }`;
    }

    if (budget_max) {
      return `${budget_max.toLocaleString()}${
        budget_unit ? ` ${budget_unit}` : ""
      }`;
    }

    return "Not specified";
  };

  const formatArea = () => {
    const area = project.essential_info.area_sqm;
    return area ? `${area.toLocaleString()} m²` : "Not specified";
  };

  const formatLocation = () => {
    const cityName = project.essential_info.city_name;
    const district = project.essential_info.district;
    return cityName || district || "Location not specified";
  };

  const getStatusIcon = () => {
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <article className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-800">
      <div className="flex flex-col gap-5">
        {/* Header Section */}
        <header className="space-y-3">
          <div className="flex flex-col gap-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
              {project.essential_info.title}
            </h1>

            {/* Description */}
            {project.essential_info.description && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {project.essential_info.description}
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
                  {t("projectCard.location")}:
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatLocation()}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-design-main">{getStatusIcon()}</span>
                <span className="text-sm font-medium">
                  {t("projectCard.status.label")}:
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {getStatusText(project)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project Type */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <HardHat className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                <span className="text-sm font-medium">
                  {t("projectCard.type")}:
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {project.essential_info.project_type_name ||
                  getProjectTypeName(project.essential_info.project_type_id)}
              </span>
            </div>

            {/* Budget */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <BriefcaseBusiness className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                <span className="text-sm font-medium">
                  {t("projectCard.budget")}:
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatBudget()}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                <span className="text-sm font-medium">
                  {t("projectCard.duration")}:
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {project.essential_info.duration_value}{" "}
                {project.essential_info.duration_unit}
              </span>
            </div>

            {/* Area */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Square className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                <span className="text-sm font-medium">
                  {t("projectCard.area")}:
                </span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatArea()}
              </span>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <footer className="flex gap-3 pt-2">
          <Link
            href={`/dashboard/individual/projects/${project.id}/edit`}
            className="flex-1"
          >
            <Button
              variant="default"
              size="sm"
              className="w-full text-sm font-medium"
            >
              {t("projectCard.actions.edit")}
            </Button>
          </Link>
          <Link
            href={`/dashboard/individual/projects/${project.id}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full text-sm font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t("projectCard.actions.view")}
              <ArrowLeft className="w-4 h-4 ml-2 ltr:rotate-180" />
            </Button>
          </Link>
        </footer>
      </div>
    </article>
  );
}
