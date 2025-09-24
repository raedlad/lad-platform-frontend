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
  Shield,
  Key,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActivity: string;
  isCurrent: boolean;
  browser: string;
  ip: string;
}

export function ProfileSecurity() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mock security data - replace with actual data from store/API
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-15",
    loginNotifications: true,
    securityQuestions: true,
  });

  // Mock active sessions - replace with actual data from store/API
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: "1",
      device: "MacBook Pro",
      location: "Riyadh, Saudi Arabia",
      lastActivity: "Active now",
      isCurrent: true,
      browser: "Chrome 120.0",
      ip: "192.168.1.100",
    },
    {
      id: "2",
      device: "iPhone 15",
      location: "Riyadh, Saudi Arabia",
      lastActivity: "2 hours ago",
      isCurrent: false,
      browser: "Safari Mobile",
      ip: "192.168.1.101",
    },
    {
      id: "3",
      device: "Windows PC",
      location: "Jeddah, Saudi Arabia",
      lastActivity: "3 days ago",
      isCurrent: false,
      browser: "Edge 119.0",
      ip: "10.0.0.50",
    },
  ]);

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don&apos;t match");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    console.log("Password changed successfully");
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleTwoFactor = () => {
    setSecuritySettings((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
    console.log("Two-factor authentication toggled");
  };

  const handleLogoutSession = (sessionId: string) => {
    setActiveSessions((prev) =>
      prev.filter((session) => session.id !== sessionId)
    );
    console.log("Session logged out:", sessionId);
  };

  const handleLogoutAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((session) => session.isCurrent));
    console.log("All other sessions logged out");
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 2) return "text-red-500";
    if (strength < 4) return "text-orange-500";
    return "text-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes("iphone") ||
      device.toLowerCase().includes("android")
    ) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Overview</span>
          </CardTitle>
          <CardDescription>
            Your account security status and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Last changed{" "}
                      {new Date(
                        securitySettings.lastPasswordChange
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {securitySettings.twoFactorEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>
                </div>
                {securitySettings.twoFactorEnabled ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    Account Secure
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your account has strong security settings enabled.
                </p>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Security Score:</strong> 85/100
                </p>
                <p>
                  <strong>Last Security Check:</strong> Today
                </p>
                <p>
                  <strong>Active Sessions:</strong> {activeSessions.length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Password</span>
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isChangingPassword ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Key className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Password last changed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(
                      securitySettings.lastPasswordChange
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We recommend changing your password every 90 days for better
                security.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordData.newPassword && (
                  <p
                    className={cn(
                      "text-xs",
                      getPasswordStrengthColor(passwordStrength)
                    )}
                  >
                    Password strength:{" "}
                    {getPasswordStrengthText(passwordStrength)}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-500">
                      Passwords don&apos;t match
                    </p>
                  )}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handlePasswordChange} disabled={isLoading}>
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelPasswordChange}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {securitySettings.twoFactorEnabled
                    ? "Two-factor authentication is enabled"
                    : "Use an authenticator app for additional security"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {securitySettings.twoFactorEnabled ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Enabled
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Disabled
                </Badge>
              )}
              <Button variant="outline" onClick={handleToggleTwoFactor}>
                {securitySettings.twoFactorEnabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions across different devices
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleLogoutAllOtherSessions}
              disabled={activeSessions.filter((s) => !s.isCurrent).length === 0}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout All Others
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getDeviceIcon(session.device)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{session.device}</p>
                      {session.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current Session
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        {session.browser} • {session.location}
                      </p>
                      <p>
                        IP: {session.ip} • {session.lastActivity}
                      </p>
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogoutSession(session.id)}
                  >
                    <LogOut className="w-3 h-3 mr-1" />
                    Logout
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Suggestions to improve your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!securitySettings.twoFactorEnabled && (
              <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Enable Two-Factor Authentication
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    Add an extra layer of security to protect your account from
                    unauthorized access.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Regular Password Updates
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Change your password every 90 days and use a unique, strong
                  password.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Monitor Active Sessions
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Regularly review your active sessions and logout from unused
                  devices.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
