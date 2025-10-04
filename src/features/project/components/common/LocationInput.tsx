"use client";
import React, { useState } from "react";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { Map, Keyboard } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@shared/components/ui/dialog";
import { GoogleMapLocationPicker } from "./GoogleMapLocationPicker";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onCoordinatesChange,
  disabled = false,
  placeholder,
  className,
}) => {
  const t = useTranslations("project.step1");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"manual" | "map">("manual");

  const handleLocationSelect = (
    location: string,
    lat?: number,
    lng?: number
  ) => {
    onChange(location);
    if (lat && lng && onCoordinatesChange) {
      onCoordinatesChange(lat, lng);
    }
    setIsMapOpen(false);
  };

  const toggleInputMode = () => {
    if (inputMode === "manual") {
      setIsMapOpen(true);
      setInputMode("map");
    } else {
      setInputMode("manual");
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder || t("locationPlaceholder")}
            className={className}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleInputMode}
          disabled={disabled}
          title={
            inputMode === "manual"
              ? t("selectFromMap") || "Select from map"
              : t("enterManually") || "Enter manually"
          }
        >
          {inputMode === "manual" ? (
            <Map className="h-4 w-4" />
          ) : (
            <Keyboard className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {t("selectLocationTitle") || "Select Location"}
            </DialogTitle>
            <DialogDescription>
              {t("selectLocationDescription") ||
                "Search for a location or click on the map to select the project location."}
            </DialogDescription>
          </DialogHeader>
          <GoogleMapLocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={value}
          />
        </DialogContent>
      </Dialog>

      {inputMode === "map" && value && (
        <p className="text-xs text-muted-foreground">
          {t("locationFromMap") || "Location selected from map"}
        </p>
      )}
    </div>
  );
};
