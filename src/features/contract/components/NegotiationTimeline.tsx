"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  User,
  MessageSquare,
  FileText,
  CheckCircle,
  PenTool,
} from "lucide-react";
import { ContractVersion, UserRole } from "../types/contract";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface NegotiationTimelineProps {
  versions: ContractVersion[];
}

const getIconForVersion = (version: ContractVersion) => {
  const comment = version.comment?.toLowerCase() || "";

  if (comment.includes("sign")) return PenTool;
  if (comment.includes("approve")) return CheckCircle;
  if (comment.includes("request") || comment.includes("يرجى"))
    return MessageSquare;
  if (comment.includes("sent") || comment.includes("created")) return FileText;

  return Clock;
};

const getRoleBadgeVariant = (role: UserRole) => {
  return role === "client" ? "secondary" : "outline";
};

export const NegotiationTimeline: React.FC<NegotiationTimelineProps> = ({
  versions,
}) => {
  const t = useTranslations("contract");

  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t("timeline.title")}
          </CardTitle>
          <CardDescription>{t("timeline.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground dark:text-gray-400 text-center py-4">
            {t("timeline.no_history")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {t("timeline.title")}
        </CardTitle>
        <CardDescription>{t("timeline.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {versions
              .slice()
              .reverse()
              .map((version, index) => {
                const Icon = getIconForVersion(version);
                const isLatest = index === 0;

                return (
                  <div
                    key={version.versionNumber}
                    className="relative pl-8 pb-4 border-l-2 border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                        isLatest
                          ? "bg-primary border-primary"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      }`}
                    />

                    {/* Content */}
                    <div
                      className={`p-4 rounded-lg border ${
                        isLatest
                          ? "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`w-4 h-4 ${
                              isLatest
                                ? "text-primary"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            {t("timeline.version")} {version.versionNumber}
                          </span>
                          {isLatest && (
                            <Badge variant="secondary" className="text-xs">
                              {t("timeline.latest")}
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant={getRoleBadgeVariant(version.modifiedBy)}
                          className="text-xs"
                        >
                          {version.modifiedBy === "client"
                            ? t("roles.client")
                            : t("roles.contractor")}
                        </Badge>
                      </div>

                      {version.comment && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {version.comment}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(version.modifiedAt), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">
                          •
                        </span>
                        <span>
                          {new Date(version.modifiedAt).toLocaleString(
                            "ar-SA",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
