"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Offer, ContractorOffer, IndividualOffer } from "../../types";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  ArrowLeft,
  Edit2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer | ContractorOffer | IndividualOffer;
  variant?: "contractor" | "individual";
  onAccept?: (offer: any) => void;
  onReject?: (offer: any) => void;
  onView?: (offer: any) => void;
  onEdit?: (offer: any) => void;
  onWithdraw?: (offer: any) => void;
  onCounterOffer?: (offer: any) => void;
  className?: string;
}

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency || "SAR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatRelativeTime = (dateString?: string, t?: any): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return t("offers.justNow");
  if (diffInSeconds < 3600)
    return t("offers.minutesAgo", { count: Math.floor(diffInSeconds / 60) });
  if (diffInSeconds < 86400)
    return t("offers.hoursAgo", { count: Math.floor(diffInSeconds / 3600) });
  if (diffInSeconds < 604800)
    return t("offers.daysAgo", { count: Math.floor(diffInSeconds / 86400) });
  return formatDate(dateString);
};

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  variant = "individual",
  onAccept,
  onReject,
  onView,
  onEdit,
  className = "",
}) => {
  const t = useTranslations();

  const isContractor = variant === "contractor";
  const contractorOffer = offer as ContractorOffer;
  const individualOffer = offer as IndividualOffer;

  const projectTitle = isContractor
    ? contractorOffer.projectTitle
    : individualOffer.projectDetails?.title || offer.projectTitle || "";

  const projectLocation = isContractor
    ? contractorOffer.projectLocation
    : individualOffer.projectDetails?.location || "";

  const offerAmount = formatCurrency(offer.amount, offer.currency);
  const startDate = formatDate(offer.timeline?.proposedStartDate);
  const endDate = formatDate(offer.timeline?.proposedEndDate);
  const submittedTime = formatRelativeTime(offer.submittedAt, t);
  const executionDuration = `${offer.executionDuration?.value || 0} ${
    t(`common.select.${offer.executionDuration?.unit}`) ||
    offer.executionDuration?.unit ||
    "days"
  }`;

  const hasWarranty = offer.hasWarranty;
  const hasAttachments = offer.attachments && offer.attachments.length > 0;

  return (
    <Card
      className={cn(
        "group hover:shadow-lg h-full transition-all duration-300 border-border hover:border-p-4 flex flex-col justify-between",
        className
      )}
    >
      <CardHeader className="pb-4 space-y-3">
        {/* Time Header */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-n-6">{submittedTime}</span>
        </div>

        {/* Offer Description */}
        <p className="text-lg lg:text-xl font-medium leading-relaxed line-clamp-2">
          {offer.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Offer Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4">
              <DollarSign className="h-4 w-4 text-design-main" />
              <span className="font-medium">{t("offers.offeredAmount")}</span>
            </div>
            <p className="text-base text-n-8 dark:text-n-2 font-semibold pl-6">
              {offerAmount}
            </p>
          </div>

          {/* Warranty */}
          {hasWarranty && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4">
                <CheckCircle className="h-4 w-4 text-design-main" />
                <span className="font-medium">{t("offers.warranty")}</span>
              </div>
              <p className="text-base text-n-8 dark:text-n-2 font-semibold pl-6">
                {t("common.yes")}
              </p>
            </div>
          )}
          {/* Location */}
          {projectLocation && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4">
                <MapPin className="h-4 w-4 text-design-main" />
                <span className="font-medium">{t("offers.location")}</span>
              </div>
              <p className="text-base text-n-8 dark:text-n-2 font-semibold pl-6 line-clamp-1">
                {projectLocation}
              </p>
            </div>
          )}

          {/* Execution Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4">
              <Clock className="h-4 w-4 text-design-main" />
              <span className="font-medium">{t("offers.duration")}</span>
            </div>
            <p className="text-base text-n-8 dark:text-n-2 font-semibold pl-6">
              {executionDuration}
            </p>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4">
              <Calendar className="h-4 w-4 text-design-main" />
              <span className="font-medium">{t("offers.startDate")}</span>
            </div>
            <p className="text-base text-n-8 dark:text-n-2 font-semibold pl-6">
              {startDate}
            </p>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4">
              <Calendar className="h-4 w-4 text-design-main" />
              <span className="font-medium">{t("offers.endDate")}</span>
            </div>
            <p className="text-base text-n-8 dark:text-n-2 font-semibold pl-6">
              {endDate}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {hasAttachments && (
          <div className="flex items-center gap-2 text-sm text-n-6 dark:text-n-4 pt-3 border-t border-n-3">
            <FileText className="h-4 w-4 text-design-main" />
            <span className="font-medium">
              {offer.attachments!.length}{" "}
              {t(
                offer.attachments!.length === 1
                  ? "offers.attachment"
                  : "offers.attachments"
              )}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-3 w-full">
          {/* Individual (Owner) - Show Accept/Reject buttons */}
          {!isContractor && (offer as IndividualOffer).canAccept && (
            <>
              <Button
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept?.(offer);
                }}
                className="flex-1 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                <p>{t("offers.accept")}</p>
              </Button>
              <Button
                variant="destructive"
                size="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject?.(offer);
                }}
                className="flex-1 text-base font-medium"
              >
                <XCircle className="w-4 h-4 mr-2" />
                <p>{t("offers.reject")}</p>
              </Button>
            </>
          )}
          
          {/* View Details Button */}
          <Button
            variant="outline"
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(offer);
            }}
            className={cn(
              "text-base font-medium border-p-5 text-p-7 hover:bg-p-1 hover:text-p-8 dark:border-p-6 dark:text-p-5 dark:hover:bg-p-9/20",
              (!isContractor && (offer as IndividualOffer).canAccept) ? "flex-1" : "flex-1"
            )}
          >
            <p>{t("common.viewDetails")}</p>
            <ArrowLeft className="w-4 h-4 ml-2 ltr:rotate-180" />
          </Button>
          
          {/* Contractor - Show Edit button if can modify */}
          {isContractor && (offer as ContractorOffer).canModify && (
            <Button
              size="default"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(offer);
              }}
              className="flex-1 text-base font-medium bg-p-6 hover:bg-p-7 text-white dark:bg-p-6 dark:hover:bg-p-7"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              <p>{t("common.actions.edit")}</p>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
