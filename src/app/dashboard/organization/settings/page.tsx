"use client";
import React from "react";
import {
  Bell,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";


export default function Page() {
  const t = useTranslations("settings");

  const navigationItems = [
    {
      title: t("menu.notifications.title"),
      description: t("menu.notifications.description"),
      icon: Bell,
      url: "/dashboard/contractor/profile/notifications",
      type: "link",
    },
    {
      title: t("menu.privacySecurity.title"),
      description: t("menu.privacySecurity.description"),
      icon: Shield,
      url: "/dashboard/contractor/profile/security",
      type: "link",
    },
    {
      title: t("menu.privacyPolicy.title"),
      description: t("menu.privacyPolicy.description"),
      icon: FileText,
      url: "/dashboard/contractor/profile/privacy-policy",
      type: "link",
    },
    {
      title: t("menu.faq.title"),
      description: t("menu.faq.description"),
      icon: HelpCircle,
      url: "/dashboard/contractor/profile/faq",
      type: "link",
    },
    {
      title: t("menu.helpCenter.title"),
      description: t("menu.helpCenter.description"),
      icon: HelpCircle,
      url: "/dashboard/contractor/profile/help-center",
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
        <div className="flex items-center justify-center text-center p-6">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
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

