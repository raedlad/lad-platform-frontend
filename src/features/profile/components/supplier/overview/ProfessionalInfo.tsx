import React from "react";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { SupplierOperationalCommercialInfo } from "@/features/profile/types/supplier";

interface ProfessionalInfoProfile extends SupplierOperationalCommercialInfo {
  supply_areas?: { name: string }[];
  service_coverage?: { name: string }[];
  years_of_experience?: { label: string };
  country_name?: string;
  city_name?: string;
  state_name?: string;
}

interface ProfessionalInfoProps {
  professionalInfo?: SupplierOperationalCommercialInfo | null;
  profile?: ProfessionalInfoProfile | null;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  professionalInfo,
  profile,
}) => {
  const t = useTranslations("profile.supplier.professionalInfo");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  // Get profile data from store
  const { supplierPersonalInfo } = usePersonalInfoStore();

  // Use props if provided, otherwise fall back to store data
  const currentProfessionalInfo = professionalInfo || null;
  const currentProfile = profile || null;

  // Debug logging to see what data we have
  console.log("ProfessionalInfo Debug:", {
    professionalInfo,
    profile,
    supplierPersonalInfo,
    currentProfessionalInfo,
    currentProfile,
  });

  // Helper function to get supply areas
  const getSupplyAreas = () => {
    const supplyAreas =
      currentProfessionalInfo?.supplyAreas || currentProfile?.supplyAreas;
    if (supplyAreas && supplyAreas.length > 0) {
      return supplyAreas.join(", ");
    }
    return tCommon("notProvided");
  };

  // Helper function to get service coverage
  const getServiceCoverage = () => {
    const serviceCoverage =
      currentProfessionalInfo?.serviceCoverage ||
      currentProfile?.serviceCoverage;
    if (serviceCoverage && serviceCoverage.length > 0) {
      return serviceCoverage.join(", ");
    }
    return tCommon("notProvided");
  };

  // Helper function to get years of experience
  const getYearsOfExperience = () => {
    const yearsOfExperience =
      currentProfessionalInfo?.yearsOfExperience ||
      currentProfile?.yearsOfExperience;
    if (yearsOfExperience) {
      return yearsOfExperience;
    }
    return tCommon("notProvided");
  };

  // Helper function to get government/private dealings status
  const getGovernmentPrivateDealings = () => {
    const hasDealings =
      currentProfessionalInfo?.governmentPrivateDealings ??
      currentProfile?.governmentPrivateDealings;
    if (hasDealings === null || hasDealings === undefined) {
      return tCommon("notProvided");
    }
    return hasDealings ? tCommon("yes") : tCommon("no");
  };

  // Helper function to get supporting documents
  const getSupportingDocuments = () => {
    const documents =
      currentProfessionalInfo?.supportingDocuments ||
      currentProfile?.supportingDocuments;
    if (documents && documents.length > 0) {
      return documents
        .map((doc: File) => (doc instanceof File ? doc.name : t("document")))
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
              {t("supplyAreas")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getSupplyAreas()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("serviceCoverage")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getServiceCoverage()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("yearsOfExperience")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getYearsOfExperience()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t("governmentPrivateDealings")}
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
              {getGovernmentPrivateDealings()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t("supportingDocuments")}
          </label>
          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
            {getSupportingDocuments()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
