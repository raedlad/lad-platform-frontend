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
import { AlertTriangle, Link, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

import PersonalInfo from "./overview/PersonalInfo";
import Documents from "./overview/Documents";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";

interface IndividualProfileTabContentProps {
  activeTab: number;
  className?: string;
}

const IndividualProfileTabContent: React.FC<
  IndividualProfileTabContentProps
> = ({ activeTab, className }) => {
  const t = useTranslations("profile.tabs");
  const tCommon = useTranslations("common");
  const {
    handleIndividualProfileFetch,
    individualPersonalInfo,
    individualProfile,
    isLoading,
    error,
  } = usePersonalInfoStore();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Define the available tabs for individual profile
  const tabs = [
    {
      id: 0,
      title: t("personalData"),
      component: (
        <PersonalInfo
          personalInfo={individualPersonalInfo}
          profile={individualProfile}
        />
      ),
    },
    {
      id: 1,
      title: t("documents"),
      component: <Documents profile={individualProfile} />,
    },
  ];
  const getContentForTab = (tabIndex: number) => {
    const tab = tabs.find((t) => t.id === tabIndex);
    if (!tab) return null;
    const hasData =
      (individualPersonalInfo &&
        Object.keys(individualPersonalInfo).length > 0) ||
      (individualProfile &&
        (individualProfile.first_name || individualProfile.last_name));
    const hasDocuments =
      individualProfile?.documents && individualProfile.documents.length > 0;
    const verificationStatus = individualProfile?.verification_status;
    if (tabIndex === 0) {
      // For personal data tab, always show the component
      // The PersonalInfo component will handle displaying "Not provided" for missing fields
      return tab.component;
    }

    if (tabIndex === 1) {
      // For documents tab, show appropriate content based on data availability
      if (!hasDocuments && hasInitialLoad && !isLoading) {
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{t("noDocuments")}</p>
            <Link href="/dashboard/individual/profile/edit/documents">
            <Button
            >
              {t("uploadDocuments")}
            </Button>
            </Link>
          </div>
        );
      }

      return tab.component;
    }
    return tab.component;
  };

  const loadContent = async () => {
    try {
      await handleIndividualProfileFetch();
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
  }, [handleIndividualProfileFetch, hasInitialLoad]);

  // Update content when data changes or tab changes
  useEffect(() => {
    if (hasInitialLoad) {
      const newContent = getContentForTab(activeTab);
      setContent(newContent);
    }
  }, [
    individualPersonalInfo,
    individualProfile,
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

export default IndividualProfileTabContent;
