"use client";
import React from "react";
import { roleNav } from "./navConfig";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useGlobalStore } from "@/shared/store/globalStore";

const NavMain = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const renderIcon = (icon: any) => {
    // Check if it's a React component (Lucide icons)
    if (typeof icon === "function" || (icon && icon.$$typeof)) {
      const IconComponent = icon;
      return <IconComponent className="h-6 w-6" />;
    }

    // Check if it's an SVG asset object
    if (icon && typeof icon === "object" && icon.src) {
      return (
        <Image
          src={icon.src}
          alt="icon"
          width={16}
          height={16}
          className=" h-6 w-6"
        />
      );
    }

    // Fallback for other cases
    return null;
  };

  return (
    <nav className="flex flex-col gap-1">
      {roleNav.individual.map((item) => {
        const isActive =
          item.url === "/dashboard/individual"
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
