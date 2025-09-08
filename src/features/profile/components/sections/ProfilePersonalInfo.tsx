"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Building,
} from "lucide-react";

export function ProfilePersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - replace with actual user data from store/API
  const [userData, setUserData] = useState({
    firstName: "Ahmed",
    lastName: "Al-Rashid",
    email: "ahmed@alrashid-eng.com",
    phone: "+966 50 123 4567",
    dateOfBirth: "1985-03-15",
    nationality: "Saudi Arabian",
    city: "Riyadh",
    country: "Saudi Arabia",
    address: "King Fahd Road, Olaya District",
    postalCode: "11564",
    avatar: "/avatars/user.jpg",
    isEmailVerified: true,
    isPhoneVerified: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
    console.log("Saving user data:", userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVerifyEmail = () => {
    console.log("Verify email");
  };

  const handleVerifyPhone = () => {
    console.log("Verify phone");
  };

  const handleChangeEmail = () => {
    console.log("Change email");
  };

  const handleChangePhone = () => {
    console.log("Change phone");
  };

  const handleAvatarChange = () => {
    console.log("Change avatar");
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Picture</span>
          </CardTitle>
          <CardDescription>
            Upload a professional photo to personalize your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userData.avatar}
                  alt={`${userData.firstName} ${userData.lastName}`}
                />
                <AvatarFallback className="text-xl">
                  {userData.firstName[0]}
                  {userData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                onClick={handleAvatarChange}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                JPG, GIF or PNG. Max size of 2MB. Recommended size: 400x400px
              </p>
              <Button variant="outline" onClick={handleAvatarChange}>
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.lastName}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={userData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {new Date(userData.dateOfBirth).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              {isEditing ? (
                <Input
                  id="nationality"
                  value={userData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.nationality}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
          <CardDescription>
            Manage your email and phone number for account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {userData.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {userData.isEmailVerified ? (
                  <Badge
                    variant="secondary"
                    className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-orange-700 bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
                <div className="flex space-x-2">
                  {!userData.isEmailVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleVerifyEmail}
                    >
                      Verify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleChangeEmail}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {userData.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {userData.isPhoneVerified ? (
                  <Badge
                    variant="secondary"
                    className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-orange-700 bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unverified
                  </Badge>
                )}
                <div className="flex space-x-2">
                  {!userData.isPhoneVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleVerifyPhone}
                    >
                      Verify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleChangePhone}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Address Information</span>
              </CardTitle>
              <CardDescription>
                Your location and address details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={userData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.city}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={userData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.country}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={userData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.address}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              {isEditing ? (
                <Input
                  id="postalCode"
                  value={userData.postalCode}
                  onChange={(e) =>
                    handleInputChange("postalCode", e.target.value)
                  }
                />
              ) : (
                <p className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  {userData.postalCode}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
