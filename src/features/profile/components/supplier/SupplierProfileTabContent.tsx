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

import { useAuthStore } from "@/features/auth/store";
import SupplierProfessionalInfo from "./SupplierProfessionalInfo";

interface SupplierProfileTabContentProps {
  activeTab: number;
  className?: string;
}

const SupplierProfileTabContent: React.FC<SupplierProfileTabContentProps> = ({
  activeTab,
  className,
}) => {
  const t = useTranslations("profile");
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<React.ReactNode>(null);

  // Helper function to get user display name
  const getUserDisplayName = (user: any) => {
    if (user?.full_name) return user.full_name;
    if (user?.firstName && user?.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user?.first_name && user?.last_name)
      return `${user.first_name} ${user.last_name}`;
    if (user?.name) return user.name;
    return "المستخدم";
  };

  // Helper function to get user phone
  const getUserPhone = (user: any) => {
    return user?.phone || user?.phoneNumber || user?.phone_number || "";
  };

  // Personal Info Data Component
  const PersonalInfoData = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Full Name
            </label>
            <p className="text-sm text-gray-900 mt-1">
              {getUserDisplayName(user)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <p className="text-sm text-gray-900 mt-1">{getUserPhone(user)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm text-gray-900 mt-1">
              {user?.email || "Not provided"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="text-sm text-gray-900 mt-1 capitalize">
              {user?.user_type || "Individual"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Documents Data Component
  const DocumentsData = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Documents</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No documents uploaded
          </h4>
          <p className="text-gray-500 mb-4">
            Upload your documents to get started
          </p>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Upload Documents
          </button>
        </div>
      </div>
    </div>
  );

  // Professional Info Data Component
  const ProfessionalInfoData = () => <SupplierProfessionalInfo />;

  // Define the available tabs for supplier profile
  const tabs = [
    {
      id: 0,
      title: "Personal Info",
      component: <PersonalInfoData />,
    },
    {
      id: 1,
      title: "Professional Info",
      component: <ProfessionalInfoData />,
    },
    {
      id: 2,
      title: "Documents",
      component: <DocumentsData />,
    },
  ];

  // Get content based on active tab
  const getContentForTab = (tabIndex: number) => {
    const tab = tabs.find((t) => t.id === tabIndex);
    return tab ? tab.component : null;
  };

  const loadContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newContent = getContentForTab(activeTab);
      setContent(newContent);
    } catch (err) {
      setError("Failed to load content. Please try again.");
      console.error("Error loading profile content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadContent();
  };

  // Load content when activeTab changes
  useEffect(() => {
    loadContent();
  }, [activeTab]);

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
            <AlertTriangle />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Error Loading Content</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </AlertContent>
        </Alert>
      </div>
    );
  }

  return <div className={className}>{content}</div>;
};

export default SupplierProfileTabContent;
