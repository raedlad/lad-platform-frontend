"use client";
import { useTranslations } from "next-intl";
import React from "react";

const Logo = () => {
  const t = useTranslations("Header");
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">{t("l")}</span>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">
        {t("logo")}
      </span>
    </div>
  );
};

export default Logo;
