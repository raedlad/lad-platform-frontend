"use client";
import React from "react";
import AvatarUpload from "@/features/profile/components/common/AvatarUpload";
import {
  User,
  Bell,
  Shield,
  Globe,
  FileText,
  HelpCircle,
  LogOut,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Helper function to get user display name
const getUserDisplayName = (user: any) => {
  if (user?.full_name) return user.full_name;
  if (user?.firstName && user?.lastName)
    return `${user.firstName} ${user.lastName}`;
  if (user?.first_name && user?.last_name)
    return `${user.first_name} ${user.last_name}`;
  if (user?.name) return user.name;
  return "المستخدم";
};

// Helper function to get user phone
const getUserPhone = (user: any) => {
  return user?.phone || user?.phoneNumber || user?.phone_number || "";
};

// Progress bar component
const ProgressBar = ({ percentage }: { percentage: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
    <div
      className="bg-green-500 h-2 rounded-full transition-all duration-300"
      style={{ width: `${percentage}%` }}
    />
  </div>
);

export default function page() {
  const t = useTranslations("profile");
  const { user } = useAuthStore();

  // Navigation items with translations
  const navigationItems = [
    {
      title: t("menu.personalData.title"),
      description: t("menu.personalData.description"),
      icon: User,
      url: "/dashboard/individual/profile/personal-info",
      type: "link",
    },
    {
      title: t("menu.notifications.title"),
      description: t("menu.notifications.description"),
      icon: Bell,
      url: "/dashboard/individual/profile/notifications",
      type: "link",
    },
    {
      title: t("menu.privacySecurity.title"),
      description: t("menu.privacySecurity.description"),
      icon: Shield,
      url: "/dashboard/individual/profile/security",
      type: "link",
    },
    {
      title: t("menu.convertToDafin.title"),
      description: t("menu.convertToDafin.description"),
      icon: ArrowRight,
      url: "/dashboard/individual/profile/convert",
      type: "link",
    },
    {
      title: t("menu.privacyPolicy.title"),
      description: t("menu.privacyPolicy.description"),
      icon: FileText,
      url: "/dashboard/individual/profile/privacy-policy",
      type: "link",
    },
    {
      title: t("menu.faq.title"),
      description: t("menu.faq.description"),
      icon: HelpCircle,
      url: "/dashboard/individual/profile/faq",
      type: "link",
    },
    {
      title: t("menu.helpCenter.title"),
      description: t("menu.helpCenter.description"),
      icon: HelpCircle,
      url: "/dashboard/individual/profile/help-center",
      type: "link",
    },
    {
      title: t("menu.language.title"),
      description: t("menu.language.description"),
      type: "language-switcher",
    },
    {
      title: t("menu.theme.title"),
      description: t("menu.theme.description"),
      type: "theme-toggle",
    },
    {
      title: t("menu.logout.title"),
      description: t("menu.logout.description"),
      icon: LogOut,
      url: "/auth/logout",
      type: "link",
      isLogout: true,
    },
  ];

  return (
    <div className="w-full h-full py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto border border-border rounded-xl mt-20">
        {/* Profile Header Card */}
        <div className="relative">
          <div className="flex flex-col items-center text-center">
            {/* Avatar Section */}
            <div className="absolute inset-0 -top-16">
              <div className="mb-4 relative">
                <AvatarUpload />
              </div>
            </div>

            {/* User Info Section */}
            <div className="mt-20">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {getUserDisplayName(user)}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                {getUserPhone(user)}
              </p>

              {/* Progress Section */}
              <div className="mb-4">
                <ProgressBar percentage={85} />
                <p className="text-sm text-muted-foreground">
                  {t("completion.text", { percentage: 85 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          {navigationItems.map((item) => {
            const baseClasses = `group rounded-xl p-4 text-right hover:border-primary/50 hover:shadow-md transition-all duration-200 block ${
              item.isLogout ? "hover:border-red-500/50" : ""
            }`;

            // Render different components based on type
            if (item.type === "language-switcher") {
              return (
                <div key={item.title} className={baseClasses}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-">
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <div className="p-2 rounded-lg flex-shrink-0 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold text-base text-foreground">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-start">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              );
            }

            if (item.type === "theme-toggle") {
              return (
                <div key={item.title} className={baseClasses}>
                  <div className="flex items-center justify-between">
                    <div className="text-start">
                      <h3 className="font-semibold text-base text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <ThemeToggle />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Default link rendering
            return (
              <Link
                key={item.title}
                href={item.url || "#"}
                className={baseClasses}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          item.isLogout
                            ? "bg-red-100 group-hover:bg-red-200"
                            : "bg-primary/10 group-hover:bg-primary/20"
                        } transition-colors`}
                      >
                        {item.icon && (
                          <item.icon
                            className={`w-5 h-5 ${
                              item.isLogout ? "text-red-500" : "text-primary"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <h3
                        className={`font-semibold text-base ${
                          item.isLogout ? "text-red-500" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {!item.isLogout && (
                      <ArrowRight
                        className={`w-4 h-4 ${
                          item.isLogout
                            ? "text-red-400"
                            : "text-muted-foreground"
                        } transform rtl:rotate-180`}
                      />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
