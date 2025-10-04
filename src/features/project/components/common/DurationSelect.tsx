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
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger size="sm" className={cn("w-fit", triggerClassName)}>
        <SelectValue
          placeholder={placeholder ?? t("common.select.duration")}
          className="w-full"
        />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={"days"}>{t("common.select.days")}</SelectItem>
        <SelectItem value={"weeks"}>{t("common.select.weeks")}</SelectItem>
        <SelectItem value={"months"}>{t("common.select.months")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DurationSelect;
