"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ContractorOffer } from "../../types";
import { Badge } from "@/shared/components/ui/badge";
import {
  MapPin,
  HardHat,
  User,
  Star,
  FileText,
  Clock,
  Square,
  BriefcaseBusiness,
  CheckCircle,
} from "lucide-react";

interface ProjectInfoCardProps {
  offer: ContractorOffer;
}

export const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ offer }) => {
  const t = useTranslations();

  // Mock project data - similar to ProjectCard structure
  const mockProjectData = {
    description:
      "A comprehensive residential construction project including architectural design, structural work, and finishing. The project requires experienced contractors with proven track record in similar developments.",
    status: "Open for Offers",
    budget: {
      min: 500000,
      max: 750000,
      unit: "SAR",
    },
    duration: {
      value: 180,
      unit: "days",
    },
    area: {
      value: 450,
      unit: "m²",
    },
  };

  const formatBudget = () => {
    const { min, max, unit } = mockProjectData.budget;
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${unit}`;
    }
    return "Not specified";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-n-3 dark:border-n-7">
        <div className="w-1 h-8 bg-design-main rounded-full"></div>
        <h2 className="text-2xl font-bold text-n-9 dark:text-n-1">
          {t("offers.details.projectDetails")}
        </h2>
      </div>

      {/* Header Section */}
      <header className="space-y-3">
        <div className="flex flex-col gap-3">
          {/* Project Owner Information */}
          {offer.projectOwner && (
            <section className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-p-5 to-p-6 dark:from-p-4 dark:to-p-5 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {offer.projectOwner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-n-9 dark:text-n-1">
                    {offer.projectOwner.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-n-6 dark:text-n-4">
                      {offer.projectOwner.rating}/5
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
          <h1 className="text-lg font-semibold text-n-9 dark:text-n-1 leading-tight">
            {offer.projectTitle}
          </h1>

          {/* Description */}
          {mockProjectData.description && (
            <div className="space-y-1">
              <p className="text-sm text-n-6 dark:text-n-4 line-clamp-2 leading-relaxed">
                {mockProjectData.description}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Project Details Section */}
      <section className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Location */}
          {offer.projectLocation && (
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-n-7 dark:text-n-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                <span className="text-sm font-medium">
                  {t("offers.location")}:
                </span>
              </div>
              <span className="text-sm text-n-9 dark:text-n-1">
                {offer.projectLocation}
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 text-n-7 dark:text-n-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
              <span className="text-sm font-medium">{t("offers.status")}:</span>
            </div>
            <span className="text-sm text-n-9 dark:text-n-1">
              {mockProjectData.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Project Type */}
          {offer.projectType && (
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-n-7 dark:text-n-3">
                <HardHat className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
                <span className="text-sm font-medium">{t("offers.type")}:</span>
              </div>
              <span className="text-sm text-n-9 dark:text-n-1">
                {offer.projectType}
              </span>
            </div>
          )}

          {/* Budget */}
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 text-n-7 dark:text-n-3">
              <BriefcaseBusiness className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
              <span className="text-sm font-medium">{t("offers.budget")}:</span>
            </div>
            <span className="text-sm text-n-9 dark:text-n-1">
              {formatBudget()}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 text-n-7 dark:text-n-3">
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
              <span className="text-sm font-medium">
                {t("offers.duration")}:
              </span>
            </div>
            <span className="text-sm text-n-9 dark:text-n-1">
              {mockProjectData.duration.value} {mockProjectData.duration.unit}
            </span>
          </div>

          {/* Area */}
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 text-n-7 dark:text-n-3">
              <Square className="w-4 h-4 flex-shrink-0 mt-0.5 text-design-main" />
              <span className="text-sm font-medium">{t("offers.area")}:</span>
            </div>
            <span className="text-sm text-n-9 dark:text-n-1">
              {mockProjectData.area.value.toLocaleString()}{" "}
              {mockProjectData.area.unit}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
