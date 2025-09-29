"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetCountries } from "@/shared/hooks/globalHooks";

interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phone_code: string;
  region: string;
  sub_region: string;
  full_location: string;
  is_active: boolean;
  sort_order: number;
  has_states: boolean;
  has_cities: boolean;
  created_at: string;
  updated_at: string;
}

interface CountrySelectProps {
  onCountryChange?: (countryCode: string) => void;
  selectedCountry?: string;
  disabled?: boolean;
  className?: string;
  enableSearch?: boolean;
  placeholder?: string;
  label?: string;
}

export const CountrySelection: React.FC<CountrySelectProps> = ({
  onCountryChange,
  selectedCountry,
  disabled = false,
  className = "",
  enableSearch = true,
  placeholder,
  label,
}) => {
  const t = useTranslations();
  const { countries } = useGetCountries();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);

  // Update loading state based on countries data
  React.useEffect(() => {
    if (countries && countries.length > 0) {
      setIsLoading(false);
    }
  }, [countries]);

  // Debug logging
  console.log("CountrySelection - countries:", countries);
  console.log("CountrySelection - countries.length:", countries?.length);
  console.log("CountrySelection - disabled:", disabled);
  console.log("CountrySelection - isLoading:", isLoading);

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      onCountryChange?.(countryCode);
    },
    [onCountryChange]
  );

  const selectedCountryName = useMemo(
    () => countries?.find((country) => country.iso2 === selectedCountry)?.name,
    [countries, selectedCountry]
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
    data: Country[];
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
      return data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.iso2.toLowerCase().includes(searchTerm) ||
          item.iso3.toLowerCase().includes(searchTerm)
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
            <span className="text-muted-foreground">
              {t("common.select.loading")}
            </span>
          </div>
        </div>
      );
    }

    const selectedItem = data.find((item) => item.iso2 === selectedValue);

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
              onSelect(item.iso2);
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
      (item: Country) => {
        console.log(
          "🌍 Country selected:",
          item.name,
          "ID:",
          item.id,
          "ISO2:",
          item.iso2
        );
        // Clear any pending blur timeout to prevent interference
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = null;
        }
        onSelect(item.iso2);
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
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">
                  {selectedItem ? selectedItem.name : placeholder}
                </span>
              </div>
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
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {item.iso2}
                          </span>
                        </div>
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

  if (error && countries.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground/50 p-1" />
          <label className="text-sm font-medium">
            {label || t("common.select.country")}
          </label>
        </div>
        <div className="flex h-10 w-full items-center justify-center rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm">
          <span className="text-destructive">Error loading countries</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Country Select */}
      {enableSearch ? (
        <SearchableSelect
          open={countrySearchOpen}
          setOpen={setCountrySearchOpen}
          placeholder={
            placeholder ||
            (countries && countries.length > 0
              ? t("common.select.country")
              : "Loading countries...")
          }
          label={label || t("common.select.country")}
          data={countries || []}
          onSelect={handleCountryChange}
          selectedValue={selectedCountry}
          disabled={disabled || isLoading || countries.length === 0}
          icon={MapPin}
          onClear={() => {
            handleCountryChange("");
          }}
        />
      ) : (
        <div key="country-select" className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="text-muted-foreground/50 p-1" />
            <label className="text-sm font-medium">
              {label || t("common.select.country")}
            </label>
          </div>
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {countries && countries.length > 0
                ? placeholder || t("common.select.country")
                : t("common.select.loading")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

CountrySelection.displayName = "CountrySelect";

export default CountrySelection;
