import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import ThemeProvider from "@shared/components/ThemeProvider";
import I18nProvider from "../components/I18nProvider";
import { getServerLocale, getTextDirection } from "../lib/server-locale";

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
            <Header />
            {children}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
