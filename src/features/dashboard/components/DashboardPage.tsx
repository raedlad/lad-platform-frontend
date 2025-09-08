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
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
  HelpCircle,
} from "lucide-react";

import { useDashboardData } from "../hooks";
import {
  WelcomeCard,
  KPICard,
  NotificationWidget,
  QuickActionsWidget,
  CalendarWidget,
  IndividualSection,
  ContractorSection,
  SupplierSection,
  EngineeringOfficeSection,
} from "../components";
import { isProfileComplete, getProfileCompletionTasks } from "../utils";
import { cn } from "@/lib/utils";

function ProfileCompletionBanner({
  user,
  onComplete,
}: {
  user: any;
  onComplete: () => void;
}) {
  const tasks = getProfileCompletionTasks(user);
  const completionPercentage = Math.round(((5 - tasks.length) / 5) * 100);

  if (tasks.length === 0) return null;

  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">
                Complete Your Profile
              </h3>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-300"
              >
                {completionPercentage}% Complete
              </Badge>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Complete your profile to unlock all platform features and improve
              your visibility.
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              {tasks.slice(0, 3).map((task, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                  <span>{task}</span>
                </li>
              ))}
              {tasks.length > 3 && (
                <li className="text-blue-500">
                  +{tasks.length - 3} more tasks
                </li>
              )}
            </ul>
          </div>
          <Button
            size="sm"
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Complete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="bg-white rounded-lg p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        </div>

        {/* KPI cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
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
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">
            Failed to Load Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-red-700">{error}</p>
          <div className="flex space-x-2 justify-center">
            <Button variant="outline" size="sm" onClick={onClearError}>
              Dismiss
            </Button>
            <Button size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleBasedContent({
  userRole,
  dashboardData,
}: {
  userRole: string;
  dashboardData: any;
}) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  switch (userRole) {
    case "individual":
      return (
        <IndividualSection
          projects={dashboardData?.recentProjects || []}
          offers={dashboardData?.recentOffers || []}
          onCreateProject={() => handleNavigation("/dashboard/projects/new")}
          onViewProject={(id) => handleNavigation(`/dashboard/projects/${id}`)}
          onViewOffer={(id) => handleNavigation(`/dashboard/offers/${id}`)}
        />
      );

    case "contractor":
      return (
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
            handleNavigation("/dashboard/projects/browse")
          }
          onViewOffers={() => handleNavigation("/dashboard/offers")}
          onViewProject={(id) => handleNavigation(`/dashboard/projects/${id}`)}
        />
      );

    case "supplier":
      return (
        <SupplierSection
          onAddProduct={() => handleNavigation("/dashboard/products/new")}
          onViewProduct={(id) => handleNavigation(`/dashboard/products/${id}`)}
          onViewOrder={(id) => handleNavigation(`/dashboard/orders/${id}`)}
          onViewAllProducts={() => handleNavigation("/dashboard/products")}
          onViewAllOrders={() => handleNavigation("/dashboard/orders")}
        />
      );

    case "engineering_office":
      return (
        <EngineeringOfficeSection
          onViewProject={(id) => handleNavigation(`/dashboard/projects/${id}`)}
          onViewTeam={() => handleNavigation("/dashboard/team")}
          onViewAllProjects={() => handleNavigation("/dashboard/projects")}
        />
      );

    default:
      return (
        <Card className="p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Role Not Supported
          </h3>
          <p className="text-gray-500">
            Dashboard content for role "{userRole}" is not yet implemented.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => handleNavigation("/dashboard/profile")}
          >
            Update Profile
          </Button>
        </Card>
      );
  }
}

export function DashboardPage() {
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
    router.push("/dashboard/profile");
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
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Account Setup Required
            </h3>
            <p className="text-gray-500 mb-4">
              Please complete your account setup to access the dashboard.
            </p>
            <Button onClick={() => router.push("/login")}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2">
            {error && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
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
            >
              <RefreshCw
                className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {currentUser && !isProfileComplete(currentUser) && (
          <ProfileCompletionBanner
            user={currentUser}
            onComplete={handleCompleteProfile}
          />
        )}

        {/* Active Announcements */}
        {activeAnnouncements.length > 0 && (
          <div className="space-y-2">
            {activeAnnouncements.slice(0, 2).map((announcement) => (
              <Card
                key={announcement.id}
                className={cn(
                  "border-l-4",
                  announcement.type === "warning" &&
                    "border-l-yellow-500 bg-yellow-50",
                  announcement.type === "info" &&
                    "border-l-blue-500 bg-blue-50",
                  announcement.type === "error" && "border-l-red-500 bg-red-50",
                  announcement.type === "success" &&
                    "border-l-green-500 bg-green-50"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {announcement.content}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {announcement.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Welcome Section */}
        {currentUser && <WelcomeCard user={currentUser} />}

        {/* KPI Cards */}
        {kpis.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <KPICard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Role-based Main Content */}
          <div className="lg:col-span-3">
            <RoleBasedContent
              userRole={userRole}
              dashboardData={dashboardData}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                onViewAll={() => router.push("/dashboard/calendar")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
