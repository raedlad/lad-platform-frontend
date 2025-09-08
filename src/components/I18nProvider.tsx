"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import { getLocaleFromClient, getTextDirection } from "@/i18n";

interface I18nProviderProps {
  children: ReactNode;
}

// Custom event for locale changes
export const LOCALE_CHANGE_EVENT = "localeChange";

export default function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocale] = useState<string>("en");
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to update HTML attributes
  const updateHtmlAttributes = (newLocale: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
      document.documentElement.dir = getTextDirection(newLocale as any);
    }
  };

  // Function to load locale and messages
  const loadLocale = async (newLocale?: string) => {
    try {
      const currentLocale = newLocale || getLocaleFromClient();
      setLocale(currentLocale);

      // Update HTML attributes
      updateHtmlAttributes(currentLocale);

      // Dynamically import messages
      const messagesModule = await import(`@/messages/${currentLocale}.json`);
      setMessages(messagesModule.default);
    } catch (error) {
      console.error("Failed to load locale:", error);
      // Fallback to English
      const fallbackMessages = await import("@/messages/en.json");
      setMessages(fallbackMessages.default);
      setLocale("en");
      updateHtmlAttributes("en");
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for locale changes from other components
  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      const newLocale = event.detail.locale;
      if (newLocale && newLocale !== locale) {
        loadLocale(newLocale);
      }
    };

    // Add event listener
    window.addEventListener(
      LOCALE_CHANGE_EVENT,
      handleLocaleChange as EventListener
    );

    return () => {
      window.removeEventListener(
        LOCALE_CHANGE_EVENT,
        handleLocaleChange as EventListener
      );
    };
  }, [locale]);

  // Initial load
  useEffect(() => {
    loadLocale();
  }, []);

  if (isLoading || !messages) {
    return null;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
