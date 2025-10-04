"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/features/project/types/project";

interface ProjectTabsProps {
  projects: Project[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ProjectTabs({
  projects,
  activeTab,
  onTabChange,
}: ProjectTabsProps) {
  const t = useTranslations("projectsList");

  const tabs = [
    {
      value: "all",
      label: t("tabs.all"),
    },
    {
      value: "draft",
      label: t("tabs.draft"),
    },
    {
      value: "review_pending",
      label: t("tabs.review_pending"),
    },
    {
      value: "published",
      label: t("tabs.published"),
    },
    {
      value: "receiving_bids",
      label: t("tabs.receiving_bids"),
    },
    {
      value: "offer_accepted",
      label: t("tabs.offer_accepted"),
    },
    {
      value: "awaiting_contract_signature",
      label: t("tabs.awaiting_contract_signature"),
    },
    {
      value: "contract_signed",
      label: t("tabs.contract_signed"),
    },
    {
      value: "in_progress",
      label: t("tabs.in_progress"),
    },
    {
      value: "cancelled",
      label: t("tabs.cancelled"),
    },
    {
      value: "rejected",
      label: t("tabs.rejected"),
    },
    {
      value: "completed",
      label: t("tabs.completed"),
    },
    {
      value: "closed_completed",
      label: t("tabs.closed_completed"),
    },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="inline-flex w-max min-w-full gap-1 p-1 h-13 rounded-full backdrop-blur-sm border shadow-md snap-x snap-mandatory">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-design-main data-[state=active]:to-p-6 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-xs px-3 py-2 min-w-fit flex-shrink-0 whitespace-nowrap snap-start touch-pan-x rounded-full"
            >
              <span className="text-center leading-tight text-[10px] sm:text-xs font-medium">
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
