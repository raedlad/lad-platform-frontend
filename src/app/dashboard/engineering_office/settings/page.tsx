"use client";
import React, { useState, useRef } from "react";
import {
  Bell,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/features/auth/store/authStore";
import { authApi } from "@/features/auth/services/authApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Page() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { logout: logoutFromStore } = useAuthStore();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoggingOut(true);
    try {
      const result = await authApi.logout();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (result.success) {
        setIsDialogOpen(false);
        router.push("/login");
      } else {
        logoutFromStore();
        setIsDialogOpen(false);
        router.push("/login");
      }
    } catch (error) {
      logoutFromStore();
      setIsDialogOpen(false);
      router.push("/login");
    }
  };

  const navigationItems = [
    {
      title: t("menu.notifications.title"),
      description: t("menu.notifications.description"),
      icon: Bell,
      url: "/dashboard/engineering_office/profile/notifications",
      type: "link",
    },
    {
      title: t("menu.privacySecurity.title"),
      description: t("menu.privacySecurity.description"),
      icon: Shield,
      url: "/dashboard/engineering_office/profile/security",
      type: "link",
    },
    {
      title: t("menu.privacyPolicy.title"),
      description: t("menu.privacyPolicy.description"),
      icon: FileText,
      url: "/dashboard/engineering_office/profile/privacy-policy",
      type: "link",
    },
    {
      title: t("menu.faq.title"),
      description: t("menu.faq.description"),
      icon: HelpCircle,
      url: "/dashboard/engineering_office/profile/faq",
      type: "link",
    },
    {
      title: t("menu.helpCenter.title"),
      description: t("menu.helpCenter.description"),
      icon: HelpCircle,
      url: "/dashboard/engineering_office/profile/help-center",
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
      type: "logout",
      isLogout: true,
    },
  ];

  return (
    <TooltipProvider>
      <div className="w-full h-full py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto border border-border rounded-xl mt-20">
          <div className="flex items-center justify-center text-center p-6">
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          </div>
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const baseClasses = `group rounded-xl p-4 text-right hover:border-primary/50 hover:shadow-md transition-all duration-200 block ${
                item.isLogout ? "hover:border-red-500/50" : ""
              }`;
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

              if (item.type === "logout") {
                return (
                  <AlertDialog
                    key={item.title}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <button
                        className={baseClasses}
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg flex-shrink-0 bg-red-100 group-hover:bg-red-200 transition-colors">
                            {item.icon && (
                              <item.icon className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div className="text-right">
                            <h3 className="font-semibold text-base text-red-500">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("menu.logout.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("menu.logout.description")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isLoggingOut}
                          onClick={() => setIsDialogOpen(false)}
                        >
                          {tCommon("actions.cancel")}
                        </AlertDialogCancel>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="bg-red-500 hover:bg-red-600 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
                        >
                          {isLoggingOut ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {tCommon("actions.loading")}
                            </>
                          ) : (
                            t("menu.logout.title")
                          )}
                        </button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              }

              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className={`${baseClasses} cursor-not-allowed opacity-60`}
                      onClick={(e) => e.preventDefault()}
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
                                    item.isLogout
                                      ? "text-red-500"
                                      : "text-primary"
                                  }`}
                                />
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <h3
                              className={`font-semibold text-base ${
                                item.isLogout
                                  ? "text-red-500"
                                  : "text-foreground"
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tCommon("ui.comingSoon")}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
