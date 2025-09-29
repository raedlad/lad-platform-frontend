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
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Settings,
  Globe,
  Moon,
  Sun,
  Monitor,
  Bell,
  Mail,
  Trash2,
  AlertTriangle,
  Languages,
  Palette,
  Shield,
} from "lucide-react";

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);

  // Mock settings data - replace with actual data from store/API
  const [settings, setSettings] = useState({
    language: "ar",
    theme: "system",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    profileVisibility: "public",
    dataSharing: false,
    analyticsOptIn: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    console.log(`Setting ${key} changed to:`, value);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log("Settings saved:", settings);
  };

  const handleExportData = () => {
    console.log("Exporting user data...");
    // Implement data export functionality
  };

  const handleDeleteAccount = () => {
    console.log("Delete account requested");
    // Implement account deletion flow
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>
            Configure your account preferences and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Languages className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">Language</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose your preferred language
                </p>
              </div>
            </div>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSettingChange("language", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">Theme</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Choose your preferred theme
                </p>
              </div>
            </div>
            <Select
              value={settings.theme}
              onValueChange={(value) => handleSettingChange("theme", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Manage how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("emailNotifications", checked)
              }
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive push notifications in your browser
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("pushNotifications", checked)
              }
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">
                  Marketing Emails
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive promotional emails and updates
                </p>
              </div>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                handleSettingChange("marketingEmails", checked)
              }
            />
          </div>

          {/* Security Alerts */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">Security Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Receive alerts about security events
                </p>
              </div>
            </div>
            <Switch
              checked={settings.securityAlerts}
              onCheckedChange={(checked) =>
                handleSettingChange("securityAlerts", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy</span>
          </CardTitle>
          <CardDescription>
            Control your privacy and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">
                  Profile Visibility
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Control who can see your profile
                </p>
              </div>
            </div>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) =>
                handleSettingChange("profileVisibility", value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="contacts">Contacts Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Sharing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">Data Sharing</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share anonymized data for platform improvement
                </p>
              </div>
            </div>
            <Switch
              checked={settings.dataSharing}
              onCheckedChange={(checked) =>
                handleSettingChange("dataSharing", checked)
              }
            />
          </div>

          {/* Analytics Opt-in */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-gray-500" />
              <div>
                <Label className="text-base font-medium">Analytics</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Help us improve by sharing usage analytics
                </p>
              </div>
            </div>
            <Switch
              checked={settings.analyticsOptIn}
              onCheckedChange={(checked) =>
                handleSettingChange("analyticsOptIn", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or delete your account data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Download a copy of all your account data
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Account Backup</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Last backup: January 15, 2024
              </p>
            </div>
            <Button variant="outline">Create Backup</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Settings are automatically saved when changed
            </p>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950">
            <div>
              <p className="font-medium text-red-800 dark:text-red-200">
                Delete Account
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
