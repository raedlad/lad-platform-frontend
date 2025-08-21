import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import ThemeProvider from "@shared/components/ThemeProvider";

export const metadata: Metadata = {
  title: "LAD",
  description: "Just LAD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
