import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Function to get locale from client-side (for use in components)
export function getLocaleFromClient(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  // Try to get from cookie
  const savedLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="))
    ?.split("=")[1] as Locale;

  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale;
  }

  // Fallback to browser language
  const browserLang = navigator.language.substring(0, 2).toLowerCase();
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  return defaultLocale;
}

// Function to set locale cookie
export function setLocaleCookie(locale: Locale) {
  if (typeof window === "undefined") return;

  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

// Function to get text direction
export function getTextDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

// Next-intl configuration
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
