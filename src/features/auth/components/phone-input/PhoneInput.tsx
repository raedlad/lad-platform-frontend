"use client";

import PhoneInputComponent from "react-phone-number-input";
import { Input } from "@shared/components/ui/input";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";
import { FlagComponent } from "./Flags";
import { CustomInputProps } from "@auth/types/auth";
import { PhoneInputProps } from "@auth/types/auth";
import { Country } from "react-phone-number-input";

const CustomInput = ({ className, ...props }: CustomInputProps) => (
  <Input
    dir="ltr"
    className={cn("rounded-l-none", "flex-1", className)}
    {...props}
  />
);

export const PhoneInput = (props: PhoneInputProps) => (
  <div dir="ltr" className="h-full w-full">
    <PhoneInputComponent
      international
      className="flex flex-row h-full"
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={CustomInput}
      smartCaret={false}
      defaultCountry={"SA" as Country}
      {...props}
    />
  </div>
);
