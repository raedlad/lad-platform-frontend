import { roleFlows } from "./roleFlows";
import type { RegistrationRole } from "../types/auth";

export const roleFlowMeta: Record<
  RegistrationRole,
  {
    key: string;
    showInUI: boolean;
    label: string;
    icon: string;
    description: string;
  }[]
> = {
  individual: [
    {
      key: "personalInfo",
      showInUI: true,
      label: "المعلومات الشخصية",
      icon: "👤",
      description: "أدخل معلوماتك الشخصية",
    },
    {
      key: "verification",
      showInUI: false,
      label: "التحقق",
      icon: "✅",
      description: "تحقق من حسابك",
    },
  ],
  organization: [
    {
      key: "personalInfo",
      showInUI: true,
      label: "المعلومات الشخصية",
      icon: "👤",
      description: "أدخل معلوماتك الشخصية",
    },
    {
      key: "verification",
      showInUI: false,
      label: "التحقق",
      icon: "✅",
      description: "تحقق من حسابك",
    },
  ],
  supplier: [
    {
      key: "personalInfo",
      showInUI: true,
      label: "المعلومات الشخصية",
      icon: "👤",
      description: "أدخل معلوماتك الشخصية",
    },
    {
      key: "verification",
      showInUI: false,
      label: "التحقق",
      icon: "✅",
      description: "تحقق من حسابك",
    },
  ],
  freelance_engineer: [
    {
      key: "personalInfo",
      showInUI: true,
      label: "المعلومات الشخصية",
      icon: "👤",
      description: "أدخل معلوماتك الشخصية",
    },
    {
      key: "verification",
      showInUI: false,
      label: "التحقق",
      icon: "✅",
      description: "تحقق من حسابك",
    },
  ],
  engineering_office: [
    {
      key: "personalInfo",
      showInUI: true,
      label: "المعلومات الشخصية",
      icon: "👤",
      description: "أدخل معلوماتك الشخصية",
    },
    {
      key: "verification",
      showInUI: false,
      label: "التحقق",
      icon: "✅",
      description: "تحقق من حسابك",
    },
  ],
  contractor: [
    {
      key: "personalInfo",
      showInUI: true,
      label: "المعلومات الشخصية",
      icon: "👤",
      description: "أدخل معلوماتك الشخصية",
    },
    {
      key: "verification",
      showInUI: false,
      label: "التحقق",
      icon: "✅",
      description: "تحقق من حسابك",
    },
  ],
};
