"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useContractorOffers } from "@/features/offers/hooks/useContractorOffers";
import { OfferDetails } from "@/features/offers/components/common/OfferDetails";
import { ProjectInfoCard } from "@/features/offers/components/contractor/ProjectInfoCard";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { ArrowLeft, Edit, XCircle, AlertTriangle } from "lucide-react";

const ContractorOfferDetailsPage = () => {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;
  const { currentOffer, fetchOfferDetails, isLoading, error, withdrawOffer } =
    useContractorOffers(undefined, false, false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = React.useState(false);
  const [withdrawError, setWithdrawError] = React.useState<string | null>(null);

  const handleWithdrawOffer = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentOffer) return;

    setIsWithdrawing(true);
    setWithdrawError(null);
    try {
      await withdrawOffer(currentOffer.id);
      setWithdrawDialogOpen(false);
      router.push("/dashboard/contractor/offers");
    } catch (error: unknown) {
      console.error("Failed to withdraw offer:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("offers.withdrawError");
      setWithdrawError(errorMessage);
      // Don't let withdraw errors affect the page - they're shown in the dialog only
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleUpdateOffer = () => {
    if (!currentOffer) return;
    router.push(`/dashboard/contractor/offers/${currentOffer.id}/edit`);
  };

  React.useEffect(() => {
    if (offerId) {
      fetchOfferDetails(offerId).catch((err) => {
        setFetchError(err?.message || "Failed to load offer details");
      });
    }
  }, [offerId, fetchOfferDetails]);

  // Use local fetch error instead of global store error
  const showPageError = fetchError || (error && !currentOffer);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full flex flex-col gap-8">
        {/* Header */}
        <div className="w-full flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("offers.view.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("offers.view.description")}
            </p>
          </div>
          <Link href="/dashboard/contractor/offers">
            <Button
              variant="outline"
              size="sm"
              className="border-design-main hover:border-design-main hover:text-design-main text-design-main inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
              {t("common.actions.back")}
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="w-full border border-n-3 dark:border-n-7 rounded-lg p-8 shadow-sm ">
          {isLoading ? (
            <div className="w-full animate-pulse space-y-8">
              {/* Project skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-n-3 dark:bg-n-7 rounded w-1/4"></div>
                <div className="h-20 bg-n-3 dark:bg-n-7 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-n-3 dark:bg-n-7 rounded"></div>
                  <div className="h-12 bg-n-3 dark:bg-n-7 rounded"></div>
                  <div className="h-12 bg-n-3 dark:bg-n-7 rounded"></div>
                  <div className="h-12 bg-n-3 dark:bg-n-7 rounded"></div>
                </div>
              </div>
              {/* Offer skeleton */}
              <div className="space-y-4 pt-8 border-t border-n-3 dark:border-n-7">
                <div className="h-6 bg-n-3 dark:bg-n-7 rounded w-1/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-n-3 dark:bg-n-7 rounded"></div>
                  <div className="h-20 bg-n-3 dark:bg-n-7 rounded"></div>
                  <div className="h-20 bg-n-3 dark:bg-n-7 rounded"></div>
                </div>
                <div className="h-32 bg-n-3 dark:bg-n-7 rounded"></div>
              </div>
            </div>
          ) : showPageError ? (
            <div className="w-full text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-n-9 dark:text-n-1 mb-2">
                    {t("common.error")}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 mb-4">
                    {fetchError || error}
                  </p>
                </div>
                <Button
                  onClick={() => fetchOfferDetails(offerId)}
                  variant="outline"
                  className="border-design-main text-design-main"
                >
                  {t("common.actions.tryAgain")}
                </Button>
              </div>
            </div>
          ) : !currentOffer ? (
            <div className="w-full text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <p className="text-n-6 dark:text-n-4">
                  {t("offers.view.notFound")}
                </p>
                <Link href="/dashboard/contractor/offers">
                  <Button
                    variant="outline"
                    className="border-design-main text-design-main inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
                    {t("common.actions.back")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Project Information */}
              <ProjectInfoCard offer={currentOffer} />

              {/* Offer Details */}
              <OfferDetails offer={currentOffer} hideContractorInfo />

              {/* Action Buttons */}
              {(currentOffer?.canModify || currentOffer?.canWithdraw) && (
                <div className="pt-6 border-t border-n-3 dark:border-n-7 flex flex-col sm:flex-row gap-3 justify-end">
                  {currentOffer?.canModify && (
                    <Button
                      onClick={handleUpdateOffer}
                      variant="default"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {t("common.actions.update")}
                    </Button>
                  )}
                  {currentOffer?.canWithdraw && (
                    <AlertDialog
                      open={withdrawDialogOpen}
                      onOpenChange={setWithdrawDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 inline-flex items-center justify-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          {t("offers.withdraw")}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex flex-col items-center gap-4">
                            <div className="flex  h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 flex-shrink-0">
                              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                            </div>
                            <div className="flex-1">
                              <AlertDialogTitle className="text-lg text-center">
                                {t("offers.withdrawTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="mt-2">
                                {t("offers.withdrawConfirm")}
                              </AlertDialogDescription>
                            </div>
                          </div>
                        </AlertDialogHeader>

                        {/* Error Message */}
                        {withdrawError && (
                          <div className="px-6 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-800 dark:text-red-400">
                              {withdrawError}
                            </p>
                          </div>
                        )}

                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isWithdrawing}>
                            {t("common.actions.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleWithdrawOffer}
                            disabled={isWithdrawing}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                          >
                            {isWithdrawing
                              ? t("common.actions.loading")
                              : t("offers.withdraw")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorOfferDetailsPage;
