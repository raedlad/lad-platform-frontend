"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Upload,
  User,
  Mail,
  Phone,
  Building,
} from "lucide-react";

export function ProfileHeader() {
  // Mock user data - replace with actual user data from store/API
  const user = {
    name: "Ahmed Al-Rashid",
    role: "Engineering Office",
    company: "Al-Rashid Engineering Consultants",
    email: "ahmed@alrashid-eng.com",
    phone: "+966 50 123 4567",
    profileCompletion: 72,
    avatar: "/avatars/user.jpg",
    isEmailVerified: true,
    isPhoneVerified: false,
    isDocumentVerified: true,
    memberSince: "January 2024",
    location: "Riyadh, Saudi Arabia",
  };

  const verificationBadges = [
    {
      label: "Email Verified",
      verified: user.isEmailVerified,
      icon: Mail,
    },
    {
      label: "Phone Verified",
      verified: user.isPhoneVerified,
      icon: Phone,
    },
    {
      label: "Documents Verified",
      verified: user.isDocumentVerified,
      icon: Upload,
    },
  ];

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getCompletionMessage = (percentage: number) => {
    if (percentage >= 80) return "Your profile looks great!";
    if (percentage >= 50) return "Almost there! Add more details.";
    return "Complete your profile to get started.";
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Left section - User info */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            {/* User details */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-sm">
                    <User className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                  {user.company && (
                    <Badge variant="outline" className="text-sm">
                      <Building className="w-3 h-3 mr-1" />
                      {user.company}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {user.memberSince} • {user.location}
              </p>
            </div>
          </div>

          {/* Right section - Actions and completion */}
          <div className="flex flex-col space-y-4 lg:items-end">
            {/* Action buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </div>

            {/* Profile completion */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border w-full lg:w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span
                  className={`text-sm font-bold ${getCompletionColor(
                    user.profileCompletion
                  )}`}
                >
                  {user.profileCompletion}%
                </span>
              </div>
              <Progress value={user.profileCompletion} className="h-2 mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {getCompletionMessage(user.profileCompletion)}
              </p>
            </div>
          </div>
        </div>

        {/* Verification badges */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
          {verificationBadges.map((badge) => (
            <div
              key={badge.label}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
                badge.verified
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              }`}
            >
              {badge.verified ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <badge.icon className="w-4 h-4" />
              <span>{badge.label}</span>
              {!badge.verified && <AlertCircle className="w-4 h-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
