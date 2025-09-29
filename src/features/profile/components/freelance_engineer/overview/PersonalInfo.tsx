import React from "react";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { FreelanceEngineerProfilePersonalInfo } from "@/features/profile/types/freelanceEngineer";

interface PersonalInfoProps {
  personalInfo?: FreelanceEngineerProfilePersonalInfo | null;
  profile?:
    | (FreelanceEngineerProfilePersonalInfo & {
        engineering_type?: { name: string };
        experience_years_range?: { label: string };
        country_name?: string;
        city_name?: string;
        state_name?: string;
      })
    | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  profile,
}) => {
  const t = useTranslations("profile.freelanceEngineer.personalInfo");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  // Get profile data from store
  const { freelanceEngineerPersonalInfo } = usePersonalInfoStore();

  // Use props if provided, otherwise fall back to store data
  const currentPersonalInfo = personalInfo || freelanceEngineerPersonalInfo;
  const currentProfile = profile || freelanceEngineerPersonalInfo;

  // Debug logging to see what data we have
  console.log("PersonalInfo Debug:", {
    personalInfo,
    profile,
    freelanceEngineerPersonalInfo,
    currentPersonalInfo,
    currentProfile,
  });

  // Helper function to get full name
  const getFullName = () => {
    return (
      currentPersonalInfo?.full_name ||
      currentProfile?.full_name ||
      tCommon("notProvided")
    );
  };

  // Helper function to get national ID
  const getNationalId = () => {
    return (
      currentPersonalInfo?.national_id ||
      currentProfile?.national_id ||
      tCommon("notProvided")
    );
  };

  // Helper function to get engineers association number
  const getEngineersAssociationNumber = () => {
    return (
      currentPersonalInfo?.engineers_association_number ||
      currentProfile?.engineers_association_number ||
      tCommon("notProvided")
    );
  };

  // Helper function to get engineering type
  const getEngineeringType = () => {
    const engineeringTypeId =
      currentPersonalInfo?.engineering_type_id ??
      currentProfile?.engineering_type_id;
    if (engineeringTypeId === null || engineeringTypeId === undefined) {
      return tCommon("notProvided");
    }
    // If we have the engineering_type object with name, use it
    if (profile?.engineering_type?.name) {
      return profile.engineering_type.name;
    }
    return engineeringTypeId;
  };

  // Helper function to get experience years range
  const getExperienceYearsRange = () => {
    const experienceYearsRangeId =
      currentPersonalInfo?.experience_years_range_id ??
      currentProfile?.experience_years_range_id;
    if (
      experienceYearsRangeId === null ||
      experienceYearsRangeId === undefined
    ) {
      return tCommon("notProvided");
    }
    // If we have the experience_years_range object with label, use it
    if (profile?.experience_years_range?.label) {
      return profile.experience_years_range.label;
    }
    return experienceYearsRangeId;
  };

  // Helper function to get office association status
  const getOfficeAssociation = () => {
    const isAssociated =
      currentPersonalInfo?.is_associated_with_office ??
      currentProfile?.is_associated_with_office;
    if (isAssociated === null || isAssociated === undefined) {
      return tCommon("notProvided");
    }
    return isAssociated ? tCommon("yes") : tCommon("no");
  };

  // Helper function to get associated office name
  const getAssociatedOfficeName = () => {
    return (
      currentPersonalInfo?.associated_office_name ??
      currentProfile?.associated_office_name ??
      tCommon("notProvided")
    );
  };

  // Helper function to get country name
  const getCountryName = () => {
    const countryId =
      currentPersonalInfo?.country_id ?? currentProfile?.country_id;
    if (countryId === null || countryId === undefined) {
      return profile?.country_name || tCommon("notProvided");
    }
    return (
      countries.find((country) => country.id === countryId)?.name ||
      profile?.country_name ||
      tCommon("notProvided")
    );
  };

  // Helper function to get city name
  const getCityName = () => {
    const cityId = currentPersonalInfo?.city_id ?? currentProfile?.city_id;
    if (cityId === null || cityId === undefined) {
      return profile?.city_name || tCommon("notProvided");
    }
    return profile?.city_name || tCommon("notProvided");
  };

  // Helper function to get state name
  const getStateName = () => {
    const stateId = currentPersonalInfo?.state_id ?? currentProfile?.state_id;
    if (stateId === null || stateId === undefined) {
      return profile?.state_name || tCommon("notProvided");
    }
    return profile?.state_name || tCommon("notProvided");
  };

  // Helper function to get about me
  const getAboutMe = () => {
    return (
      currentPersonalInfo?.about_me ||
      currentProfile?.about_me ||
      tCommon("notProvided")
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("fullName")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getFullName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("nationalId")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getNationalId()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("engineersAssociationNumber")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getEngineersAssociationNumber()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("engineeringType")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getEngineeringType()}
            </p>
          </div>
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
          {(currentPersonalInfo?.is_associated_with_office ?? false) ||
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
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("country")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getCountryName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("state")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getStateName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("city")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getCityName()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t("aboutMe")}
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
            {getAboutMe()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
