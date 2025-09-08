import type { RegistrationRole } from "../types/auth";

export const roleFlows: Record<RegistrationRole, string[]> = {
  individual: ["authMethod", "personalInfo", "verification", "complete"],
  organization: [
    "authMethod",
    "personalInfo",
    "verification",
    "documentUpload",
    "complete",
  ],
  supplier: ["authMethod", "personalInfo", "verification"],
  freelance_engineer: ["authMethod", "personalInfo", "verification"],
  engineering_office: ["authMethod", "personalInfo", "verification"],
  contractor: ["authMethod", "personalInfo", "verification"],
};
