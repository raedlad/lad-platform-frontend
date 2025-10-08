"use client";

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, parse, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  className,
  error,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [validationError, setValidationError] = React.useState<
    string | undefined
  >();

  // Format date as YYYY-MM-DD for HTML input compatibility
  const formatDateForInput = (date: Date): string => {
    try {
      return format(date, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  // Validate date string (YYYY-MM-DD format)
  const validateDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Check format: YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return null;
    }

    try {
      const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      return null;
    }

    return null;
  };

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    setValidationError(undefined);

    // Try to parse as we type
    if (inputVal) {
      const parsedDate = validateDateString(inputVal);
      if (parsedDate) {
        onChange?.(parsedDate);
      } else {
        // Clear the date if invalid
        onChange?.(undefined);
      }
    } else {
      onChange?.(undefined);
    }
  };

  // Handle input blur to validate the date
  const handleInputBlur = () => {
    if (inputValue && inputValue.trim() !== "") {
      const parsedDate = validateDateString(inputValue);
      if (!parsedDate) {
        setValidationError("Invalid date format. Use YYYY-MM-DD");
      } else {
        setValidationError(undefined);
      }
    } else {
      setValidationError(undefined);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputBlur();
      setOpen(!open);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Handle calendar date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = formatDateForInput(selectedDate);
      setInputValue(formattedDate);
      onChange?.(selectedDate);
      setValidationError(undefined);
    }
    setOpen(false);
  };

  // Handle clear button
  const handleClear = () => {
    setInputValue("");
    onChange?.(undefined);
    setValidationError(undefined);
  };

  // Update input value when external value changes
  React.useEffect(() => {
    if (value) {
      setInputValue(formatDateForInput(value));
      setValidationError(undefined);
    } else {
      setInputValue("");
    }
  }, [value]);

  // Generate unique IDs for accessibility
  const inputId = id || `date-picker-${React.useId()}`;
  const errorId = `${inputId}-error`;
  const labelId = `${inputId}-label`;

  const showError = validationError || error;
  const hasValue = inputValue && inputValue.trim() !== "";

  return (
    <div className="space-y-2">
      {label && (
        <Label id={labelId} htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-20",
            showError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          aria-invalid={!!showError}
          aria-describedby={showError ? errorId : undefined}
          aria-labelledby={label ? labelId : undefined}
          autoComplete="off"
        />

        {/* Clear Button */}
        {hasValue && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-8 top-0 h-full px-2 py-2 hover:bg-transparent"
            onClick={handleClear}
            aria-label="Clear date"
          >
            <X
              className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-hidden="true"
            />
          </Button>
        )}

        {/* Calendar Button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              disabled={disabled}
              onClick={() => setOpen(!open)}
              aria-label="Open calendar"
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <CalendarIcon
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
            role="dialog"
            aria-label="Calendar"
          >
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Error Message */}
      {showError && (
        <p
          id={errorId}
          className="text-sm text-red-500 dark:text-red-400"
          role="alert"
        >
          {showError}
        </p>
      )}
    </div>
  );
}
