"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const t = useTranslations("common");
  const { currentLocale, changeLocale, locales } = useLocale();

  const getLocaleDisplayName = (locale: string) => {
    return locale === "en" ? "English" : "العربية";
  };

  const getLocaleFlag = (locale: string) => {
    return locale === "en" ? "🇺🇸" : "🇸🇦";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-2"
          aria-label={t("changeLanguage")}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {getLocaleDisplayName(currentLocale)}
          </span>
          <span className="sm:hidden">{getLocaleFlag(currentLocale)}</span>
        </Button>
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
              {locale === currentLocale && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
