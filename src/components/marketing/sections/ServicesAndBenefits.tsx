"use client";
import React from "react";
import MagicBento from "@/components/ui/magic-bento";
import { useTranslations } from "next-intl";

const ServicesAndBenefits = () => {
  const t = useTranslations("servicesAndBenefits");
  return (
    <div className="py-16 md:py-24 flex flex-col gap-4 max-w-7xl mx-auto">
      <div className="w-full items-center justify-center flex flex-col gap-4">
        <h2 className="text-3xl font-semibold lg:text-4xl">{t("title")}</h2>
        <p className="text-muted-foreground font-semibold">
          {t("description")}
        </p>
      </div>
      <MagicBento />
    </div>
  );
};

export default ServicesAndBenefits;
