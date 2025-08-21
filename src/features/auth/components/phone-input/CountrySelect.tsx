"use client";

import * as React from "react";
import { ChevronsUpDown, CheckIcon } from "lucide-react";
import { type Country, getCountryCallingCode } from "react-phone-number-input";

import { Button } from "@shared/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { FlagComponent } from "./Flags";
import { getCountryList } from "@auth/utils";

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  onChange: (country: Country) => void;
};

export const CountrySelect = ({
  disabled,
  value: selectedCountry,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const countryList = React.useMemo(() => getCountryList(), []);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label="Select country"
          className="h-full flex gap-1 rounded-s-none "
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown className={cn("size-4 opacity-50")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label, callingCode }) =>
                  value ? (
                    <CommandItem
                      key={value}
                      className="gap-2"
                      onSelect={() => {
                        onChange(value);
                        setIsOpen(false);
                      }}
                    >
                      <FlagComponent country={value} countryName={label} />
                      <span className="flex-1 text-sm">{label}</span>
                      <span className="text-sm text-muted-foreground">
                        +{callingCode}
                      </span>
                      <CheckIcon
                        className={cn(
                          "ml-auto size-4",
                          value === selectedCountry
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
