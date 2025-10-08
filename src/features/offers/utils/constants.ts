import { OfferStatus } from "../types";

export const OFFER_STATUSES: OfferStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "withdrawn",
  "counter_offer",
  "expired",
];

export const CURRENCIES = [
  { value: "SAR", label: "Saudi Riyal (SAR)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
];

export const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Renovation",
  "Maintenance",
];

export const DURATION_UNITS = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
];

export const SORT_OPTIONS = [
  { value: "submittedAt", label: "Submission Date" },
  { value: "amount", label: "Amount" },
  { value: "status", label: "Status" },
  { value: "projectTitle", label: "Project Title" },
];

export const SORT_DIRECTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

export const PAGINATION_LIMITS = [10, 25, 50, 100];

export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
