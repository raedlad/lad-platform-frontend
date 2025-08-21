import {
  type Country,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";

// Cache the country list for better performance
let cachedCountryList: Array<{
  value: Country;
  label: string;
  callingCode: string;
}> | null = null;

// ✅ Generate country list with names (cached for performance)
export const getCountryList = () => {
  if (cachedCountryList) {
    return cachedCountryList;
  }

  const countries = getCountries();
  cachedCountryList = countries.map((c) => ({
    value: c,
    label: new Intl.DisplayNames(["en"], { type: "region" }).of(c) || c,
    callingCode: getCountryCallingCode(c) || "",
  }));

  return cachedCountryList;
};

// ✅ Validation helper
export { isValidPhoneNumber };
