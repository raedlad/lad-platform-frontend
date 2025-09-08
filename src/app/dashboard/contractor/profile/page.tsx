"use client";

import React from "react";
import AvatarUpload from "@/features/profile/components/common/AvatarUpload";
import { User, FileText, Shield, Settings, Briefcase } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";

const navigationItems = [
  {
    title: "Personal Info",
    description: "Update your basic information and contact details",
    icon: User,
    url: `/dashboard/contractor/profile/personal-info`,
  },
  {
    title: "Documents & Verification",
    description: "Manage your documents and verification status",
    icon: FileText,
    url: `/dashboard/contractor/profile/documents`,
  },
  {
    title: "Operational & Technical Details",
    description: "Manage your operational and technical details",
    icon: Briefcase,
    url: `/dashboard/contractor/profile/operational`,
  },
  {
    title: "Security",
    description: "Password, 2FA, and security preferences",
    icon: Shield,
    url: `/dashboard/contractor/profile/security`,
  },
  {
    title: "Settings",
    description: "Account preferences and notification settings",
    icon: Settings,
    url: `/dashboard/contractor/profile/settings`,
  },
];

export default function page() {
  const { user } = useAuthStore();
  console.log(user);
  const userData = {
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
  };
  return (
    <div className="w-full h-full py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-muted/30 rounded-xl border border-border shadow-sm p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <AvatarUpload />
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                  {userData.name}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                  {userData.email}
                </p>
              </div>

              {/* Profile Stats */}
              {/* <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">85%</div>
                  <div className="text-sm text-muted-foreground">
                    Profile Complete
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">12</div>
                  <div className="text-sm text-muted-foreground">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <div className="text-sm text-muted-foreground">
                    Verifications
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="group bg-muted/30 border border-border rounded-xl p-3 sm:p-4  text-left hover:border-primary/50 hover:shadow-md transition-all duration-200 hover:-translate-y-1 block"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
