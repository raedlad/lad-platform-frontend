import { cookies, headers } from "next/headers";
import { locales, type Locale, defaultLocale } from "@/i18n";

// Function to get locale from cookie, browser language, or default (SERVER-SIDE ONLY)
export async function getServerLocale(): Promise<Locale> {
  try {
    // Try to get from cookies first
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;

    if (savedLocale && locales.includes(savedLocale)) {
      return savedLocale;
    }

    // Fallback to browser language
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
      // Parse Accept-Language header and find first supported locale
      const languages = acceptLanguage
        .split(",")
        .map((lang: string) =>
          lang.split(";")[0].trim().substring(0, 2).toLowerCase()
        );

      for (const lang of languages) {
        if (locales.includes(lang as Locale)) {
          return lang as Locale;
        }
      }
    }

    // Default fallback
    return defaultLocale;
  } catch {
    // If we're not in a server context, return default
    return defaultLocale;
  }
}

// Function to get text direction
export function getTextDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
