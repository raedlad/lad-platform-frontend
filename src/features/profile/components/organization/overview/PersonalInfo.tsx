import React from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import {
  OrganizationProfilePersonalInfo,
  OrganizationProfile,
} from "@/features/profile/types/organization";

interface PersonalInfoProps {
  personalInfo?: OrganizationProfilePersonalInfo | null;
  profile?: OrganizationProfile | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  profile,
}) => {
  const t = useTranslations("profile.organization.personalInfo");
  const tCommon = useTranslations("common");
  const { user } = useAuthStore();
  const { countries } = useGetCountries();
  // Helper function to get representative name
  const getRepresentativeName = () => {
    return (
      personalInfo?.representative_name ||
      profile?.authorized_person_name ||
      tCommon("notProvided")
    );
  };

  // Helper function to get representative phone
  const getRepresentativePhone = () => {
    return (
      personalInfo?.representative_person_phone ||
      profile?.authorized_person_phone ||
      tCommon("notProvided")
    );
  };

  // Helper function to get representative email
  const getRepresentativeEmail = () => {
    return (
      personalInfo?.representative_person_email ||
      profile?.authorized_person_email ||
      tCommon("notProvided")
    );
  };

  // Helper function to get company name
  const getCompanyName = () => {
    return (
      personalInfo?.company_name ||
      profile?.company_name ||
      tCommon("notProvided")
    );
  };

  // Helper function to get commercial register number
  const getCommercialRegisterNumber = () => {
    return (
      personalInfo?.commercial_register_number ||
      profile?.commercial_register_number ||
      tCommon("notProvided")
    );
  };

  // Helper function to get country name
  const getCountryName = () => {
    const countryId = personalInfo?.country_id || profile?.country_id;
    if (countryId) {
      return (
        countries.find((country) => country.id === countryId)?.name ||
        profile?.country_name ||
        tCommon("notProvided")
      );
    }
    return profile?.country_name || tCommon("notProvided");
  };

  // Helper function to get city name
  const getCityName = () => {
    return personalInfo?.city_id || profile?.city_id
      ? profile?.city_name || tCommon("notProvided")
      : tCommon("notProvided");
  };

  // Helper function to get state name
  const getStateName = () => {
    return personalInfo?.state_id || profile?.state_id
      ? profile?.state_name || tCommon("notProvided")
      : tCommon("notProvided");
  };

  // Helper function to get detailed address
  const getDetailedAddress = () => {
    return (
      personalInfo?.detailed_address ||
      profile?.detailed_address ||
      tCommon("notProvided")
    );
  };

  // Helper function to get VAT number
  const getVatNumber = () => {
    return (
      personalInfo?.vat_number || profile?.vat_number || tCommon("notProvided")
    );
  };

  // Helper function to get about us
  const getAboutUs = () => {
    return (
      personalInfo?.about_us || profile?.about_us || tCommon("notProvided")
    );
  };

  // Helper function to get government accreditation status
  const getGovernmentAccreditation = () => {
    const hasAccreditation =
      personalInfo?.has_government_accreditation ||
      profile?.has_government_accreditation;
    if (hasAccreditation === null || hasAccreditation === undefined) {
      return tCommon("notProvided");
    }
    return hasAccreditation ? tCommon("yes") : tCommon("no");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {t("title")}
        </h3>
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
              {t("commercialRegisterNumber")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getCommercialRegisterNumber()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("representativeName")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getRepresentativeName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("representativePhone")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getRepresentativePhone()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("representativeEmail")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getRepresentativeEmail()}
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
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("vatNumber")}
            </label>
            <p className="text-sm text-card-foreground dark:text-card-foreground mt-1">
              {getVatNumber()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("country")}
            </label>
            <p className="text-sm text-card-foreground dark:text-card-foreground mt-1">
              {getCountryName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("state")}
            </label>
            <p className="text-sm text-card-foreground dark:text-card-foreground mt-1">
              {getStateName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("city")}
            </label>
            <p className="text-sm text-card-foreground dark:text-card-foreground mt-1">
              {getCityName()}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("detailedAddress")}
            </label>
            <p className="text-sm text-card-foreground dark:text-card-foreground mt-1">
              {getDetailedAddress()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t("aboutUs")}
          </label>
          <p className="text-sm text-card-foreground dark:text-card-foreground mt-1">
            {getAboutUs()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
