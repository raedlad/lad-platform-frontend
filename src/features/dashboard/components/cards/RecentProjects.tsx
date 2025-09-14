"use client";
import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/constants/assets";
import Image from "next/image";
import Link from "next/link";
import AllProjects from "./projects/allProjects";
import { useTranslations } from "next-intl";

const RecentProjects = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("all");
  const itemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const menuItems = [
      { id: "all", label: t("dashboard.individual.recentProjects.allProjects"), content: <AllProjects />},
    { id: "active", label: t("dashboard.individual.recentProjects.activeProjects"), content: <AllProjects />},
    { id: "completed", label: t("dashboard.individual.recentProjects.completedProjects"), content: <AllProjects />},
  ];

  // Whenever activeTab changes, scroll that tab into view
  useEffect(() => {
    const el = itemRefs.current[activeTab];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center", // keeps it centered horizontally
        block: "nearest",
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full flex flex-col gap-6 border border-[#AFAFAF] rounded-md p-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={assets.recent}
            alt="recent"
            className="w-6 h-6 lg:h-12 lg:w-12"
            width={20}
            height={20}
          />
          <h3 className="text-lg font-semibold">{t("dashboard.individual.recentProjects.title")}</h3>
        </div>
        <Link
          href="/dashboard/projects"
          className="text-design-main font-semibold"
        >
            <p>{t("dashboard.individual.recentProjects.viewAll")}</p>
        </Link>
      </div>

      {/* Scrollable Horizontal Menu */}
      <div className="w-full overflow-x-auto no-scrollbar  relative">
        <div className=" flex min-w-max gap-2 sm:gap-4 relative border-b-4 border-gray-200 justify-evenly">
          {menuItems.map((item) => ( 
            <button
              key={item.id}
              ref={(el) => {
                if (el) {
                  itemRefs.current[item.id] = el;
                }
              }}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-medium
                transition-all duration-200 ease-in-out whitespace-nowrap
                hover:text-design-main hover:bg-gray-50
                ${
                  activeTab === item.id
                    ? "text-design-main"
                    : "text-gray-600 hover:text-design-main"
                }
                after:absolute after:-bottom-1 after:z-10 after:left-0 after:right-0 after:h-1
                after:bg-design-main after:transition-all after:duration-200
                ${
                  activeTab === item.id
                    ? "after:scale-x-100"
                    : "after:scale-x-0"
                }
              `}
            >
              <span className="flex items-center gap-2">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {menuItems.find((item) => item.id === activeTab)?.content}
    </div>
  );
};

export default RecentProjects;
