"use client";
import RecentProjects from "./cards/RecentProjects";
import React from "react";
import { useTranslations } from "next-intl";
import { FolderOpen, Mail, FileCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import ProfileCompletionAlert from "@/features/profile/components/ProfileCompletionAlert";

const IndividualDashboardPage = () => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-8">
        {/* Profile Completion Alert */}
        <ProfileCompletionAlert />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("dashboard.individual.welcome", { name: "Ahmed" })}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("dashboard.individual.description")}
          </p>
        </div>
        <div className="flex items-center justify-center text-center">
          <div className="flex items-center justify-center gap-8 max-w-4xl flex-wrap lg:flex-nowrap">
            <div className="flex flex-col items-center justify-center gap-8 p-8 max-w-md font-semibold shadow-md border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t(
                  "dashboard.individual.quickActions.createProject.description"
                )}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="cursor-not-allowed text-sm py-3 px-8 rounded-full transition-colors">
                      {t(
                        "dashboard.individual.quickActions.createProject.button"
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tCommon("ui.comingSoon")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-col items-center gap-8 p-8 max-w-md font-semibold shadow-md border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t(
                  "dashboard.individual.quickActions.requestMaterials.description"
                )}
              </p>
              <button className="text-sm py-3 px-8 bg-design-main hover:bg-design-main-dark text-white rounded-full transition-colors">
                {t("dashboard.individual.quickActions.requestMaterials.button")}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-center">
          <div className="w-full flex items-center justify-center gap-8 max-w-4xl flex-wrap lg:flex-nowrap">
            <div className="w-full flex flex-col items-center justify-center py-4 max-w-md font-semibold shadow-md border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <FolderOpen className="w-14 h-14 text-design-main mb-4" />
              <h1 className="text-2xl font-bold text-design-main">12</h1>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("dashboard.individual.statistics.activeProjects")}
              </h2>
              <p className="text-design-main">
                {t("dashboard.individual.statistics.activeProjectsCount", {
                  count: 2,
                })}
              </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center py-4 max-w-md font-semibold shadow-md border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <Mail className="w-14 h-14 text-design-main mb-4" />
              <h1 className="text-2xl font-bold text-design-main">30</h1>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("dashboard.individual.statistics.receivedOffers")}
              </h2>
              <p className="text-design-main">
                {t("dashboard.individual.statistics.receivedOffersCount", {
                  count: 5,
                })}
              </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center py-4 max-w-md font-semibold shadow-md border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
              <FileCheck className="w-14 h-14 text-design-main mb-4" />
              <h1 className="text-2xl font-bold text-design-main">5</h1>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("dashboard.individual.statistics.signedContracts")}
              </h2>
              <p className="text-design-main">
                {t("dashboard.individual.statistics.signedContractsCount", {
                  count: 3,
                })}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <RecentProjects />
        </div>
      </div>
    </div>
  );
};

export default IndividualDashboardPage;
