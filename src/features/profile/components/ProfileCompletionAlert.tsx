"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProfileCompletionAlertProps {
  className?: string;
}

const ProfileCompletionAlert: React.FC<ProfileCompletionAlertProps> = ({
  className = "",
}) => {
  const t = useTranslations("profile");
  const { user } = useAuthStore();

  // Check if profile completion is required
  const profileStatus = user?.account_overview?.profile_status;
  const isProfileIncomplete = profileStatus === "not_completed";

  // Don't render if profile is complete
  if (!isProfileIncomplete) {
    return null;
  }

  // Get the appropriate profile edit URL based on user type
  const getProfileEditUrl = () => {
    const userType = user?.user_type;
    switch (userType) {
      case "individual":
        return "/dashboard/individual/profile/edit/personal-info";
      case "contractor":
        return "/dashboard/contractor/profile/edit/personal-info";
      case "freelance_engineer":
        return "/dashboard/freelance_engineer/profile/edit/personal-info";
      case "engineering_office":
        return "/dashboard/engineering_office/profile/edit/personal-info";
      case "organization":
        return "/dashboard/organization/profile/edit/personal-info";
      case "supplier":
        return "/dashboard/supplier/profile/edit/personal-info";
      default:
        return "/dashboard/profile/edit";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-w-3 dark:from-w-9/20 dark:to-w-8/30 shadow-lg mb-6">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZWYzYTkiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        {/* Left accent border */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-w-6 to-w-7"></div>

        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-w-6 shadow-sm">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-w-9 dark:text-w-8 mb-2">
                    {t("completionAlert.title")}
                  </h3>
                  <p className="text-w-8 dark:text-w-7 text-sm leading-relaxed">
                    {t("completionAlert.description")}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Link href={getProfileEditUrl()}>
                    <Button
                      size="sm"
                      className="bg-design-main hover:bg-design-main-dark text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-design-main focus:ring-offset-2 font-medium px-6 py-2.5"
                    >
                      {t("completionAlert.completeProfile")}
                      <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionAlert;
