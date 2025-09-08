"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  Menu,
  User,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  AlertTriangle,
  Languages,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardHeader() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data - replace with actual user data from store/API
  const user = {
    name: "Ahmed Al-Rashid",
    role: "Engineering Office",
    company: "Al-Rashid Engineering Consultants",
    email: "ahmed@alrashid-eng.com",
    phone: "+966 50 123 4567",
    profileCompletion: 72,
    avatar: "/avatars/user.jpg",
    isEmailVerified: true,
    isPhoneVerified: false,
    isDocumentVerified: true,
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
    router.push("/login");
  };

  const handleLanguageChange = (newLocale: string) => {
    // Implement language change logic
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const getVerificationStatus = () => {
    const verifications = [
      { type: "Email", verified: user.isEmailVerified },
      { type: "Phone", verified: user.isPhoneVerified },
      { type: "Documents", verified: user.isDocumentVerified },
    ];

    const verifiedCount = verifications.filter((v) => v.verified).length;
    const totalCount = verifications.length;

    if (verifiedCount === totalCount) {
      return {
        icon: CheckCircle,
        color: "text-green-500",
        text: "Fully Verified",
      };
    } else if (verifiedCount > 0) {
      return {
        icon: Clock,
        color: "text-orange-500",
        text: "Partially Verified",
      };
    } else {
      return {
        icon: AlertTriangle,
        color: "text-red-500",
        text: "Not Verified",
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo/Brand for mobile */}
        <div className="flex items-center lg:hidden">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
        </div>

        {/* Desktop title */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.title")}
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                {locale === "ar" ? "العربية" : "English"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleLanguageChange("en")}
                className={
                  locale === "en" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
              >
                <span className="mr-2">🇺🇸</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange("ar")}
                className={
                  locale === "ar" ? "bg-gray-100 dark:bg-gray-800" : ""
                }
              >
                <span className="mr-2">🇸🇦</span>
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              {/* User info header */}
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-3 p-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                        {user.company && (
                          <Badge variant="outline" className="text-xs">
                            {user.company}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>{user.email}</span>
                      {user.isEmailVerified ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{user.phone}</span>
                      {user.isPhoneVerified ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-orange-500" />
                      )}
                    </div>
                  </div>

                  {/* Profile completion */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">Profile Completion</span>
                      <span className="text-muted-foreground">
                        {user.profileCompletion}%
                      </span>
                    </div>
                    <Progress value={user.profileCompletion} className="h-1" />
                  </div>

                  {/* Verification status */}
                  <div className="flex items-center space-x-2">
                    <verificationStatus.icon
                      className={`w-4 h-4 ${verificationStatus.color}`}
                    />
                    <span
                      className={`text-xs font-medium ${verificationStatus.color}`}
                    >
                      {verificationStatus.text}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Menu items */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/profile?tab=settings"
                  className="cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
