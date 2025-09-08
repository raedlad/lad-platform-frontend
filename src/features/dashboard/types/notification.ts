export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export type NotificationType =
  | "project_update"
  | "offer_received"
  | "offer_accepted"
  | "offer_rejected"
  | "payment_due"
  | "milestone_completed"
  | "message_received"
  | "system_update"
  | "profile_incomplete"
  | "verification_required";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  preferences: {
    projectUpdates: boolean;
    offerNotifications: boolean;
    paymentReminders: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
}
