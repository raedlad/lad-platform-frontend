"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/constants/assets";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useGlobalStore } from "@/shared/store/globalStore";

const NavUser = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalStore();

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={assets.user}
            alt="user"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-lg font-bold truncate">أحمد قاسم</p>
          <p className="text-white/70 text-sm truncate">ahmed@example.com</p>
        </div>
      </div>

      {/* Close button for mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-white hover:bg-white/10"
        onClick={() => setIsSidebarOpen(false)}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default NavUser;
