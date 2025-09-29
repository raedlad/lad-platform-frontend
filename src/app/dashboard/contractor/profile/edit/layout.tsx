"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  FileText,
  ChevronRight,
  FolderOpen,
  Building,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const EditProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("profile");
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      title: t("sidebar.personalInfo"),
      href: "/dashboard/contractor/profile/edit/personal-info",
      icon: User,
      description: "Personal information and profile details",
    },
    {
      title: t("sidebar.documents"),
      href: "/dashboard/contractor/profile/edit/documents",
      icon: FileText,
      description: "Documents and verification",
    },
    {
      title: t("sidebar.projects"),
      href: "/dashboard/contractor/profile/edit/projects",
      icon: FolderOpen,
      description: "Projects and project details",
    },
    {
      title: t("sidebar.operational"),
      href: "/dashboard/contractor/profile/edit/operational",
      icon: Building,
      description: "Operational and technical details",
    },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border-r border-border dark:border-n-6 lg:sticky lg:top-16 lg:self-start">
          <div className="p-4 lg:p-6">
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group",
                      active
                        ? "bg-design-main/10 text-design-main border border-design-main/20 shadow-sm"
                        : "text-n-7 dark:text-n-3 hover:bg-n-2 dark:hover:bg-n-7 hover:text-n-9 dark:hover:text-n-1"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={cn(
                          "w-5 h-5 transition-colors duration-300",
                          active
                            ? "text-design-main"
                            : "text-n-5 dark:text-n-4 group-hover:text-n-7 dark:group-hover:text-n-2"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm transition-colors duration-300",
                          active ? "font-semibold" : "font-medium"
                        )}
                      >
                        {item.title}
                      </span>
                    </div>
                    {active && (
                      <ChevronRight className="w-4 h-4 text-design-main rtl:rotate-180 transition-transform duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileLayout;
