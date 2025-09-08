import {
  DashboardStore,
  DashboardUser,
  KPI,
  Project,
  Offer,
  Notification,
  Announcement,
  CalendarEvent,
} from "../types";

// Simple stable selector functions
const getActiveProjectsSelector = (state: DashboardStore): Project[] => {
  return (
    state.dashboardData?.recentProjects.filter(
      (project: Project) => project.status === "in_progress"
    ) || []
  );
};

const getPendingOffersSelector = (state: DashboardStore): Offer[] => {
  return (
    state.dashboardData?.recentOffers.filter(
      (offer: Offer) => offer.status === "pending"
    ) || []
  );
};

const getUnreadNotificationsSelector = (
  state: DashboardStore
): Notification[] => {
  return (
    state.dashboardData?.notifications.filter(
      (notification: Notification) => !notification.isRead
    ) || []
  );
};

const getUnreadCountSelector = (state: DashboardStore): number => {
  return (
    state.dashboardData?.notifications.filter(
      (notification: Notification) => !notification.isRead
    ).length || 0
  );
};

const getHighPriorityNotificationsSelector = (
  state: DashboardStore
): Notification[] => {
  return (
    state.dashboardData?.notifications.filter(
      (notification: Notification) =>
        notification.priority === "high" || notification.priority === "urgent"
    ) || []
  );
};

const getEnabledQuickActionsSelector = (state: DashboardStore): any[] => {
  return (
    state.dashboardData?.quickActions.filter(
      (action: any) => action.isEnabled
    ) || []
  );
};

const getActiveAnnouncementsSelector = (
  state: DashboardStore
): Announcement[] => {
  return (
    state.dashboardData?.announcements.filter(
      (announcement: Announcement) => announcement.isActive
    ) || []
  );
};

const getUpcomingEventsSelector = (state: DashboardStore): CalendarEvent[] => {
  return (
    state.dashboardData?.calendar.filter(
      (event: CalendarEvent) => event.status === "upcoming"
    ) || []
  );
};

const getTodayEventsSelector = (state: DashboardStore): CalendarEvent[] => {
  const today = new Date().toISOString().split("T")[0];
  return (
    state.dashboardData?.calendar.filter((event: CalendarEvent) =>
      event.startDate.startsWith(today)
    ) || []
  );
};

const getNeedsRefreshSelector = (state: DashboardStore): boolean => {
  if (!state.lastUpdated) return true;

  const lastUpdate = new Date(state.lastUpdated);
  const now = new Date();
  const timeDifference = now.getTime() - lastUpdate.getTime();
  const fiveMinutes = 5 * 60 * 1000;

  return timeDifference > fiveMinutes;
};

// Selectors for derived state and performance optimization
export const dashboardSelectors = {
  // User selectors
  getCurrentUser: (state: DashboardStore) => state.dashboardData?.user,

  getUserRole: (state: DashboardStore): string | null =>
    state.dashboardData?.user?.role || null,

  isProfileComplete: (state: DashboardStore): boolean => {
    const user = state.dashboardData?.user;
    return user ? user.isVerified : false;
  },

  // KPI selectors
  getKPIs: (state: DashboardStore) => state.dashboardData?.kpis || [],

  getKPIById: (state: DashboardStore, id: string) =>
    state.dashboardData?.kpis.find((kpi: KPI) => kpi.id === id),

  // Project selectors
  getRecentProjects: (state: DashboardStore) =>
    state.dashboardData?.recentProjects || [],

  getActiveProjects: getActiveProjectsSelector,

  // Offer selectors
  getRecentOffers: (state: DashboardStore) =>
    state.dashboardData?.recentOffers || [],

  getPendingOffers: getPendingOffersSelector,

  // Notification selectors
  getAllNotifications: (state: DashboardStore) =>
    state.dashboardData?.notifications || [],

  getUnreadNotifications: getUnreadNotificationsSelector,

  getUnreadCount: getUnreadCountSelector,

  getHighPriorityNotifications: getHighPriorityNotificationsSelector,

  // Quick actions selectors
  getQuickActions: (state: DashboardStore) =>
    state.dashboardData?.quickActions || [],

  getEnabledQuickActions: getEnabledQuickActionsSelector,

  // Announcement selectors
  getActiveAnnouncements: getActiveAnnouncementsSelector,

  getAnnouncementsByRole: (state: DashboardStore, role: string) =>
    state.dashboardData?.announcements.filter(
      (announcement: Announcement) =>
        announcement.isActive &&
        (!announcement.targetRoles || announcement.targetRoles.includes(role))
    ) || [],

  // Calendar selectors
  getUpcomingEvents: getUpcomingEventsSelector,

  getTodayEvents: getTodayEventsSelector,

  // Loading and error selectors
  isLoading: (state: DashboardStore) => state.isLoading,

  getError: (state: DashboardStore) => state.error,

  getLastUpdated: (state: DashboardStore) => state.lastUpdated,

  // Utility selectors
  hasData: (state: DashboardStore): boolean => !!state.dashboardData,

  needsRefresh: getNeedsRefreshSelector,
};
