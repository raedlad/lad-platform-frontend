"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UpdateCompleteOfferForm } from "@/features/offers/components";
import { useContractorOffers } from "@/features/offers/hooks/useContractorOffers";

export default function UpdateCompleteOfferPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;

  const { currentOffer, fetchOfferDetails, isLoading, error } =
    useContractorOffers(undefined, false, false);

  React.useEffect(() => {
    if (offerId) {
      fetchOfferDetails(offerId);
    }
  }, [offerId, fetchOfferDetails]);

  const handleSuccess = () => {
    router.push("/dashboard/contractor/offers");
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="section">
        <div className="w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOffer && !isLoading) {
    return (
      <div className="section">
        <div className="w-full">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              {error || t("offers.notFound", { default: "Offer not found" })}
            </p>
            <Link href="/dashboard/contractor/offers">
              <Button className="mt-4" variant="outline">
                {t("common.actions.back")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if offer can be edited
  if (currentOffer && !currentOffer.canModify) {
    return (
      <div className="section">
        <div className="w-full">
          <div className="text-center py-12">
            <p className="text-gray-600">
              {t("offers.cannotEdit", {
                default: "This offer cannot be edited at this time.",
              })}
            </p>
            <Link href="/dashboard/contractor/offers">
              <Button className="mt-4" variant="outline">
                {t("common.actions.back")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Only render form if we have a current offer
  if (!currentOffer) {
    return null;
  }

  return (
    <div className="section">
      <div className="w-full">
        <div className="w-full flex flex-col gap-6">
          {/* Header */}
          <div className="w-full flex justify-between">
            <div className="w-full flex flex-col gap-2 max-w-sm">
              <h1 className="text-2xl font-bold">
                {t("offers.update.title", { default: "Update Offer" })}
              </h1>
              <p>
                {t("offers.update.description", {
                  default: "Update your complete offer details",
                })}
              </p>
            </div>
            <Link href="/dashboard/contractor/offers">
              <Button
                variant="outline"
                size="sm"
                className="border-design-main text-design-main px-6"
              >
                {t("common.actions.back")}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Form */}
          <div className="w-full border border-design-tertiary rounded-md p-4 md:p-6 max-w-3xl mx-auto">
            <UpdateCompleteOfferForm
              offer={currentOffer}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
