import { DashboardUser } from "./user";
import { Project } from "./project";
import { Offer } from "./offer";
import { Notification } from "./notification";
import { KPI } from "./kpi";

export interface DashboardData {
  user: DashboardUser;
  kpis: KPI[];
  recentProjects: Project[];
  recentOffers: Offer[];
  notifications: Notification[];
  quickActions: QuickAction[];
  announcements: Announcement[];
  calendar: CalendarEvent[];
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  url: string;
  color?: string;
  isEnabled: boolean;
  requiresVerification?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  priority: "low" | "medium" | "high";
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  targetRoles?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: CalendarEventType;
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  relatedEntityId?: string;
  relatedEntityType?: "project" | "offer" | "meeting" | "deadline";
}

export type CalendarEventType =
  | "project_deadline"
  | "meeting"
  | "milestone"
  | "offer_expiry"
  | "payment_due"
  | "site_visit";

export interface DashboardStore {
  // State
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  updateKPI: (id: string, kpi: Partial<KPI>) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  dismissAnnouncement: (announcementId: string) => void;
  refreshData: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}
