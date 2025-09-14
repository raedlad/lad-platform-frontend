"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type DurationSelectProps = {
  onSelect: (value: string) => void;
  value?: string;
  triggerClassName?: string;
  placeholder?: string;
};

const DurationSelect = ({
  onSelect,
  value,
  triggerClassName,
  placeholder,
}: DurationSelectProps) => {
  const t = useTranslations("");
  return (
    <Select  value={value} onValueChange={onSelect}>
      <SelectTrigger size="sm" className={cn("w-fit", triggerClassName)}>
        <SelectValue
          placeholder={placeholder ?? t("common.select.duration")}
          className="w-full"
        />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={"day"}>{t("common.select.day")}</SelectItem>
        <SelectItem value={"week"}>{t("common.select.week")}</SelectItem>
        <SelectItem value={"month"}>{t("common.select.month")}</SelectItem>
        <SelectItem value={"year"}>{t("common.select.year")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DurationSelect;
