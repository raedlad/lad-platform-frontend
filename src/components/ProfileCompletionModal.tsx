"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";

import {
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Briefcase,
  Wrench,
} from "lucide-react";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    profileCompletion: number;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    isDocumentVerified: boolean;
  };
}

export function ProfileCompletionModal({
  isOpen,
  onClose,
  user,
}: ProfileCompletionModalProps) {
  const router = useRouter();
  const t = useTranslations();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCompleteProfile = async () => {
    setIsNavigating(true);
    try {
      router.push("/dashboard/profile");
      onClose();
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleSkip = () => {
    onClose();
    // Store that user has seen the modal to avoid showing it again
    localStorage.setItem("profileCompletionModalSeen", "true");
  };

  const completionSections = [
    {
      icon: User,
      label: "Personal Information",
      completed: user.isEmailVerified && user.isPhoneVerified,
    },
    {
      icon: FileText,
      label: "Documents & Verification",
      completed: user.isDocumentVerified,
    },
    {
      icon: Briefcase,
      label: "Professional Information",
      completed: user.profileCompletion > 60,
    },
    {
      icon: Wrench,
      label: "Technical Information",
      completed: user.profileCompletion > 80,
    },
  ];

  const completedSections = completionSections.filter(
    (section) => section.completed
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t("auth.completeProfile.title")}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
            {t("auth.completeProfile.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Completion Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-bold text-blue-600">
                {user.profileCompletion}%
              </span>
            </div>
            <Progress value={user.profileCompletion} className="h-2" />
            <p className="text-xs text-gray-500 text-center">
              {completedSections} of {completionSections.length} sections
              completed
            </p>
          </div>

          {/* Completion Sections */}
          <div className="space-y-3">
            {completionSections.map((section, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border"
              >
                <section.icon className="h-5 w-5 text-gray-500" />
                <span className="flex-1 text-sm font-medium">
                  {section.label}
                </span>
                {section.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Benefits of completing your profile:
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Get better project recommendations</li>
              <li>• Increase your visibility to clients</li>
              <li>• Access all platform features</li>
              <li>• Build trust with verification badges</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            {t("auth.completeProfile.buttons.skip")}
          </Button>
          <Button
            onClick={handleCompleteProfile}
            disabled={isNavigating}
            className="w-full sm:w-auto"
          >
            {isNavigating
              ? "Loading..."
              : t("auth.completeProfile.buttons.complete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
