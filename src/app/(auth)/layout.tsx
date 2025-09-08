import type { Metadata } from "next";
import Header from "@/components/Header";
import PublicOnly from "@/features/auth/components/PublicOnly";

export const metadata: Metadata = {
  title: "LAD",
  description: "Just LAD",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div suppressHydrationWarning>
      <Header />
      <PublicOnly>
        <main className="min-h-screen pt-24 flex items-center justify-center">
          {children}
        </main>
      </PublicOnly>
    </div>
  );
}
