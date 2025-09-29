import React from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import {
  IndividualProfilePersonalInfo,
  IndividualProfile,
} from "@/features/profile/types/individual";

interface PersonalInfoProps {
  personalInfo?: IndividualProfilePersonalInfo | null;
  profile?: IndividualProfile | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  profile,
}) => {
  const t = useTranslations("profile.tabs");
  const tCommon = useTranslations("common");
  const { user } = useAuthStore();
  const { countries } = useGetCountries();
  // Helper function to get user display name from profile data
  const getUserDisplayName = () => {
    if (personalInfo?.first_name && personalInfo?.last_name) {
      return `${personalInfo.first_name} ${personalInfo.last_name}`;
    }
    if (profile?.full_name) return profile.full_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (user?.name) return user.name;
    return tCommon("defaultUser");
  };

  // Helper function to get user phone
  const getUserPhone = () => {
    return user?.phone || "";
  };

  // Helper function to get country name
  const getCountryName = () => {
    const countryId =
      personalInfo?.country_id || profile?.country_id || user?.country_id;
    if (countryId) {
      return (
        countries.find((country) => country.id === countryId)?.name ||
        t("notProvided")
      );
    }
    return t("notProvided");
  };

  // Helper function to get city name
  const getCityName = () => {
    const cityId = personalInfo?.city_id || profile?.city_id;
    if (cityId && profile?.city_name) {
      return profile.city_name;
    }
    return t("notProvided");
  };

  // Helper function to get state name
  const getStateName = () => {
    const stateId = personalInfo?.state_id || profile?.state_id;
    if (stateId && profile?.state_name) {
      return profile.state_name;
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
              {t("fields.fullName")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getUserDisplayName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.phoneNumber")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getUserPhone()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.email")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {user?.email || t("notProvided")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.nationalId")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {personalInfo?.national_id ||
                profile?.national_id ||
                t("notProvided")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.country")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getCountryName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.state")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getStateName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.city")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {getCityName()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.address")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {personalInfo?.detailed_address ||
                profile?.detailed_address ||
                t("notProvided")}
            </p>
          </div>
        </div>
        {(personalInfo?.about_me || profile?.about_me) && (
          <div className="mt-4">
            <label className="text-sm font-medium text-muted-foreground dark:text-muted-foreground">
              {t("fields.aboutMe")}
            </label>
            <p className="text-sm text-card-foreground mt-1 dark:text-card-foreground">
              {personalInfo?.about_me || profile?.about_me}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
