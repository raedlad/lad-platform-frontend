"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

import PersonalInfo from "./overview/PersonalInfo";
import Documents from "./overview/Documents";
import Operational from "./overview/Operational";
import AchievedProjects from "./overview/AchievedProjects";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import Link from "next/link";

interface ContractorProfileTabContentProps {
  activeTab: number;
  className?: string;
}

const ContractorProfileTabContent: React.FC<
  ContractorProfileTabContentProps
> = ({ activeTab, className }) => {
  const t = useTranslations("profile.tabs");
  const tCommon = useTranslations("common");
  const {
    handleContractorProfileFetch,
    contractorPersonalInfo,
    contractorProfile,
    isLoading,
    error,
  } = usePersonalInfoStore();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Define the available tabs for contractor profile
  const tabs = [
    {
      id: 0,
      title: t("personalData"),
      component: (
        <PersonalInfo
          personalInfo={contractorPersonalInfo}
          profile={contractorProfile}
        />
      ),
    },
    {
      id: 1,
      title: t("documents"),
      component: <Documents />,
    },
    {
      id: 2,
      title: t("projects"),
      component: <AchievedProjects />,
    },
    {
      id: 3,
      title: t("operational"),
      component: <Operational profile={contractorProfile} />,
    },
  ];
  const getContentForTab = (tabIndex: number) => {
    const tab = tabs.find((t) => t.id === tabIndex);
    if (!tab) return null;
    const hasData =
      (contractorPersonalInfo &&
        Object.keys(contractorPersonalInfo).length > 0) ||
      (contractorProfile &&
        (contractorProfile.company_name ||
          contractorProfile.authorized_person_name));

    if (tabIndex === 0) {
      // Personal data tab
      return tab.component;
    }

    if (tabIndex === 1) {
      // Documents tab - always show the Documents component
      // The Documents component will handle its own loading, error, and empty states
      return tab.component;
    }

    if (tabIndex === 2) {
      // Projects tab - always show the AchievedProjects component
      // The AchievedProjects component will handle its own loading, error, and empty states
      return tab.component;
    }

    if (tabIndex === 3) {
      // Operational tab - always show the Operational component
      // The Operational component will handle its own empty state
      return tab.component;
    }
    return tab.component;
  };

  const loadContent = async () => {
    try {
      await handleContractorProfileFetch();
      setHasInitialLoad(true);
      const newContent = getContentForTab(activeTab);
      setContent(newContent);
    } catch (err) {
      console.error("Error loading profile content:", err);
      setHasInitialLoad(true);
    }
  };

  // Manual refresh function for retry buttons
  const refreshData = async () => {
    setHasInitialLoad(false);
    await loadContent();
  };

  const handleRetry = () => {
    refreshData();
  };

  useEffect(() => {
    // Only fetch data on initial mount, not on tab changes
    if (!hasInitialLoad) {
      loadContent();
    }
  }, [handleContractorProfileFetch, hasInitialLoad]);

  // Update content when data changes or tab changes
  useEffect(() => {
    if (hasInitialLoad) {
      const newContent = getContentForTab(activeTab);
      setContent(newContent);
    }
  }, [
    contractorPersonalInfo,
    contractorProfile,
    activeTab,
    isLoading,
    hasInitialLoad,
  ]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive" appearance="light">
          <AlertIcon>
            <AlertTriangle className="text-destructive dark:text-destructive" />
          </AlertIcon>
          <AlertContent>
            <AlertTitle className="text-destructive dark:text-destructive">
              {t("errorTitle")}
            </AlertTitle>
            <AlertDescription className="text-destructive dark:text-destructive">
              {error}
            </AlertDescription>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="mt-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground dark:border-border dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {tCommon("tryAgain")}
            </Button>
          </AlertContent>
        </Alert>
      </div>
    );
  }

  return <div className={className}>{content}</div>;
};

export default ContractorProfileTabContent;
