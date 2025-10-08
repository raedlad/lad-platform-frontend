"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIndividualOffers } from "@/features/offers/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  Calendar,
  DollarSign,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { formatCurrency } from "@/shared/utils/formatters";

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const offerId = params.id as string;

  const {
    currentOffer,
    isLoading,
    isSubmitting,
    error,
    fetchOfferDetails,
    acceptOffer,
    rejectOffer,
    markAsViewed,
  } = useIndividualOffers(undefined, false, false);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    // Fetch offer details and mark as viewed
    fetchOfferDetails(offerId);
    markAsViewed(offerId);
  }, [offerId]);

  const handleAccept = async () => {
    try {
      await acceptOffer(offerId);
      toast.success(t("offers.acceptSuccess"));
      router.push("/dashboard/individual/offers");
    } catch (error) {
      toast.error(t("offers.acceptError"));
    }
  };

  const handleReject = async () => {
    try {
      await rejectOffer(offerId, rejectReason);
      toast.success(t("offers.rejectSuccess"));
      setShowRejectDialog(false);
      router.push("/dashboard/individual/offers");
    } catch (error) {
      toast.error(t("offers.rejectError"));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !currentOffer) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-500 mb-4">{error || t("offers.notFound")}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <h1 className="text-3xl font-bold">{t("offers.offerDetails")}</h1>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAccept}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {t("offers.accept")}
          </Button>

          <Button
            onClick={() => setShowRejectDialog(true)}
            disabled={isSubmitting}
            variant="destructive"
          >
            <XCircle className="h-4 w-4 mr-2" />
            {t("offers.reject")}
          </Button>

          <Button
            onClick={() =>
              router.push(`/dashboard/individual/offers/${offerId}/counter`)
            }
            variant="outline"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {t("offers.counter")}
          </Button>
        </div>
      </div>

      {/* Offer Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentOffer.projectTitle}</CardTitle>
              <div className="mt-2 space-y-1">
                <Badge
                  variant={
                    currentOffer.status === "rejected"
                      ? "destructive"
                      : currentOffer.status === "accepted"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    currentOffer.status === "accepted"
                      ? "bg-green-500 hover:bg-green-600"
                      : currentOffer.status === "pending"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : ""
                  }
                >
                  {t(`offers.status.${currentOffer.status}`)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-design-main">
                {formatCurrency(currentOffer.amount, currentOffer.currency)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("offers.submittedOn", {
                  date: new Date(currentOffer.submittedAt).toLocaleDateString(),
                })}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("offers.overview")}</TabsTrigger>
          <TabsTrigger value="contractor">{t("offers.contractor")}</TabsTrigger>
          <TabsTrigger value="phases">{t("offers.phases")}</TabsTrigger>
          <TabsTrigger value="attachments">
            {t("offers.attachments")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("offers.offerDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t("offers.amount")}:</span>
                  <span>
                    {formatCurrency(currentOffer.amount, currentOffer.currency)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t("offers.duration")}:</span>
                  <span>
                    {currentOffer.executionDuration?.value}{" "}
                    {currentOffer.executionDuration?.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t("offers.startDate")}:</span>
                  <span>
                    {new Date(
                      currentOffer.timeline.proposedStartDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t("offers.endDate")}:</span>
                  <span>
                    {new Date(
                      currentOffer.timeline.proposedEndDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-2">{t("offers.description")}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {currentOffer.description}
                </p>
              </div>

              {currentOffer.hasWarranty && (
                <div className="pt-4">
                  <Badge variant="outline" className="bg-green-50">
                    {t("offers.hasWarranty")}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("offers.contractorInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentOffer.contractorDetails.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("offers.rating")}:{" "}
                    {currentOffer.contractorDetails.rating}/5
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("offers.completedProjects")}:{" "}
                    {currentOffer.contractorDetails.completedProjects}
                  </p>
                </div>
              </div>

              {currentOffer.contractorDetails.specialties?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    {t("offers.specialties")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentOffer.contractorDetails.specialties.map(
                      (specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {currentOffer.contractorDetails.location && (
                <div>
                  <h4 className="font-medium mb-2">{t("offers.location")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentOffer.contractorDetails.location}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          {currentOffer.phases && currentOffer.phases.length > 0 ? (
            currentOffer.phases.map((phase, index) => (
              <Card key={phase.id || index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t("offers.phase")} {phase.order + 1}: {phase.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {phase.description}
                  </p>

                  {phase.paymentPlans && phase.paymentPlans.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">
                        {t("offers.paymentPlans")}
                      </h4>
                      {phase.paymentPlans.map((plan, planIndex) => (
                        <div
                          key={plan.id || planIndex}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <span className="text-sm">{plan.name}</span>
                          <span className="font-medium">
                            {formatCurrency(plan.amount, currentOffer.currency)}{" "}
                            ({plan.percentageOfContract}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">{t("offers.noPhases")}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("offers.attachments")}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentOffer.attachments &&
              currentOffer.attachments.length > 0 ? (
                <div className="space-y-2">
                  {currentOffer.attachments.map((attachment, index) => (
                    <div
                      key={attachment.id || index}
                      className="flex items-center justify-between py-2 px-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(attachment.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(attachment.url, "_blank")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t("offers.noAttachments")}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t("offers.rejectOffer")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  {t("offers.rejectReason")}
                </label>
                <textarea
                  className="w-full mt-2 p-2 border rounded-lg"
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t("offers.rejectReasonPlaceholder")}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason}
                >
                  {t("offers.confirmReject")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
