"use client";
import React from "react";
import { Menu, Bell, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalStore } from "@/shared/store/globalStore";
import { assets } from "@/constants/assets";
import Image from "next/image";

const DashboardHeader = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Notifications and user menu */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center text-[10px] sm:text-xs">
              3
            </span>
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>

        {/* Center - Search input */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 start-2 ps-3 flex items-center pointer-events-none">
              <Search className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            </div>
            <Input
              type="text"
              placeholder="ابحث عن مشروعات، عروض، عقود..."
              className="ps-10 py-4 w-full transition-colors rounded-full shadow-md text-sm placeholder:text-design-tertiary dark:placeholder:text-gray-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        {/* Right side - Mobile menu button and logo */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile menu button */}

          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={assets.logo}
              alt="LAD Logo"
              width={120}
              height={40}
              className="h-8 sm:h-10 lg:h-12 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
