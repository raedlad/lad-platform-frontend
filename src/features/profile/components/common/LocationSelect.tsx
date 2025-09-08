"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import {
  Country,
  State,
  City,
} from "@/features/profile/services/personalInfoApi";

interface LocationSelectProps {
  onCountryChange?: (countryCode: string) => void;
  onStateChange?: (stateCode: string) => void;
  onCityChange?: (cityCode: string) => void;
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
  disabled?: boolean;
  className?: string;
  enableSearch?: boolean;
}

export const LocationSelect: React.FC<LocationSelectProps> = React.memo(
  ({
    onCountryChange,
    onStateChange,
    onCityChange,
    selectedCountry,
    selectedState,
    selectedCity,
    disabled = false,
    className = "",
    enableSearch = true,
  }) => {
    const t = useTranslations();

    // Use selectors to prevent unnecessary re-renders
    const countries = usePersonalInfoStore((state) => state.countries);
    const states = usePersonalInfoStore((state) => state.states);
    const cities = usePersonalInfoStore((state) => state.cities);
    const isLoading = usePersonalInfoStore((state) => state.isLoading);
    const loadCountries = usePersonalInfoStore((state) => state.loadCountries);
    const loadStates = usePersonalInfoStore((state) => state.loadStates);
    const loadCities = usePersonalInfoStore((state) => state.loadCities);
    const setSelectedState = usePersonalInfoStore(
      (state) => state.setSelectedState
    );
    const setSelectedCity = usePersonalInfoStore(
      (state) => state.setSelectedCity
    );

    // Search state - moved to individual SearchableSelect components
    const [countrySearchOpen, setCountrySearchOpen] = useState(false);
    const [stateSearchOpen, setStateSearchOpen] = useState(false);
    const [citySearchOpen, setCitySearchOpen] = useState(false);

    // Track if countries have been loaded to prevent multiple API calls
    const countriesLoadedRef = React.useRef(false);

    // Load countries on mount - only once
    useEffect(() => {
      if (
        !countriesLoadedRef.current &&
        (!countries || countries.length === 0)
      ) {
        countriesLoadedRef.current = true;
        loadCountries();
      }
    }, []); // Only run once on mount

    // Load cities directly if no states are available
    useEffect(() => {
      if (
        selectedCountry &&
        states &&
        states.length === 0 &&
        (!cities || cities.length === 0)
      ) {
        loadCities(selectedCountry);
      }
    }, [selectedCountry, states?.length, cities?.length, loadCities]); // Use length instead of full arrays

    const handleCountryChange = useCallback(
      (countryCode: string) => {
        onCountryChange?.(countryCode);
        // Clear states and cities when country changes
        setSelectedState(null);
        setSelectedCity(null);
        loadStates(countryCode);
      },
      [onCountryChange, setSelectedState, setSelectedCity, loadStates]
    );

    const handleStateChange = useCallback(
      (stateCode: string) => {
        onStateChange?.(stateCode);
        // Clear cities when state changes
        setSelectedCity(null);
        if (selectedCountry) {
          loadCities(selectedCountry, stateCode);
        }
      },
      [onStateChange, setSelectedCity, selectedCountry, loadCities]
    );

    const handleCityChange = useCallback(
      (cityCode: string) => {
        onCityChange?.(cityCode);
      },
      [onCityChange]
    );

    const selectedCountryName = useMemo(
      () =>
        countries?.find((country) => country.iso2 === selectedCountry)?.name,
      [countries, selectedCountry]
    );

    const selectedStateName = useMemo(
      () =>
        states?.find((state) => state.id.toString() === selectedState)?.name,
      [states, selectedState]
    );

    const selectedCityName = useMemo(
      () => cities?.find((city) => city.id.toString() === selectedCity)?.name,
      [cities, selectedCity]
    );

    // Searchable Select Component
    const SearchableSelect = React.memo(
      ({
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
        data: Array<{ id: string | number; name: string; iso2?: string }>;
        onSelect: (value: string) => void;
        selectedValue?: string;
        disabled?: boolean;
        icon: React.ComponentType<{ className?: string }>;
        onClear?: () => void;
      }) => {
        // Internal search state - prevents parent re-renders
        const [searchValue, setSearchValue] = useState("");

        // Don't render if data is empty and we're still loading
        if (data.length === 0 && isLoading) {
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="text-muted-foreground/50 p-1" />
                <label className="text-sm font-medium">{label}</label>
              </div>
              <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          );
        }

        const selectedItem = data.find(
          (item) => (item.iso2 || item.id.toString()) === selectedValue
        );
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
                  onSelect(item.iso2 || item.id.toString());
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
          [
            open,
            filteredData,
            localFocusedIndex,
            onSelect,
            setOpen,
            setSearchValue,
          ]
        );

        const handleItemClick = React.useCallback(
          (item: { id: string | number; name: string; iso2?: string }) => {
            onSelect(item.iso2 || item.id.toString());
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
          }, 150);
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
              <Icon className="text-muted-foreground/50 p-1" />
              <label className="text-sm font-medium">{label}</label>
            </div>
            <Popover open={open} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
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
                            key={item.iso2 || item.id}
                            onClick={() => handleItemClick(item)}
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
      }
    );

    return (
      <div className={`space-y-4 ${className}`}>
        {/* Country Select */}
        {enableSearch ? (
          <SearchableSelect
            open={countrySearchOpen}
            setOpen={setCountrySearchOpen}
            placeholder={t("common.select.country")}
            label={t("profile.contractor.personalInfo.country")}
            data={countries || []}
            onSelect={handleCountryChange}
            selectedValue={selectedCountry}
            disabled={disabled}
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
                {t("profile.contractor.personalInfo.country")}
              </label>
            </div>
            <Select
              value={selectedCountry || ""}
              onValueChange={handleCountryChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("common.select.country")} />
              </SelectTrigger>
              <SelectContent>
                {countries?.map((country) => (
                  <SelectItem key={country.iso2} value={country.iso2}>
                    {country.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* State Select - Show if country is selected */}
        {selectedCountry &&
          (enableSearch ? (
            <SearchableSelect
              open={stateSearchOpen}
              setOpen={setStateSearchOpen}
              placeholder={
                states && states.length > 0
                  ? t("common.select.state")
                  : "Loading states..."
              }
              label={t("profile.contractor.personalInfo.state")}
              data={states || []}
              onSelect={handleStateChange}
              selectedValue={selectedState}
              disabled={disabled || !states || states.length === 0}
              icon={MapPin}
              onClear={() => {
                handleStateChange("");
              }}
            />
          ) : (
            <div key="state-select" className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground/50 p-1" />
                <label className="text-sm font-medium">
                  {t("profile.contractor.personalInfo.state")}
                </label>
              </div>
              <Select
                value={selectedState || ""}
                onValueChange={handleStateChange}
                disabled={disabled || !states || states.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      states && states.length > 0
                        ? t("common.select.state")
                        : "Loading states..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>
          ))}

        {/* City Select - Show if country is selected */}
        {selectedCountry &&
          (enableSearch ? (
            <SearchableSelect
              open={citySearchOpen}
              setOpen={setCitySearchOpen}
              placeholder={
                cities && cities.length > 0
                  ? t("common.select.city")
                  : "Loading cities..."
              }
              label={t("profile.contractor.personalInfo.city")}
              data={cities || []}
              onSelect={handleCityChange}
              selectedValue={selectedCity}
              disabled={disabled || !cities || cities.length === 0}
              icon={MapPin}
              onClear={() => {
                handleCityChange("");
              }}
            />
          ) : (
            <div key="city-select" className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground/50 p-1" />
                <label className="text-sm font-medium">
                  {t("profile.contractor.personalInfo.city")}
                </label>
              </div>
              <Select
                value={selectedCity || ""}
                onValueChange={handleCityChange}
                disabled={disabled || !cities || cities.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      cities && cities.length > 0
                        ? t("common.select.city")
                        : "Loading cities..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>
          ))}
      </div>
    );
  }
);

LocationSelect.displayName = "LocationSelect";

export default LocationSelect;
