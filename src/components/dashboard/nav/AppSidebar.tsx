"use client";
import NavUser from "./NavUser";
import NavMain from "./NavMain";
import { useGlobalStore } from "@/shared/store/globalStore";
import { useEffect } from "react";

export function AppSidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setIsSidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-72 sm:w-80 bg-design-secondary  dark:bg-gray-900 text-white dark:text-gray-100
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          flex flex-col shadow-xl dark:shadow-2xl lg:shadow-none
        `}
      >
        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 h-full overflow-y-auto">
          <NavUser />
          <div className="flex-1">
            <NavMain />
          </div>
        </div>
      </div>
    </>
  );
}
