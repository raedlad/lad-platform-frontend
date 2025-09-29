"use client";
import React from "react";
import { roleNav } from "./navConfig";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useGlobalStore } from "@/shared/store/globalStore";
import { LucideIcon } from "lucide-react";

// Utility function to extract role from pathname
const getRoleFromPathname = (pathname: string): keyof typeof roleNav => {
  const pathSegments = pathname.split("/");
  const dashboardIndex = pathSegments.indexOf("dashboard");

  if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
    const role = pathSegments[dashboardIndex + 1];

    // Map URL segments to roleNav keys
    const roleMapping: Record<string, keyof typeof roleNav> = {
      individual: "individual",
      contractor: "contractor",
      supplier: "supplier",
      organization: "organization",
      engineering_office: "engineering_office",
      freelance_engineer: "freelance_engineer",
    };

    return roleMapping[role] || "individual"; // Default to individual if role not found
  }

  return "individual"; // Default fallback
};

const NavMain = () => {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  // Get the current role based on the pathname
  const currentRole = getRoleFromPathname(pathname);

  // Get the navigation items for the current role
  const navigationItems = roleNav[currentRole] || roleNav.individual;

  const renderIcon = (icon: LucideIcon) => {
    const IconComponent = icon;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <nav className="flex flex-col gap-1">
      {navigationItems.map((item) => {
        const isActive =
          item.url === `/dashboard/${currentRole}`
            ? pathname === item.url
            : pathname === item.url || pathname.startsWith(item.url + "/");
        return (
          <Link
            key={item.title}
            href={item.url}
            className={`p-3 flex items-center gap-3 transition-all duration-200 rounded-lg mx-2 ${
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-white hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => {
              // Close sidebar on mobile when navigating
              if (window.innerWidth < 1024) {
                const { setIsSidebarOpen } = useGlobalStore.getState();
                setIsSidebarOpen(false);
              }
            }}
          >
            <div className="flex-shrink-0">{renderIcon(item.icon)}</div>
            <div className="flex-1 min-w-0">
              <span
                className={twMerge(
                  "text-sm lg:text-base font-medium truncate",
                  isActive && "font-semibold"
                )}
              >
                {t(item.title)}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavMain;
