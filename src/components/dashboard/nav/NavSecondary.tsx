"use client";
import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useGlobalStore } from "@/shared/store/globalStore";
import { User, Settings } from "lucide-react";

// Utility function to extract role from pathname
const getRoleFromPathname = (pathname: string): string => {
  const pathSegments = pathname.split("/");
  const dashboardIndex = pathSegments.indexOf("dashboard");

  if (dashboardIndex !== -1 && pathSegments[dashboardIndex + 1]) {
    return pathSegments[dashboardIndex + 1];
  }

  return "individual"; // Default fallback
};

const NavSecondary = () => {
  const t = useTranslations("dashboard");
  const pathname = usePathname();

  const currentRole = getRoleFromPathname(pathname);
  const navigationItems = [
    {
      title: "navigation.profile",
      url: `/dashboard/${currentRole}/profile`,
      icon: User,
    },
    {
      title: "navigation.settings",
      url: `/dashboard/${currentRole}/settings`,
      icon: Settings,
    },
  ];

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
            <div className="flex-shrink-0">
              <item.icon className="h-6 w-6" />
            </div>
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

export default NavSecondary;
