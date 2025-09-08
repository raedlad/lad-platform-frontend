"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  User,
  FileText,
  Briefcase,
  Settings,
  Shield,
  Eye,
  Wrench,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileTab } from "@/app/dashboard/profile/page";

interface ProfileNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileNavigation({
  activeTab,
  onTabChange,
}: ProfileNavigationProps) {
  // Mock user data to determine which sections to show
  const userRole = "Engineering Office"; // This should come from user store/context

  const navigationItems = [
    {
      id: "overview" as ProfileTab,
      label: "Overview",
      icon: Eye,
      description: "Profile summary and quick actions",
      showForRoles: ["all"],
      hasIssues: false,
    },
    {
      id: "personal" as ProfileTab,
      label: "Personal Info",
      icon: User,
      description: "Basic information and contact details",
      showForRoles: ["all"],
      hasIssues: true, // Phone not verified
    },
    {
      id: "documents" as ProfileTab,
      label: "Documents & Verification",
      icon: FileText,
      description: "Upload and manage verification documents",
      showForRoles: ["all"],
      hasIssues: false,
    },
    {
      id: "professional" as ProfileTab,
      label: "Professional Info",
      icon: Briefcase,
      description: "Work experience and qualifications",
      showForRoles: [
        "Freelance Engineer",
        "Engineering Office",
        "Contractor",
        "Supplier",
      ],
      hasIssues: false,
    },
    {
      id: "technical" as ProfileTab,
      label: "Technical Info",
      icon: Wrench,
      description: "Technical skills and specializations",
      showForRoles: [
        "Freelance Engineer",
        "Engineering Office",
        "Contractor",
        "Supplier",
      ],
      hasIssues: true, // Missing specializations
    },
    {
      id: "security" as ProfileTab,
      label: "Security",
      icon: Shield,
      description: "Password and security settings",
      showForRoles: ["all"],
      hasIssues: false,
    },
    {
      id: "settings" as ProfileTab,
      label: "Settings",
      icon: Settings,
      description: "Account preferences and privacy",
      showForRoles: ["all"],
      hasIssues: false,
    },
  ];

  const shouldShowItem = (item: (typeof navigationItems)[0]) => {
    return (
      item.showForRoles.includes("all") || item.showForRoles.includes(userRole)
    );
  };

  const visibleItems = navigationItems.filter(shouldShowItem);

  return (
    <Card>
      <CardContent className="p-0">
        <nav className="space-y-1 p-2">
          {visibleItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                activeTab === item.id &&
                  "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="flex items-center space-x-2">
                  <item.icon
                    className={cn(
                      "h-4 w-4",
                      activeTab === item.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500"
                    )}
                  />
                  {item.hasIssues && (
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        activeTab === item.id
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-gray-900 dark:text-gray-100"
                      )}
                    >
                      {item.label}
                    </span>
                    {item.hasIssues && (
                      <Badge
                        variant="outline"
                        className="text-xs text-orange-600 border-orange-200"
                      >
                        Action needed
                      </Badge>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      activeTab === item.id
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </nav>

        {/* Profile completion summary */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              72%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              Profile Complete
            </p>
            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>3 verified</span>
              <span>•</span>
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span>2 pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
