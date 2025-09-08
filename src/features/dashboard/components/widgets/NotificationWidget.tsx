"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ExternalLink,
  AlertTriangle,
  Info,
  Clock,
  FileText,
  DollarSign,
  MessageCircle,
  Settings,
} from "lucide-react";

import { Notification, NotificationType } from "../../types";
import { cn } from "@/lib/utils";

interface NotificationWidgetProps {
  notifications: Notification[];
  maxItems?: number;
  className?: string;
  onMarkRead?: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

function getNotificationIcon(type: NotificationType) {
  const iconMap = {
    project_update: Clock,
    offer_received: FileText,
    offer_accepted: Check,
    offer_rejected: Check,
    payment_due: DollarSign,
    milestone_completed: CheckCheck,
    message_received: MessageCircle,
    system_update: Settings,
    profile_incomplete: Info,
    verification_required: AlertTriangle,
  };

  return iconMap[type] || Bell;
}

function getPriorityColor(priority: Notification["priority"]): string {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "low":
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

function NotificationItem({
  notification,
  onMarkRead,
  onClick,
}: {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
}) {
  const IconComponent = getNotificationIcon(notification.type);
  const priorityColor = getPriorityColor(notification.priority);
  const timeAgo = formatTimeAgo(notification.createdAt);

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer",
        notification.isRead
          ? "hover:bg-gray-50"
          : "bg-blue-50 hover:bg-blue-100 border border-blue-200"
      )}
      onClick={() => onClick?.(notification)}
    >
      <div
        className={cn(
          "flex-shrink-0 p-1 rounded-full",
          notification.isRead ? "bg-gray-100" : "bg-blue-100"
        )}
      >
        <IconComponent
          className={cn(
            "h-4 w-4",
            notification.isRead ? "text-gray-500" : "text-blue-600"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p
              className={cn(
                "text-sm",
                notification.isRead
                  ? "text-gray-700"
                  : "text-gray-900 font-medium"
              )}
            >
              {notification.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              {notification.priority !== "low" && (
                <Badge
                  variant="outline"
                  className={cn("text-xs", priorityColor)}
                >
                  {notification.priority}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-2">
            {!notification.isRead && onMarkRead && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkRead(notification.id);
                }}
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            {notification.actionUrl && (
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationWidget({
  notifications,
  maxItems = 5,
  className,
  onMarkRead,
  onMarkAllRead,
  onNotificationClick,
}: NotificationWidgetProps) {
  const [showAll, setShowAll] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const displayNotifications = showAll
    ? notifications
    : notifications.slice(0, maxItems);

  const unreadCount = unreadNotifications.length;
  const hasMore = notifications.length > maxItems;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-1">
          {unreadCount > 0 && onMarkAllRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {displayNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={onMarkRead}
                    onClick={onNotificationClick}
                  />
                ))}
              </div>
            </ScrollArea>

            {hasMore && !showAll && (
              <div className="pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-sm"
                  onClick={() => setShowAll(true)}
                >
                  Show {notifications.length - maxItems} more notifications
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
