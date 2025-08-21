import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export * from "./roleSpecificData";
export * from "./signupHelpers";
export * from "./validation";
export * from "./individualHelpers";
export * from "./IsValidPhoneNumber";
