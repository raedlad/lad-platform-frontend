"use client";
import { useTranslations } from "next-intl";
import React from "react";
import NavigationButtons from "../../common/NavigationButtons";

const BOQForm = () => {
  const t = useTranslations("");
  return (
    <div className="w-full flex flex-col gap-8 ">
      <div className="flex gap-2 text-base lg:text-lg font-bold">
        <span className="text-design-main">04 -</span>
        <h1>{t("project.step4.title")}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <NavigationButtons onSubmit={() => {}} isLoading={false} />
      </div>
    </div>
  );
};

export default BOQForm;
