import React from "react";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { SupplierOperationalCommercialInfo } from "@/features/profile/types/supplier";

interface WorkField {
  id: number;
  work_field_id: string;
  field_specific_notes: string;
  work_field: {
    id: number;
    name: string;
  };
}

interface GeographicalCoverage {
  id: number;
  city_id: string;
  covers_all_areas: boolean;
  specific_areas: string[];
  priority: string;
  notes: string;
  city: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
}

interface ExperienceYearsRange {
  id: number;
  label: string;
  sort_order: number;
}

// Type that matches the actual API response structure
interface SupplierProfileApiResponse {
  id: number;
  user_id: string;
  company_name: string;
  commercial_registration_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  representative_email: string;
  about_us: string;
  is_premium_member: boolean;
  current_step: string;
  verification_status: string;
  admin_notes: string | null;
  has_government_accreditation: boolean;
  experience_years_range_id: string;
  is_distinguished: boolean;
  distinguished_since: string | null;
  profile_verified_at: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
  country_id: number | null;
  country_name: string | null;
  city_id: number | null;
  city_name: string | null;
  state_id: number | null;
  state_name: string | null;
  avatar: string | null;
  experience_years_range: ExperienceYearsRange;
  work_fields: WorkField[];
  geographical_coverages: GeographicalCoverage[];
  projects: any[];
}

interface ProfessionalInfoProfile extends SupplierOperationalCommercialInfo {
  supply_areas?: { name: string }[];
  service_coverage?: { name: string }[];
  years_of_experience?: { label: string };
  country_name?: string;
  city_name?: string;
  state_name?: string;
  work_fields?: WorkField[];
  geographical_coverages?: GeographicalCoverage[];
  experience_years_range?: ExperienceYearsRange;
  has_government_accreditation?: boolean;
}

interface ProfessionalInfoProps {
  professionalInfo?: SupplierOperationalCommercialInfo | null;
  profile?: ProfessionalInfoProfile | SupplierProfileApiResponse | null;
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
    workFields: currentProfile?.work_fields,
    geographicalCoverages: currentProfile?.geographical_coverages,
    experienceRange: currentProfile?.experience_years_range,
    hasAccreditation: currentProfile?.has_government_accreditation,
  });

  // Helper function to get supply areas
  const getSupplyAreas = () => {
    // Check work_fields first (from API response)
    const workFields = currentProfile?.work_fields;
    if (workFields && workFields.length > 0) {
      return workFields.map((item) => item.work_field.name).join(", ");
    }

    // Fallback to other sources
    const supplyAreas =
      currentProfessionalInfo?.supplyAreas ||
      (currentProfile && "supplyAreas" in currentProfile
        ? currentProfile.supplyAreas
        : undefined);
    if (supplyAreas && supplyAreas.length > 0) {
      return supplyAreas.join(", ");
    }

    return tCommon("notProvided");
  };

  // Helper function to get service coverage
  const getServiceCoverage = () => {
    // Check geographical_coverages first (from API response)
    const geographicalCoverages = currentProfile?.geographical_coverages;
    if (geographicalCoverages && geographicalCoverages.length > 0) {
      return geographicalCoverages.map((item) => item.city.name).join(", ");
    }

    // Fallback to other sources
    const serviceCoverage =
      currentProfessionalInfo?.serviceCoverage ||
      (currentProfile && "serviceCoverage" in currentProfile
        ? currentProfile.serviceCoverage
        : undefined);
    if (serviceCoverage && serviceCoverage.length > 0) {
      return serviceCoverage.join(", ");
    }

    return tCommon("notProvided");
  };

  // Helper function to get years of experience
  const getYearsOfExperience = () => {
    // Check experience_years_range first (from API response)
    const experienceRange = currentProfile?.experience_years_range?.label;
    if (experienceRange) {
      return experienceRange;
    }

    // Fallback to other sources
    const yearsOfExperience =
      currentProfessionalInfo?.yearsOfExperience ||
      (currentProfile && "yearsOfExperience" in currentProfile
        ? currentProfile.yearsOfExperience
        : undefined);
    if (yearsOfExperience) {
      return yearsOfExperience;
    }

    return tCommon("notProvided");
  };

  // Helper function to get government/private dealings status
  const getGovernmentPrivateDealings = () => {
    // Check has_government_accreditation first (from API response)
    const hasAccreditation = currentProfile?.has_government_accreditation;
    if (hasAccreditation !== null && hasAccreditation !== undefined) {
      return hasAccreditation ? tCommon("yes") : tCommon("no");
    }

    // Fallback to other sources
    const hasDealings =
      currentProfessionalInfo?.governmentPrivateDealings ??
      currentProfile?.governmentPrivateDealings;
    if (hasDealings !== null && hasDealings !== undefined) {
      return hasDealings ? tCommon("yes") : tCommon("no");
    }

    return tCommon("notProvided");
  };

  // Helper function to get supporting documents
  const getSupportingDocuments = () => {
    const documents =
      currentProfessionalInfo?.supportingDocuments ||
      (currentProfile && "supportingDocuments" in currentProfile
        ? currentProfile.supportingDocuments
        : undefined);
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
