"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { DashboardUser } from "../../types";
import { cn } from "@/lib/utils";

interface WelcomeCardProps {
  user: DashboardUser;
  className?: string;
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case "individual":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "contractor":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "supplier":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "engineering_office":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "freelance_engineer":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "organization":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    individual: "Individual",
    contractor: "Contractor",
    supplier: "Supplier",
    engineering_office: "Engineering Office",
    freelance_engineer: "Freelance Engineer",
    organization: "Organization",
  };

  return roleMap[role] || role;
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function WelcomeCard({ user, className }: WelcomeCardProps) {
  const greeting = getGreeting();
  const roleColor = getRoleBadgeColor(user.role);
  const roleDisplay = getRoleDisplayName(user.role);
  const userInitials = user.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  const lastLoginDate = user.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Card
      className={cn(
        "bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-blue-600 text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900">
              {greeting}, {user.name}!
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className={roleColor}>
                {roleDisplay}
              </Badge>
              {user.isVerified && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  ✓ Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          Welcome back to your dashboard. Here's what's happening with your
          projects today.
        </div>
        {lastLoginDate && (
          <div className="text-xs text-gray-500 mt-2">
            Last login: {lastLoginDate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
