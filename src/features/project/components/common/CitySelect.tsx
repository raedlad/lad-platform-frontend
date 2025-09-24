"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
// import { City } from "@/features/profile/services/personalInfoApi";

// Mock data for Saudi cities
const MOCK_SAUDI_CITIES = [
  { id: 1, name: "Riyadh" },
  { id: 2, name: "Jeddah" },
  { id: 3, name: "Mecca" },
  { id: 4, name: "Medina" },
  { id: 5, name: "Dammam" },
  { id: 6, name: "Khobar" },
  { id: 7, name: "Tabuk" },
  { id: 8, name: "Abha" },
  { id: 9, name: "Khamis Mushait" },
  { id: 10, name: "Najran" },
];

interface CitySelectProps {
  onCityChange?: (cityCode: string) => void;
  selectedCity?: string;
  selectedCountry?: string;
  selectedState?: string;
  disabled?: boolean;
  className?: string;
  enableSearch?: boolean;
  placeholder?: string;
  label?: string;
}

export const CitySelect: React.FC<CitySelectProps> = ({
  onCityChange,
  selectedCity,
  disabled = false,
  className = "",
  enableSearch = true,
  placeholder,
  label,
}) => {
  const t = useTranslations();

  // Use mock cities data instead of store
  const cities = MOCK_SAUDI_CITIES;
  const isLoading = false; // Never loading since we're using mock data

  // Search state
  const [citySearchOpen, setCitySearchOpen] = useState(false);

  // Disabled loadCities - using mock data instead
  // useEffect(() => {
  //   if (selectedCountry && (!cities || cities.length === 0)) {
  //     console.log(
  //       "🏙️ Loading cities for country:",
  //       selectedCountry,
  //       "state:",
  //       selectedState
  //     );
  //     loadCities(selectedCountry, selectedState);
  //   } else if (cities && cities.length > 0) {
  //     console.log("📦 Using cached cities from store");
  //   }
  // }, [selectedCountry, selectedState, loadCities, cities]);

  useEffect(() => {
    console.log("🏙️ Using mock Saudi cities data");
  }, []);

  const handleCityChange = useCallback(
    (cityCode: string) => {
      onCityChange?.(cityCode);
    },
    [onCityChange]
  );

  const selectedCityName = useMemo(
    () => cities?.find((city) => city.id.toString() === selectedCity)?.name,
    [cities, selectedCity]
  );

  // Searchable Select Component
  const SearchableSelect = ({
    open,
    setOpen,
    placeholder,
    label,
    data,
    onSelect,
    selectedValue,
    disabled,
    icon: Icon,
    onClear,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    placeholder: string;
    label: string;
    data: Array<{ id: string | number; name: string }>;
    onSelect: (value: string) => void;
    selectedValue?: string;
    disabled?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    onClear?: () => void;
  }) => {
    // Internal search state - prevents parent re-renders
    const [searchValue, setSearchValue] = useState("");
    const [localFocusedIndex, setLocalFocusedIndex] = useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    // Filtered data for search - internal to prevent parent re-renders
    const filteredData = useMemo(() => {
      if (!data) return [];
      if (!searchValue.trim()) return data;
      const searchTerm = searchValue.toLowerCase();
      return data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
    }, [data, searchValue]);

    // Don't render if data is empty and we're still loading
    if (data.length === 0 && isLoading) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-muted-foreground/50 p-1" />}
            <label className="text-sm font-medium">{label}</label>
          </div>
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      );
    }

    const selectedItem = data.find(
      (item) => item.id.toString() === selectedValue
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (!open) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setLocalFocusedIndex((prev) =>
              prev < filteredData.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setLocalFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredData.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (
              localFocusedIndex >= 0 &&
              localFocusedIndex < filteredData.length
            ) {
              const item = filteredData[localFocusedIndex];
              onSelect(item.id.toString());
              setOpen(false);
              setSearchValue("");
              setLocalFocusedIndex(-1);
            }
            break;
          case "Escape":
            e.preventDefault();
            setOpen(false);
            setSearchValue("");
            setLocalFocusedIndex(-1);
            break;
        }
      },
      [open, filteredData, localFocusedIndex, onSelect, setOpen, setSearchValue]
    );

    const handleItemClick = React.useCallback(
      (item: { id: string | number; name: string }) => {
        console.log("🏙️ City selected:", item.name, "ID:", item.id);
        // Clear any pending blur timeout to prevent interference
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = null;
        }
        onSelect(item.id.toString());
        setOpen(false);
        setSearchValue("");
        setLocalFocusedIndex(-1);
      },
      [onSelect, setOpen, setSearchValue]
    );

    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setLocalFocusedIndex(-1); // Reset focus when typing
      },
      [setSearchValue]
    );

    const handleInputFocus = React.useCallback(() => {
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    }, []);

    const handleInputBlur = React.useCallback(() => {
      blurTimeoutRef.current = setTimeout(() => {
        setOpen(false);
        setSearchValue("");
        setLocalFocusedIndex(-1);
      }, 200);
    }, [setOpen, setSearchValue]);

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (newOpen) {
          setOpen(true);
        } else {
          // Clear any pending blur timeout
          if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
          }
          setOpen(false);
          setSearchValue("");
          setLocalFocusedIndex(-1);
        }
      },
      [setOpen, setSearchValue]
    );

    // Reset focused index when filtered data changes
    React.useEffect(() => {
      setLocalFocusedIndex(-1);
    }, [filteredData]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-muted-foreground/50 p-1" />}
          <label className="text-sm font-medium">{label}</label>
        </div>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-full"
              disabled={disabled}
            >
              <span className="truncate">
                {selectedItem ? selectedItem.name : placeholder}
              </span>
              <div className="flex items-center gap-1">
                {selectedItem && onClear && (
                  <div
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear();
                    }}
                  >
                    <X className="h-3 w-3" />
                  </div>
                )}
                <Search className="h-4 w-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex flex-col" onKeyDown={handleKeyDown}>
              <div className="flex items-center gap-2 border-b px-3 py-2">
                <Search className="h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={inputRef}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchValue}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="flex h-8 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {filteredData.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {searchValue
                      ? `No ${label.toLowerCase()} found for "${searchValue}".`
                      : `No ${label.toLowerCase()} available.`}
                  </div>
                ) : (
                  <div className="p-1">
                    {filteredData.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                        className={`relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                          index === localFocusedIndex
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                      >
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* City Select */}
      {enableSearch ? (
        <SearchableSelect
          open={citySearchOpen}
          setOpen={setCitySearchOpen}
          placeholder={
            placeholder ||
            (cities && cities.length > 0
              ? t("common.select.city")
              : "Loading cities...")
          }
          label={label || t("profile.contractor.personalInfo.city")}
          data={cities || []}
          onSelect={handleCityChange}
          selectedValue={selectedCity}
          disabled={disabled || !cities || cities.length === 0}
          onClear={() => {
            handleCityChange("");
          }}
        />
      ) : (
        <div key="city-select" className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">
              {label || t("profile.contractor.personalInfo.city")}
            </label>
          </div>
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {cities && cities.length > 0
                ? placeholder || t("common.select.city")
                : "Loading cities..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

CitySelect.displayName = "CitySelect";

export default CitySelect;
