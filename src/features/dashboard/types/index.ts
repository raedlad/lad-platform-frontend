// Re-export all types from individual modules
export * from "./dashboard";
export * from "./project";
export * from "./offer";
export * from "./notification";
export * from "./kpi";
export * from "./user";

// Additional type aliases for backward compatibility
export type {
  DashboardData,
  DashboardStore,
  QuickAction,
  Announcement,
  CalendarEvent,
  CalendarEventType,
} from "./dashboard";

export type { Project, ProjectStatus, ProjectCategory } from "./project";

export type { Offer, OfferStatus } from "./offer";

export type {
  Notification,
  NotificationType,
  NotificationPriority,
} from "./notification";

export type { KPI, KPIFormat, DashboardKPIs } from "./kpi";

export type { DashboardUser, UserRole } from "./user";
