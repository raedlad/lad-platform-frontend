"use client";

import { type FlagProps } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

export const FlagComponent = ({ country, countryName }: FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
