"use client";
import React from "react";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalStore } from "@/shared/store/globalStore";
import { assets } from "@/constants/assets";
import Image from "next/image";

const DashboardHeader = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();

  return (
    <header className=" border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-30">
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
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center text-[10px] sm:text-xs">
              3
            </span>
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="icon">
            <Image src={assets.write} alt="user" width={16} height={16} />
          </Button>
        </div>

        {/* Center - Search input */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 start-2 ps-3 flex items-center pointer-events-none">
              <Image
                src={assets.search}
                alt="search"
                width={16}
                height={16}
                className="h-3 w-3 text-gray-400"
              />
            </div>
            <Input
              type="text"
              placeholder="ابحث عن مشروعات، عروض، عقود..."
              className="ps-10 py-4 w-full  transition-colors rounded-full shadow-md text-sm placeholder:text-design-tertiary"
            />
          </div>
        </div>
        {/* Right side - Mobile menu button and title */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile menu button */}

          {/* Page title */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
            LAD
          </h1>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
