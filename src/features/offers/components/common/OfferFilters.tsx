"use client";

import React, { useState, useEffect, useRef } from "react";
import { OfferFilters as OfferFiltersType } from "../../types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Filter, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface OfferFiltersProps {
  filters: OfferFiltersType;
  onFiltersChange: (filters: OfferFiltersType) => void;
}

export const OfferFilters: React.FC<OfferFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const t = useTranslations();
  const [localFilters, setLocalFilters] = useState<OfferFiltersType>(filters);
  const isFirstRender = useRef(true);

  // Debounce the filter changes
  useEffect(() => {
    // Skip the first render to avoid initial API call
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 800); // 800ms delay

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFilters]);

  const handleAmountChange = (
    field: "minAmount" | "maxAmount",
    value: string
  ) => {
    const numValue = value ? parseFloat(value) : undefined;
    setLocalFilters({
      ...localFilters,
      [field]: numValue,
    });
  };

  const handleDateChange = (field: "dateFrom" | "dateTo", value: string) => {
    setLocalFilters({
      ...localFilters,
      [field]: value || undefined,
    });
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(localFilters).length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("common.ui.filters")}
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              <X className="h-4 w-4 mr-1" />
              {t("common.ui.clearAll")}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t("common.ui.minAmount")}
            </label>
            <Input
              type="number"
              placeholder="0"
              value={localFilters.minAmount || ""}
              onChange={(e) => handleAmountChange("minAmount", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t("common.ui.maxAmount")}
            </label>
            <Input
              type="number"
              placeholder={t("common.ui.noLimit")}
              value={localFilters.maxAmount || ""}
              onChange={(e) => handleAmountChange("maxAmount", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t("common.ui.fromDate")}
            </label>
            <Input
              type="date"
              value={localFilters.dateFrom || ""}
              onChange={(e) => handleDateChange("dateFrom", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
