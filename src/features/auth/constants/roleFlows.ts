import type { RegistrationRole } from "../types/auth";

export const roleFlows: Record<RegistrationRole, string[]> = {
  individual: ["authMethod", "personalInfo", "verification", "complete"],
  institution: ["authMethod", "personalInfo", "verification", "documentUpload", "complete"],
  supplier: [
    "authMethod",
    "personalInfo",
    "verification",
  ],
  freelanceEngineer: [
    "authMethod",
    "personalInfo",
    "verification",
  ],
  engineeringOffice: [
    "authMethod",
    "personalInfo",
    "verification",
  ],
  contractor: [
    "authMethod",
    "personalInfo",
    "verification",
  ],
};
