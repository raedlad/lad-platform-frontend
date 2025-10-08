"use client";

import React from "react";
import { IndividualOffersList } from "@/features/offers/components/individual/display/IndividualOffersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useTranslations } from "next-intl";

export default function OwnerOffersPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("offers.allOffers")}</h1>
        <p className="text-muted-foreground">
          {t("offers.manageReceivedOffers")}
        </p>
      </div>

      {/* Offers List */}
      <Card>
        <CardHeader>
          <CardTitle>{t("offers.receivedOffers")}</CardTitle>
        </CardHeader>
        <CardContent>
          <IndividualOffersList />
        </CardContent>
      </Card>
    </div>
  );
}
