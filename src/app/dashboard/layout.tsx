import { Metadata } from "next";
import { AppSidebar } from "@/components/dashboard/nav/AppSidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/dashboard/nav/SiteHeader";
import RequireAuth from "@/features/auth/components/RequireAuth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard and profile management",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <RequireAuth>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
