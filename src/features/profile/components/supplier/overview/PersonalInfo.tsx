import React from "react";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { SupplierProfilePersonalInfo } from "@/features/profile/types/supplier";

interface PersonalInfoProps {
  personalInfo?: SupplierProfilePersonalInfo | null;
  profile?:
    | (SupplierProfilePersonalInfo & {
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
  const t = useTranslations("profile.supplier.personalInfo");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  // Get profile data from store
  const { supplierPersonalInfo } = usePersonalInfoStore();

  // Use props if provided, otherwise fall back to store data
  const currentPersonalInfo = personalInfo || supplierPersonalInfo;
  const currentProfile = profile || supplierPersonalInfo;

  // Debug logging to see what data we have
  console.log("PersonalInfo Debug:", {
    personalInfo,
    profile,
    supplierPersonalInfo,
    currentPersonalInfo,
    currentProfile,
  });

  // Helper function to get company name
  const getCompanyName = () => {
    return (
      currentPersonalInfo?.company_name ||
      currentProfile?.company_name ||
      tCommon("notProvided")
    );
  };

  // Helper function to get commercial registration number
  const getCommercialRegistrationNumber = () => {
    return (
      currentPersonalInfo?.commercial_registration_number ||
      currentProfile?.commercial_registration_number ||
      tCommon("notProvided")
    );
  };

  // Helper function to get authorized person name
  const getAuthorizedPersonName = () => {
    return (
      currentPersonalInfo?.authorized_person_name ||
      currentProfile?.authorized_person_name ||
      tCommon("notProvided")
    );
  };

  // Helper function to get phone number
  const getPhoneNumber = () => {
    return (
      currentPersonalInfo?.authorized_person_phone ||
      currentProfile?.authorized_person_phone ||
      tCommon("notProvided")
    );
  };

  // Helper function to get email
  const getEmail = () => {
    return (
      currentPersonalInfo?.representative_email ||
      currentProfile?.representative_email ||
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

  // Helper function to get delegation form
  const getDelegationForm = () => {
    const delegationForm =
      currentPersonalInfo?.delegation_form || currentProfile?.delegation_form;
    if (delegationForm) {
      return delegationForm instanceof File
        ? delegationForm.name
        : "File uploaded";
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
              {t("companyName")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getCompanyName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("commercialRegistrationNumber")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getCommercialRegistrationNumber()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("authorizedPersonName")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getAuthorizedPersonName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("phoneNumber")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getPhoneNumber()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("email")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getEmail()}
            </p>
          </div>
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
            {t("delegationForm")}
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
            {getDelegationForm()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
