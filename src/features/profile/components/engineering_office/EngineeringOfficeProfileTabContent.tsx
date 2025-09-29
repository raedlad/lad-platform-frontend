"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import {
  PersonalInfo,
  Documents,
} from "@/features/profile/components/engineering_office/overview";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import EngineeringOfficeProfessionalInfo from "./EngineeringOfficeProfessionalInfo";

interface EngineeringOfficeProfileTabContentProps {
  activeTab: number;
  className?: string;
}

const EngineeringOfficeProfileTabContent: React.FC<
  EngineeringOfficeProfileTabContentProps
> = ({ activeTab, className }) => {
  const t = useTranslations("profile.tabs");
  const tCommon = useTranslations("common");
  const {
    handleEngineeringOfficeProfileFetch,
    engineeringOfficePersonalInfo,
    isLoading,
    error,
  } = usePersonalInfoStore();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const tabs = [
    {
      id: 0,
      title: t("personalData"),
      component: <PersonalInfo />,
    },
    {
      id: 1,
      title: t("documents"),
      component: <Documents />,
    },
    {
      id: 2,
      title: t("professionalInfo"),
      component: <EngineeringOfficeProfessionalInfo />,
    },
  ];

  const getContentForTab = (tabIndex: number) => {
    const tab = tabs.find((t) => t.id === tabIndex);
    if (!tab) return null;

    // For tab 0 (Personal Info), check if we have data
    if (tabIndex === 0) {
      const hasData =
        engineeringOfficePersonalInfo &&
        Object.keys(engineeringOfficePersonalInfo).length > 0;

      if (!hasData && hasInitialLoad && !isLoading) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("noPersonalData")}
            </p>
          </div>
        );
      }

      return tab.component;
    }

    // For tab 1 (Documents), just return the component - it handles its own states
    if (tabIndex === 1) {
      return tab.component;
    }

    return tab.component;
  };

  const loadContent = useCallback(async () => {
    try {
      await handleEngineeringOfficeProfileFetch();
      setHasInitialLoad(true);
    } catch (err: unknown) {
      console.error("Error loading engineering office profile content:", err);
      setHasInitialLoad(true);
    }
  }, [handleEngineeringOfficeProfileFetch]);

  const refreshData = useCallback(async () => {
    setHasInitialLoad(false);
    await loadContent();
  }, [loadContent]);

  const handleRetry = () => {
    refreshData();
  };

  useEffect(() => {
    if (!hasInitialLoad) {
      loadContent();
    }
  }, [hasInitialLoad, loadContent]);

  useEffect(() => {
    if (hasInitialLoad) {
      const newContent = getContentForTab(activeTab);
      setContent(newContent);
    }
  }, [engineeringOfficePersonalInfo, activeTab, isLoading, hasInitialLoad]);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-32 w-full bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Alert
          variant="destructive"
          appearance="light"
          className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        >
          <AlertIcon>
            <AlertTriangle className="text-red-500 dark:text-red-400" />
          </AlertIcon>
          <AlertContent>
            <AlertTitle className="text-red-800 dark:text-red-200">
              {t("errorTitle")}
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error}
            </AlertDescription>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="mt-2 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30 hover:text-red-800 dark:hover:text-red-200"
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

export default EngineeringOfficeProfileTabContent;
