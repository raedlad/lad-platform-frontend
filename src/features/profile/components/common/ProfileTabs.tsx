"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface TabItem {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  type: string;
  isLogout?: boolean;
}

interface ProfileTabsProps {
  tabs: TabItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
  className?: string;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  const t = useTranslations("profile");

  return (
    <div className={cn("border-b border-border mb-6", className)}>
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((item, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={item.title}
              onClick={() => onTabChange(index)}
              className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                isActive
                  ? "border-design-main text-design-main"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              )}
            >
              {item.title}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;
