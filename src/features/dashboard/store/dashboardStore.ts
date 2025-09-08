import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  DashboardData,
  DashboardStore,
  KPI,
  QuickAction,
  CalendarEvent,
  Notification,
} from "../types";
import { dashboardService } from "../services";

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set, get) => ({
      // State
      dashboardData: null,
      isLoading: false,
      error: null,
      lastUpdated: null,

      // Actions
      fetchDashboardData: async () => {
        set({ isLoading: true, error: null });

        try {
          const data = await dashboardService.getDashboardData();
          set({
            dashboardData: data,
            isLoading: false,
            lastUpdated: new Date().toISOString(),
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to fetch dashboard data";
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      updateKPI: (id: string, kpi: Partial<KPI>) => {
        const { dashboardData } = get();
        if (!dashboardData) return;

        const updatedKPIs = dashboardData.kpis.map((item: KPI) =>
          item.id === id ? { ...item, ...kpi } : item
        );

        set({
          dashboardData: {
            ...dashboardData,
            kpis: updatedKPIs,
          },
        });
      },

      markNotificationRead: (notificationId: string) => {
        const { dashboardData } = get();
        if (!dashboardData) return;

        const updatedNotifications = dashboardData.notifications.map(
          (notification: Notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : notification
        );

        set({
          dashboardData: {
            ...dashboardData,
            notifications: updatedNotifications,
          },
        });
      },

      markAllNotificationsRead: () => {
        const { dashboardData } = get();
        if (!dashboardData) return;

        const updatedNotifications = dashboardData.notifications.map(
          (notification: Notification) => ({
            ...notification,
            isRead: true,
            readAt: new Date().toISOString(),
          })
        );

        set({
          dashboardData: {
            ...dashboardData,
            notifications: updatedNotifications,
          },
        });
      },

      dismissAnnouncement: (announcementId: string) => {
        const { dashboardData } = get();
        if (!dashboardData) return;

        const updatedAnnouncements = dashboardData.announcements.filter(
          (announcement: any) => announcement.id !== announcementId
        );

        set({
          dashboardData: {
            ...dashboardData,
            announcements: updatedAnnouncements,
          },
        });
      },

      refreshData: async () => {
        await get().fetchDashboardData();
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "dashboard-store",
    }
  )
);
