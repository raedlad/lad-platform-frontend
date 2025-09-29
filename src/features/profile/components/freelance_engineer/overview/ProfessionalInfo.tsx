import React from "react";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import {
  FreelanceEngineerProfessionalInfoType,
  FreelanceEngineerSpecialization,
  FreelanceEngineerGeographicalCoverage,
  FreelanceEngineerExperience,
} from "@/features/profile/types/freelanceEngineer";

interface ProfessionalInfoProfile {
  experience_years_range_id?: number;
  is_associated_with_office?: boolean;
  associated_office_name?: string;
  specializations?: FreelanceEngineerSpecialization[];
  geographical_coverage?: FreelanceEngineerGeographicalCoverage[];
  experiences?: FreelanceEngineerExperience[];
  experience_years_range?: { label: string };
  country_name?: string;
  city_name?: string;
  state_name?: string;
}

interface ProfessionalInfoProps {
  professionalInfo?: FreelanceEngineerProfessionalInfoType | null;
  profile?: ProfessionalInfoProfile | null;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  professionalInfo,
  profile,
}) => {
  const t = useTranslations("profile.freelanceEngineer.professionalInfo");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  // Get profile data from store
  const { freelanceEngineerPersonalInfo } = usePersonalInfoStore();

  // Use props if provided, otherwise fall back to store data
  const currentProfessionalInfo = professionalInfo || null;
  const currentProfile = profile || null;

  // Debug logging to see what data we have
  console.log("ProfessionalInfo Debug:", {
    professionalInfo,
    profile,
    freelanceEngineerPersonalInfo,
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

  // Helper function to get office association status
  const getOfficeAssociation = () => {
    const isAssociated =
      currentProfessionalInfo?.is_associated_with_office ??
      currentProfile?.is_associated_with_office;
    if (isAssociated === null || isAssociated === undefined) {
      return tCommon("notProvided");
    }
    return isAssociated ? tCommon("yes") : tCommon("no");
  };

  // Helper function to get associated office name
  const getAssociatedOfficeName = () => {
    return (
      currentProfessionalInfo?.associated_office_name ??
      currentProfile?.associated_office_name ??
      tCommon("notProvided")
    );
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

  // Helper function to get experiences
  const getExperiences = () => {
    const experiences =
      currentProfessionalInfo?.experiences || currentProfile?.experiences;
    if (experiences && experiences.length > 0) {
      return experiences
        .map(
          (exp) =>
            exp.other_specialization ||
            `Experience ${exp.engineering_specialization_id}`
        )
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
              {t("isAssociatedWithOffice")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getOfficeAssociation()}
            </p>
          </div>
          {(currentProfessionalInfo?.is_associated_with_office ?? false) ||
          (currentProfile?.is_associated_with_office ?? false) ? (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("associatedOfficeName")}
              </label>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {getAssociatedOfficeName()}
              </p>
            </div>
          ) : null}
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
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("experiences")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getExperiences()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
