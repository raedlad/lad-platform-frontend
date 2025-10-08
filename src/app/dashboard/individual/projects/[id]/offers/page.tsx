"use client";

import React from "react";
import { useParams } from "next/navigation";
import { IndividualOffersList } from "@/features/offers/components/individual/display/IndividualOffersList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function ProjectOffersPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const projectId = params.projectId as string;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("common.back")}
      </Button>

      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("offers.projectOffers")}
        </h1>
        <p className="text-muted-foreground">
          {t("offers.viewProjectOffers", { projectId })}
        </p>
      </div>

      {/* Project Info Card (Optional - you can fetch project details here) */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>{t("project.details")}</CardTitle>
          <CardDescription>
            Project ID: {projectId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t("project.status")}:</span>
              <span className="ml-2">Active</span>
            </div>
            <div>
              <span className="font-medium">{t("project.deadline")}:</span>
              <span className="ml-2">30 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offers List for this Project */}
      <Card>
        <CardHeader>
          <CardTitle>{t("offers.receivedOffers")}</CardTitle>
          <CardDescription>
            {t("offers.totalOffers")}: Loading...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IndividualOffersList projectId={projectId} />
        </CardContent>
      </Card>
    </div>
  );
}
