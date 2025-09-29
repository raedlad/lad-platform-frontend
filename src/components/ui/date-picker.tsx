"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "YYYY/MM/DD",
  disabled = false,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  // Convert string value to Date object
  const date = value ? new Date(value) : undefined;

  // Format date as YYYY-MM-DD for HTML input compatibility
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    onChange?.(inputVal);
  };

  // Handle input blur to validate the date
  const handleInputBlur = () => {
    if (inputValue) {
      // Try to parse the input as a date
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        // Only format if it's a valid date, but keep user's input format
        const formattedDate = formatDateForInput(date);
        onChange?.(formattedDate);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Format the date on Enter
      handleInputBlur();
      setOpen(!open);
    } else if (e.key === " ") {
      e.preventDefault();
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
      onChange?.(formattedDate);
    }
    setOpen(false);
  };

  // Update input value when external value changes
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Generate unique IDs for accessibility
  const inputId = id || `date-picker-${React.useId()}`;
  const calendarId = `${inputId}-calendar`;
  const buttonId = `${inputId}-button`;

  return (
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
        className={cn("pr-10", className)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? calendarId : undefined}
        role="combobox"
        autoComplete="off"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={buttonId}
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={disabled}
            onClick={() => setOpen(!open)}
            aria-label="Open calendar"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={open ? calendarId : undefined}
            type="button"
          >
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={calendarId}
          className="w-auto p-0"
          align="start"
          role="dialog"
          aria-label="Calendar"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
