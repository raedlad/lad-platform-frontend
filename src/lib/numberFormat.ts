/**
 * Utility functions for number formatting
 */

/**
 * Formats a number with commas for display
 * @param value - The number to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: number | string): string => {
  if (value === null || value === undefined || value === "") return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";

  return numValue.toLocaleString("en-US");
};

/**
 * Removes commas from a formatted number string
 * @param formattedValue - The formatted string with commas
 * @returns Clean numeric string
 */
export const removeCommasFromNumber = (formattedValue: string): string => {
  return formattedValue.replace(/,/g, "");
};

/**
 * Converts a formatted string back to a number
 * @param formattedValue - The formatted string with commas
 * @returns The numeric value
 */
export const parseFormattedNumber = (formattedValue: string): number => {
  const cleanValue = removeCommasFromNumber(formattedValue);
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
};
