"use client";

import React from "react";
import { ContractorOffersList } from "@/features/offers/components";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const ContractorOffersPage = () => {
  const t = useTranslations("offers");
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between gap-6 pb-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-n-9 dark:text-n-1 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-design-main to-design-main-dark shadow-lg">
                <FileText className="h-4 w-4 sm:h-7 sm:w-7 text-white" />
              </div>
              {t("title")}
            </h1>
          </div>
        </div>

        <ContractorOffersList />
      </div>
    </div>
  );
};

export default ContractorOffersPage;
