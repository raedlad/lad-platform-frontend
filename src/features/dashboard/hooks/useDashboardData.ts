"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useDashboardStore } from "../store";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  Project,
  Offer,
  Notification,
  Announcement,
  CalendarEvent,
} from "../types";

export function useDashboardData() {
  const router = useRouter();

  // Use specific selectors to avoid unnecessary re-renders
  const authUser = useAuthStore((state) => state.user);
  const dashboardData = useDashboardStore((state) => state.dashboardData);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const error = useDashboardStore((state) => state.error);
  const fetchDashboardData = useDashboardStore(
    (state) => state.fetchDashboardData
  );
  const refreshData = useDashboardStore((state) => state.refreshData);
  const clearError = useDashboardStore((state) => state.clearError);

  // Derive data using useMemo to prevent infinite re-renders
  const currentUser = useMemo(() => dashboardData?.user, [dashboardData?.user]);

  const userRole = useMemo(
    () => dashboardData?.user?.role || null,
    [dashboardData?.user?.role]
  );

  const kpis = useMemo(() => dashboardData?.kpis || [], [dashboardData?.kpis]);

  const recentProjects = useMemo(
    () => dashboardData?.recentProjects || [],
    [dashboardData?.recentProjects]
  );

  const activeProjects = useMemo(
    () =>
      dashboardData?.recentProjects?.filter(
        (project: Project) => project.status === "in_progress"
      ) || [],
    [dashboardData?.recentProjects]
  );

  const recentOffers = useMemo(
    () => dashboardData?.recentOffers || [],
    [dashboardData?.recentOffers]
  );

  const pendingOffers = useMemo(
    () =>
      dashboardData?.recentOffers?.filter(
        (offer: Offer) => offer.status === "pending"
      ) || [],
    [dashboardData?.recentOffers]
  );

  const unreadNotifications = useMemo(
    () =>
      dashboardData?.notifications?.filter(
        (notification: Notification) => !notification.isRead
      ) || [],
    [dashboardData?.notifications]
  );

  const unreadCount = useMemo(
    () =>
      dashboardData?.notifications?.filter(
        (notification: Notification) => !notification.isRead
      ).length || 0,
    [dashboardData?.notifications]
  );

  const quickActions = useMemo(
    () =>
      dashboardData?.quickActions?.filter((action: any) => action.isEnabled) ||
      [],
    [dashboardData?.quickActions]
  );

  const upcomingEvents = useMemo(
    () =>
      dashboardData?.calendar?.filter(
        (event: CalendarEvent) => event.status === "upcoming"
      ) || [],
    [dashboardData?.calendar]
  );

  const todayEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return (
      dashboardData?.calendar?.filter((event: CalendarEvent) =>
        event.startDate.startsWith(today)
      ) || []
    );
  }, [dashboardData?.calendar]);

  const activeAnnouncements = useMemo(
    () =>
      dashboardData?.announcements?.filter(
        (announcement: Announcement) => announcement.isActive
      ) || [],
    [dashboardData?.announcements]
  );

  // Initialize dashboard data
  useEffect(() => {
    if (!authUser) {
      router.push("/login");
      return;
    }

    if (!dashboardData) {
      fetchDashboardData().catch(console.error);
    }
  }, [authUser, dashboardData, fetchDashboardData, router]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && dashboardData) {
        refreshData().catch(console.error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [isLoading, dashboardData, refreshData]);

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    }
  };

  const handleClearError = () => {
    clearError();
  };

  return {
    // Data
    dashboardData,
    currentUser: currentUser || authUser,
    userRole: userRole || authUser?.role,
    kpis,
    recentProjects,
    activeProjects,
    recentOffers,
    pendingOffers,
    unreadNotifications,
    unreadCount,
    quickActions,
    upcomingEvents,
    todayEvents,
    activeAnnouncements,

    // State
    isLoading,
    error,

    // Actions
    refreshData: handleRefresh,
    clearError: handleClearError,
  };
}
