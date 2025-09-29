import { Metadata } from "next";
import { AppSidebar } from "@/components/dashboard/nav/AppSidebar";
import RequireAuth from "@/features/auth/components/RequireAuth";
import DashboardHeader from "@/components/dashboard/nav/DashboardHeader";

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
      <div className="flex h-screen overflow-hidden relative">
        {/* Sidebar - Handles both desktop and mobile */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Header */}
          <DashboardHeader />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
