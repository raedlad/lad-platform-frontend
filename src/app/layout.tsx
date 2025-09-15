import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@shared/components/ThemeProvider";
import AuthProvider from "@/features/auth/provider/AuthProvider";
import I18nProvider from "@/components/I18nProvider";
import DirectionProvider from "@shared/components/DirectionProvider";
import { getServerLocale, getTextDirection } from "@/lib/server-locale";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "LAD",
  description: "Just LAD",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const dir = getTextDirection(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        <I18nProvider>
          <ThemeProvider>
            <DirectionProvider>
              <AuthProvider>{children}</AuthProvider>
            </DirectionProvider>
          </ThemeProvider>
        </I18nProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
