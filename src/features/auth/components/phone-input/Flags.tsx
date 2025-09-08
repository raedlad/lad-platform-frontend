"use client";

import { type FlagProps } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

export const FlagComponent = ({ country, countryName }: FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="   rounded-l-none">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
