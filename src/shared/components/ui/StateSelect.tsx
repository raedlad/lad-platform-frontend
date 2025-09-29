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
import { useGetStates } from "@/shared/hooks/globalHooks";

import { State } from "@/types/globalTypes";

interface StateSelectProps {
  onStateChange?: (stateCode: string) => void;
  selectedState?: string;
  countryCode: string | null;
  disabled?: boolean;
  className?: string;
  enableSearch?: boolean;
  placeholder?: string;
  label?: string;
  onBlur?: () => void;
}

export const StateSelection: React.FC<StateSelectProps> = ({
  onStateChange,
  selectedState,
  countryCode,
  disabled = false,
  className = "",
  enableSearch = true,
  placeholder,
  label,
  onBlur,
}) => {
  const t = useTranslations();
  const { states } = useGetStates(countryCode);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateSearchOpen, setStateSearchOpen] = useState(false);

  // Update loading state based on states data
  React.useEffect(() => {
    if (states && states.length > 0) {
      setIsLoading(false);
    } else if (countryCode && states.length === 0) {
      setIsLoading(false);
    } else if (!countryCode) {
      // No country selected, not loading
      setIsLoading(false);
    }
  }, [states, countryCode]);

  const handleStateChange = useCallback(
    (stateCode: string) => {
      onStateChange?.(stateCode);
    },
    [onStateChange]
  );

  const selectedStateName = useMemo(
    () => states?.find((state) => state.id.toString() === selectedState)?.name,
    [states, selectedState]
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
    onBlur,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    placeholder: string;
    label: string;
    data: State[];
    onSelect: (value: string) => void;
    selectedValue?: string;
    disabled?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    onClear?: () => void;
    onBlur?: () => void;
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
          item.id.toString().includes(searchTerm)
      );
    }, [data, searchValue]);

    // Don't render if data is empty and we're still loading
    if (data.length === 0 && isLoading) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="text-design-main p-1" />}
            <label className="text-sm font-medium">{label}</label>
          </div>
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {countryCode
                ? t("common.ui.loadingStates")
                : t("common.ui.selectCountryFirst")}
            </span>
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
      (item: State) => {
        // Clear any pending blur timeout to prevent interference
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = null;
        }
        onSelect(item.id.toString());
        setOpen(false);
        setSearchValue("");
        setLocalFocusedIndex(-1);
        // Trigger validation when item is selected
        onBlur?.();
      },
      [onSelect, setOpen, setSearchValue, onBlur]
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
        onBlur?.();
      }, 200);
    }, [setOpen, setSearchValue, onBlur]);

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
          // Trigger validation when popover closes
          onBlur?.();
        }
      },
      [setOpen, setSearchValue, onBlur]
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
          {Icon && <Icon className="text-design-main p-1" />}
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
                  placeholder={t("common.ui.searchState")}
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
                      ? t("common.ui.noStateFound")
                      : t("common.ui.noStatesAvailable")}
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
                            {item.id}
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

  if (error && states.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="text-design-main p-1" />
          <label className="text-sm font-medium">
            {label || t("common.select.state")}
          </label>
        </div>
        <div className="flex h-10 w-full items-center justify-center rounded-md border border-destructive bg-destructive/10 px-3 py-2 text-sm">
          <span className="text-destructive">Error loading states</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* State Select */}
      {enableSearch ? (
        <SearchableSelect
          open={stateSearchOpen}
          setOpen={setStateSearchOpen}
          placeholder={
            placeholder ||
            (states && states.length > 0
              ? t("common.ui.selectState")
              : countryCode
              ? t("common.ui.loadingStates")
              : t("common.ui.selectCountryFirst"))
          }
          label={label || t("common.ui.selectState")}
          data={states || []}
          onSelect={handleStateChange}
          selectedValue={selectedState}
          disabled={
            disabled || isLoading || !countryCode || states.length === 0
          }
          icon={MapPin}
          onClear={() => {
            handleStateChange("");
            onBlur?.();
          }}
          onBlur={onBlur}
        />
      ) : (
        <div key="state-select" className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="text-design-main p-1" />
            <label className="text-sm font-medium">
              {label || t("common.ui.selectState")}
            </label>
          </div>
          <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              {states && states.length > 0
                ? placeholder || t("common.ui.selectState")
                : countryCode
                ? t("common.ui.loadingStates")
                : t("common.ui.selectCountryFirst")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

StateSelection.displayName = "StateSelect";

export default StateSelection;
