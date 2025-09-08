"use client";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import React from "react";
import { useTranslations } from "next-intl";

const DurationSelect = ({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) => {
  const t = useTranslations("");
  return (
    <Select
      onValueChange={(value) => {
        onSelect(value);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("project.duration")} className="w-full" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={"day"}>{t("common.day")}</SelectItem>
        <SelectItem value={"week"}>{t("common.week")}</SelectItem>
        <SelectItem value={"month"}>{t("common.month")}</SelectItem>
        <SelectItem value={"year"}>{t("common.year")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DurationSelect;
