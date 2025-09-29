import React from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import {
  ContractorProfilePersonalInfo,
  ContractorProfile,
} from "@/features/profile/types/contractor";

interface PersonalInfoProps {
  personalInfo?: ContractorProfilePersonalInfo | null;
  profile?: ContractorProfile | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  profile,
}) => {
  const t = useTranslations("profile.tabs");
  const tContractor = useTranslations("profile.contractor.personalInfo");
  const tCommon = useTranslations("common");
  const { user } = useAuthStore();
  const { countries } = useGetCountries();
  // Helper function to get user display name from profile data
  const getUserDisplayName = () => {
    if (personalInfo?.authorized_person_name) {
      return personalInfo.authorized_person_name;
    }
    if (profile?.authorized_person_name) return profile.authorized_person_name;
    if (profile?.company_name) return profile.company_name;
    if (user?.name) return user.name;
    return tCommon("defaultUser");
  };

  // Helper function to get user phone
  const getUserPhone = () => {
    return (
      personalInfo?.authorized_person_phone ||
      profile?.authorized_person_phone ||
      user?.phone ||
      ""
    );
  };

  // Helper function to get country name
  const getCountryName = () => {
    const countryName = personalInfo?.country_id || profile?.country_id;
    if (countryName) {
      return countryName;
    }
    return t("notProvided");
  };

  // Helper function to get city name
  const getCityName = () => {
    const cityName = personalInfo?.city_id || profile?.city_id;
    if (cityName) {
      return cityName;
    }
    return t("notProvided");
  };

  // Helper function to get state name
  const getStateName = () => {
    const stateName = personalInfo?.state_id || profile?.state_id;
    if (stateName) {
      return stateName;
    }
    return t("notProvided");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
        <h3 className="text-lg font-semibold mb-4 text-card-foreground dark:text-card-foreground">
          {t("personalData")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("companyName")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {personalInfo?.company_name ||
                profile?.company_name ||
                t("notProvided")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("authorizedPersonName")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getUserDisplayName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("phoneNumber")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getUserPhone()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("email")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {user?.email || t("notProvided")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("commercialRegistrationNumber")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {personalInfo?.commercial_registration_number ||
                profile?.commercial_registration_number ||
                t("notProvided")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("representativeEmail")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {personalInfo?.representative_email ||
                profile?.representative_email ||
                t("notProvided")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("country")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getCountryName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("state")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getStateName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {tContractor("city")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getCityName()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
