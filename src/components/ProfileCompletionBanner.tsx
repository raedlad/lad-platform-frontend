"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCompletionBannerProps {
  user: {
    profileCompletion: number;
  };
  onDismiss?: () => void;
  className?: string;
}

export function ProfileCompletionBanner({
  user,
  onDismiss,
  className,
}: ProfileCompletionBannerProps) {
  const router = useRouter();
  const t = useTranslations();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleCompleteNow = async () => {
    setIsNavigating(true);
    try {
      router.push("/dashboard/profile");
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (isDismissed || user.profileCompletion >= 100) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Profile Incomplete
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
            {t("dashboard.banner.incomplete")}
          </p>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  {user.profileCompletion}% complete
                </span>
              </div>
              <Progress
                value={user.profileCompletion}
                className="h-2 bg-orange-200 dark:bg-orange-800"
              />
            </div>

            <Button
              size="sm"
              onClick={handleCompleteNow}
              disabled={isNavigating}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isNavigating ? "Loading..." : t("dashboard.banner.completeNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
