"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, Settings } from "lucide-react";

import { useDashboardData } from "../hooks";
import {
  WelcomeCard,
  KPICard,
  NotificationWidget,
  QuickActionsWidget,
  CalendarWidget,
  ContractorSection,
} from "../components";
import { isProfileComplete, getProfileCompletionTasks } from "../utils";
import { cn } from "@/lib/utils";
import { DashboardUser } from "../types";
import ProfileCompletionAlert from "@/features/profile/components/ProfileCompletionAlert";

function ProfileCompletionBanner({
  user,
  onComplete,
}: {
  user: DashboardUser;
  onComplete: () => void;
}) {
  const tasks = getProfileCompletionTasks(user);
  const completionPercentage = Math.round(((5 - tasks.length) / 5) * 100);

  if (tasks.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 mb-6 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 truncate">
                Complete Your Profile
              </h3>
              <Badge
                variant="outline"
                className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 flex-shrink-0"
              >
                {completionPercentage}% Complete
              </Badge>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
              Complete your profile to unlock all platform features and improve
              your visibility.
            </p>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
              {tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0" />
                  <span className="leading-relaxed">{task}</span>
                </li>
              ))}
              {tasks.length > 3 && (
                <li className="text-blue-500 dark:text-blue-400 text-xs italic">
                  +{tasks.length - 3} more tasks
                </li>
              )}
            </ul>
          </div>
          <Button
            size="sm"
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm transition-all duration-200 flex-shrink-0"
          >
            <Settings className="h-4 w-4 mr-2" />
            Complete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
  onClearError,
}: {
  error: string;
  onRetry: () => void;
  onClearError: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
      <Card className="max-w-md mx-auto shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-900 dark:text-red-100">
            Failed to Load Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearError}
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Dismiss
            </Button>
            <Button
              size="sm"
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ContractorDashboardPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    dashboardData,
    currentUser,
    userRole,
    kpis,
    unreadNotifications,
    unreadCount,
    quickActions,
    upcomingEvents,
    activeAnnouncements,
    isLoading,
    error,
    refreshData,
    clearError,
  } = useDashboardData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCompleteProfile = () => {
    router.push("/dashboard/contractor/profile");
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const handleQuickActionClick = (action: any) => {
    if (action.isEnabled && action.url) {
      router.push(action.url);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Loading state
  if (isLoading && !dashboardData) {
    return <LoadingState />;
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <ErrorState
        error={error}
        onRetry={handleRefresh}
        onClearError={clearError}
      />
    );
  }

  // No user state
  if (!currentUser || !userRole) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Account Setup Required
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Please complete your account setup to access the dashboard.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
              Contractor Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {currentUser?.name || "Contractor"}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {error && (
              <Badge
                variant="outline"
                className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Error occurred
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </Button>
          </div>
        </div>

        {/* Profile Completion Alert */}
        <ProfileCompletionAlert />

        {/* Active Announcements */}
        {activeAnnouncements.length > 0 && (
          <div className="space-y-3">
            {activeAnnouncements.slice(0, 2).map((announcement: any) => (
              <Card
                key={announcement.id}
                className={cn(
                  "border-l-4 shadow-sm transition-all duration-200 hover:shadow-md",
                  announcement.type === "warning" &&
                    "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 dark:border-l-yellow-400",
                  announcement.type === "info" &&
                    "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-l-blue-400",
                  announcement.type === "error" &&
                    "border-l-red-500 bg-red-50 dark:bg-red-950/20 dark:border-l-red-400",
                  announcement.type === "success" &&
                    "border-l-green-500 bg-green-50 dark:bg-green-950/20 dark:border-l-green-400"
                )}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="flex-shrink-0 dark:border-gray-600 dark:text-gray-300"
                    >
                      {announcement.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Welcome Section */}
        {currentUser && <WelcomeCard user={currentUser as DashboardUser} />}

        {/* KPI Cards */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {kpis.map((kpi: any) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Contractor-specific Main Content */}
          <div className="xl:col-span-3 space-y-6">
            <ContractorSection
              availableProjects={dashboardData?.recentProjects || []}
              myOffers={dashboardData?.recentOffers || []}
              ongoingProjects={
                dashboardData?.recentProjects?.filter(
                  (p: any) => p.status === "in_progress"
                ) || []
              }
              reputation={4.8}
              onBrowseProjects={() =>
                handleNavigation("/dashboard/contractor/projects/browse")
              }
              onViewOffers={() =>
                handleNavigation("/dashboard/contractor/offers")
              }
              onViewProject={(id) =>
                handleNavigation(`/dashboard/contractor/projects/${id}`)
              }
            />
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            {quickActions.length > 0 && (
              <QuickActionsWidget
                actions={quickActions}
                onActionClick={handleQuickActionClick}
              />
            )}

            {/* Notifications */}
            <NotificationWidget
              notifications={unreadNotifications}
              maxItems={5}
              onNotificationClick={handleNotificationClick}
              onMarkRead={(id) => console.log("Mark read:", id)}
              onMarkAllRead={() => console.log("Mark all read")}
            />

            {/* Calendar */}
            {upcomingEvents.length > 0 && (
              <CalendarWidget
                events={upcomingEvents}
                maxItems={5}
                onEventClick={(event) => console.log("Event clicked:", event)}
                onViewAll={() => router.push("/dashboard/contractor/calendar")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
