"use client";

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
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Pause,
  X,
} from "lucide-react";

import { CalendarEvent, CalendarEventType } from "../../types";
import { cn } from "@/lib/utils";

interface CalendarWidgetProps {
  events: CalendarEvent[];
  maxItems?: number;
  className?: string;
  onEventClick?: (event: CalendarEvent) => void;
  onViewAll?: () => void;
}

function getEventTypeColor(type: CalendarEventType): string {
  switch (type) {
    case "project_deadline":
      return "bg-red-100 text-red-800 border-red-200";
    case "meeting":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "milestone":
      return "bg-green-100 text-green-800 border-green-200";
    case "offer_expiry":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "payment_due":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "site_visit":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getEventTypeDisplayName(type: CalendarEventType): string {
  const typeMap: Record<CalendarEventType, string> = {
    project_deadline: "Deadline",
    meeting: "Meeting",
    milestone: "Milestone",
    offer_expiry: "Offer Expiry",
    payment_due: "Payment Due",
    site_visit: "Site Visit",
  };

  return typeMap[type] || type;
}

function getStatusIcon(status: CalendarEvent["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "cancelled":
      return <X className="h-4 w-4 text-red-500" />;
    case "upcoming":
    default:
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
  }
}

function formatEventDate(dateString: string, includeTime = true): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow =
    date.toDateString() ===
    new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

  let dateStr = "";
  if (isToday) {
    dateStr = "Today";
  } else if (isTomorrow) {
    dateStr = "Tomorrow";
  } else {
    dateStr = date.toLocaleDateString("ar-SA", {
      month: "short",
      day: "numeric",
    });
  }

  if (includeTime) {
    const timeStr = date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} at ${timeStr}`;
  }

  return dateStr;
}

function isEventSoon(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  return diffInHours <= 24 && diffInHours > 0;
}

function EventItem({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}) {
  const typeColor = getEventTypeColor(event.type);
  const typeDisplay = getEventTypeDisplayName(event.type);
  const StatusIcon = getStatusIcon(event.status);
  const eventDate = formatEventDate(event.startDate);
  const isSoon = isEventSoon(event.startDate);

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer",
        "hover:bg-gray-50",
        isSoon &&
          event.status === "upcoming" &&
          "bg-orange-50 border-orange-200",
        event.status === "completed" && "bg-gray-50 opacity-75"
      )}
      onClick={() => onClick?.(event)}
    >
      <div className="flex-shrink-0 mt-0.5">{StatusIcon}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 line-clamp-1">
              {event.title}
            </p>
            {event.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {event.description}
              </p>
            )}
          </div>
          <Badge variant="outline" className={cn("text-xs ml-2", typeColor)}>
            {typeDisplay}
          </Badge>
        </div>

        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{eventDate}</span>
          </div>

          {isSoon && event.status === "upcoming" && (
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              Soon
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export function CalendarWidget({
  events,
  maxItems = 5,
  className,
  onEventClick,
  onViewAll,
}: CalendarWidgetProps) {
  const upcomingEvents = events
    .filter((event) => event.status === "upcoming")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const displayEvents = maxItems
    ? upcomingEvents.slice(0, maxItems)
    : upcomingEvents;
  const hasMore = upcomingEvents.length > maxItems;

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate).toDateString();
    const today = new Date().toDateString();
    return eventDate === today && event.status === "upcoming";
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg">Upcoming Events</CardTitle>
          {todayEvents.length > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {todayEvents.length} today
            </Badge>
          )}
        </div>

        {hasMore && onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-sm"
          >
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {displayEvents.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
