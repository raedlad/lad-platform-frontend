import React from "react";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { EngineeringOfficeProfileProfessionalInfo } from "@/features/profile/types/engineeringOffice";

interface ProfessionalInfoProfile {
  experience_years_range_id?: number | null;
  staff_size_range_id?: number | null;
  annual_projects_range_id?: number | null;
  has_government_accreditation?: boolean;
  classification_file?: File | null;
  custom_name?: string;
  description?: string;
  expiry_date?: string;
  specializations?: Array<{
    engineering_specialization_id: number;
    other_specialization?: string;
    specialization_notes?: string;
    is_primary_specialization?: boolean;
    expertise_level?: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
  geographical_coverage?: Array<{
    country_code: string;
    state_id: string;
    city_id: number;
    notes?: string;
  }>;
  experience_years_range?: { label: string };
  staff_size_range?: { label: string };
  annual_projects_range?: { label: string };
  country_name?: string;
  city_name?: string;
  state_name?: string;
}

interface ProfessionalInfoProps {
  professionalInfo?: EngineeringOfficeProfileProfessionalInfo | null;
  profile?: ProfessionalInfoProfile | null;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  professionalInfo,
  profile,
}) => {
  const t = useTranslations("profile.engineeringOffice.professionalInfo");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  // Get profile data from store
  const { engineeringOfficePersonalInfo } = usePersonalInfoStore();

  // Use props if provided, otherwise fall back to store data
  const currentProfessionalInfo = professionalInfo || null;
  const currentProfile = profile || null;

  // Debug logging to see what data we have
  console.log("ProfessionalInfo Debug:", {
    professionalInfo,
    profile,
    engineeringOfficePersonalInfo,
    currentProfessionalInfo,
    currentProfile,
  });

  // Helper function to get experience years range
  const getExperienceYearsRange = () => {
    const experienceYearsRange =
      currentProfessionalInfo?.experience_years_range_id ||
      currentProfile?.experience_years_range_id;
    if (profile?.experience_years_range?.label) {
      return profile.experience_years_range.label;
    }
    return experienceYearsRange
      ? experienceYearsRange.toString()
      : tCommon("notProvided");
  };

  // Helper function to get staff size range
  const getStaffSizeRange = () => {
    const staffSizeRange =
      currentProfessionalInfo?.staff_size_range_id ||
      currentProfile?.staff_size_range_id;
    if (profile?.staff_size_range?.label) {
      return profile.staff_size_range.label;
    }
    return staffSizeRange ? staffSizeRange.toString() : tCommon("notProvided");
  };

  // Helper function to get annual projects range
  const getAnnualProjectsRange = () => {
    const annualProjectsRange =
      currentProfessionalInfo?.annual_projects_range_id ||
      currentProfile?.annual_projects_range_id;
    if (profile?.annual_projects_range?.label) {
      return profile.annual_projects_range.label;
    }
    return annualProjectsRange
      ? annualProjectsRange.toString()
      : tCommon("notProvided");
  };

  // Helper function to get government accreditation status
  const getGovernmentAccreditation = () => {
    const hasAccreditation =
      currentProfessionalInfo?.has_government_accreditation ??
      currentProfile?.has_government_accreditation;
    if (hasAccreditation === null || hasAccreditation === undefined) {
      return tCommon("notProvided");
    }
    return hasAccreditation ? tCommon("yes") : tCommon("no");
  };

  // Helper function to get classification file
  const getClassificationFile = () => {
    const classificationFile =
      currentProfessionalInfo?.classification_file ||
      currentProfile?.classification_file;
    if (classificationFile) {
      return classificationFile instanceof File
        ? classificationFile.name
        : t("classificationFile");
    }
    return tCommon("notProvided");
  };

  // Helper function to get specializations
  const getSpecializations = () => {
    const specializations =
      currentProfessionalInfo?.specializations ||
      currentProfile?.specializations;
    if (specializations && specializations.length > 0) {
      return specializations
        .map(
          (spec) =>
            spec.other_specialization ||
            `Specialization ${spec.engineering_specialization_id}`
        )
        .join(", ");
    }
    return tCommon("notProvided");
  };

  // Helper function to get geographical coverage
  const getGeographicalCoverage = () => {
    const coverage =
      currentProfessionalInfo?.geographical_coverage ||
      currentProfile?.geographical_coverage;
    if (coverage && coverage.length > 0) {
      return coverage
        .map((cov) => {
          const country = countries.find(
            (c) => c.id.toString() === cov.country_code
          );
          const countryName = country?.name || cov.country_code;
          return `${countryName}${cov.notes ? ` (${cov.notes})` : ""}`;
        })
        .join(", ");
    }
    return tCommon("notProvided");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
        <h3 className="text-lg font-semibold mb-4">{t("title")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("experienceYearsRange")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getExperienceYearsRange()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("staffSizeRange")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getStaffSizeRange()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("annualProjectsRange")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getAnnualProjectsRange()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("hasGovernmentAccreditation")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getGovernmentAccreditation()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("classificationFile")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getClassificationFile()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("specializations")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getSpecializations()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("geographicalCoverage")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getGeographicalCoverage()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
