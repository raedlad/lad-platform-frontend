"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Edit,
  Upload,
  Key,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  FileText,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
} from "lucide-react";

export function ProfileOverview() {
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
    lastLogin: "2 hours ago",
  };

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      icon: Edit,
      color: "bg-blue-500",
      action: () => console.log("Edit profile"),
    },
    {
      title: "Upload Document",
      description: "Add verification documents",
      icon: Upload,
      color: "bg-green-500",
      action: () => console.log("Upload document"),
    },
    {
      title: "Change Password",
      description: "Update your security settings",
      icon: Key,
      color: "bg-orange-500",
      action: () => console.log("Change password"),
    },
  ];

  const verificationItems = [
    {
      label: "Email Address",
      value: user.email,
      verified: user.isEmailVerified,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: user.phone,
      verified: user.isPhoneVerified,
      icon: Phone,
    },
    {
      label: "Identity Documents",
      value: "3 documents uploaded",
      verified: user.isDocumentVerified,
      icon: FileText,
    },
  ];

  const profileSections = [
    {
      label: "Personal Information",
      completion: 85,
      status: "complete",
    },
    {
      label: "Professional Details",
      completion: 60,
      status: "incomplete",
    },
    {
      label: "Technical Information",
      completion: 45,
      status: "incomplete",
    },
    {
      label: "Document Verification",
      completion: 90,
      status: "complete",
    },
  ];

  const getStatusIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-orange-500" />
    );
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Profile Snapshot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Snapshot</span>
          </CardTitle>
          <CardDescription>
            Quick overview of your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <User className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                  {user.company && (
                    <Badge variant="outline">
                      <Building className="w-3 h-3 mr-1" />
                      {user.company}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                  {getStatusIcon(user.isEmailVerified)}
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                  {getStatusIcon(user.isPhoneVerified)}
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Completion</span>
                <span
                  className={`text-sm font-bold ${getCompletionColor(
                    user.profileCompletion
                  )}`}
                >
                  {user.profileCompletion}%
                </span>
              </div>
              <Progress value={user.profileCompletion} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 justify-start"
                onClick={action.action}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Verification Status</span>
          </CardTitle>
          <CardDescription>
            Current status of your account verifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verificationItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.verified ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge
                        variant="secondary"
                        className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200"
                      >
                        Verified
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-orange-500" />
                      <Badge
                        variant="secondary"
                        className="text-orange-700 bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
                      >
                        Pending
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>
            Breakdown of your profile completion by section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profileSections.map((section) => (
              <div key={section.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{section.label}</span>
                  <span
                    className={`text-sm font-bold ${getCompletionColor(
                      section.completion
                    )}`}
                  >
                    {section.completion}%
                  </span>
                </div>
                <Progress value={section.completion} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest profile activities and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Profile information updated
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Updated contact information and company details
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Document uploaded</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Professional license certificate submitted for verification
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  1 day ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Verification pending</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Phone number verification code sent
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  2 days ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
