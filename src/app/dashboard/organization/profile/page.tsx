"use client";
import React, { useState } from "react";
import AvatarUpload from "@/features/profile/components/common/AvatarUpload";
import { User, FileText, PenLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/shared/components/ui/button";
import ProfileTabs from "@/features/profile/components/common/ProfileTabs";
import ProfileTabContent from "@/features/profile/components/organization/OrganizationProfileTabContent";
import Link from "next/link";

interface User {
  full_name?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  phoneNumber?: string;
  phone_number?: string;
}
// Helper function to get user display name
const getUserDisplayName = (user: User) => {
  if (user?.full_name) return user.full_name;
  if (user?.firstName && user?.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user?.first_name && user?.last_name)
    return `${user.first_name} ${user.last_name}`;
  if (user?.name) return user.name;
  return "المستخدم";
};

// Helper function to get user phone
const getUserPhone = (user: User) => {
  return user?.phone || user?.phoneNumber || user?.phone_number || "";
};

// Progress bar component
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
    <div
      className="bg-green-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default function Page() {
  const t = useTranslations("profile");
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const profileTabs = [
    {
      title: t("tabs.personalData"),
      description: t("tabs.personalData"),
      icon: User,
      type: "tab",
    },
    {
      title: t("tabs.documents"),
      description: t("tabs.documents"),
      icon: FileText,
      type: "tab",
    },
  ];

  // No special items needed - only tabs

  return (
    <div className="w-full h-full py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto mt-20">
        {/* Profile Header Card */}
        <div className="relative w-full mb-8">
          <div className="flex flex-row gap-6 lg:gap-12 justify-center text-center">
            {/* Avatar Section */}
            <div className="">
              <div className="mb-4 relative">
                <AvatarUpload />
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex flex-col gap-2 items-start">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {getUserDisplayName(user as User)}
              </h1>
              <p className="text-sm sm:text-base  mb-2">
                {getUserPhone(user as User)}
              </p>

              <Link href="/dashboard/organization/profile/edit/personal-info" className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-full font-semibold text-xs"
                  size="lg"
                >
                  <PenLine className="w-4 h-4 me-1 font-semibold" />
                  {t("editProfile")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <ProfileTabs
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Area */}
        <ProfileTabContent activeTab={activeTab} />
      </div>
    </div>
  );
}
