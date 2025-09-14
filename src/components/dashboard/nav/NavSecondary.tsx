"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, Globe, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { currentLocale, changeLocale, locales } = useLocale();

  useEffect(() => setMounted(true), []);

  const isDark = (theme ?? resolvedTheme) === "dark";

  const getLocaleDisplayName = (locale: string) => {
    return locale === "en" ? "English" : "العربية";
  };

  const getLocaleFlag = (locale: string) => {
    return locale === "en" ? "🇺🇸" : "🇸🇦";
  };

  if (!mounted) {
    return null;
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {/* Language Toggle */}
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Globe className="h-4 w-4" />
                    <span className="ml-2">
                      {getLocaleDisplayName(currentLocale)}
                    </span>
                  </Button>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
                <div className="space-y-1">
                  {locales.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => changeLocale(locale)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                        locale === currentLocale
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getLocaleFlag(locale)}</span>
                        <span>{getLocaleDisplayName(locale)}</span>
                      </div>
                      {locale === currentLocale && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>

          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Help Navigation Link */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/help" || pathname.startsWith("/help/")}
            >
              <a href="/help">
                <HelpCircle className="h-4 w-4" />
                <span>Get Help</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
