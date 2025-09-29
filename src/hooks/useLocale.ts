"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  locales,
  type Locale,
  getLocaleFromClient,
  setLocaleCookie,
} from "@/i18n";
import { LOCALE_CHANGE_EVENT } from "@/components/I18nProvider";

export function useLocale() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>("ar");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const locale = getLocaleFromClient();
    setCurrentLocale(locale);
    setIsLoading(false);
  }, []);

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === currentLocale) return;

      // Set the cookie
      setLocaleCookie(newLocale);

      // Update local state
      setCurrentLocale(newLocale);

      // Dispatch custom event to notify I18nProvider
      const event = new CustomEvent(LOCALE_CHANGE_EVENT, {
        detail: { locale: newLocale },
      });
      window.dispatchEvent(event);

      // No need to refresh the page anymore - I18nProvider will handle the change
    },
    [currentLocale]
  );

  const isRTL = currentLocale === "ar";

  return {
    currentLocale,
    changeLocale,
    isRTL,
    isLoading,
    locales,
  };
}
