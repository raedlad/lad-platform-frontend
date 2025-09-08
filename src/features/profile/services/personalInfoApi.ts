// services/personalInfoApi.ts
import { request } from "@/lib/apiClient";
import type { ApiResponse } from "@/lib/apiClient";
import type { IndividualProfilePersonalInfo } from "@/features/profile/types/individual";
import type { OrganizationProfilePersonalInfo } from "@/features/profile/types/organization";
import type { FreelanceEngineerProfilePersonalInfo } from "@/features/profile/types/freelanceEngineer";
import type { EngineeringOfficeProfilePersonalInfo } from "@/features/profile/types/engineeringOffice";
import type { ContractorProfilePersonalInfo } from "@/features/profile/types/contractor";
import type { SupplierProfilePersonalInfo } from "@/features/profile/types/supplier";

// Location types based on actual API response
export interface Country {
  id: number;
  iso2: string;
  name: string;
  status: string;
  phone_code: string;
  iso3: string;
  region: string;
  subregion: string;
}

export interface State {
  id: number;
  name: string;
  country_id: string;
  country_code: string;
}

export interface City {
  id: number;
  name: string;
  state_id?: number;
  state_code?: string;
  country_id: number;
  country_code: string;
}

// API data structure for contractor personal info
export interface ContractorPersonalInfoApiData {
  company_name: string;
  commercial_registration_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  representative_email: string;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  delegation_form: File;
  avatar: File;
}

export const personalInfoApi = {
  submitIndividualPersonalInfo(
    individualPersonalInfo: IndividualProfilePersonalInfo
  ): Promise<ApiResponse<IndividualProfilePersonalInfo>> {
    return request<IndividualProfilePersonalInfo>(
      "post",
      "/individual/profile/personal-info",
      individualPersonalInfo
    );
  },
  submitOrganizationPersonalInfo(
    organizationPersonalInfo: OrganizationProfilePersonalInfo
  ): Promise<ApiResponse<OrganizationProfilePersonalInfo>> {
    return request<OrganizationProfilePersonalInfo>(
      "post",
      "/organization/profile/personal-info",
      organizationPersonalInfo
    );
  },
  submitFreelanceEngineerPersonalInfo(
    freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo
  ): Promise<ApiResponse<FreelanceEngineerProfilePersonalInfo>> {
    return request<FreelanceEngineerProfilePersonalInfo>(
      "post",
      "/freelance-engineer/profile/personal-info",
      freelanceEngineerPersonalInfo
    );
  },
  submitEngineeringOfficePersonalInfo(
    engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo
  ): Promise<ApiResponse<EngineeringOfficeProfilePersonalInfo>> {
    return request<EngineeringOfficeProfilePersonalInfo>(
      "post",
      "/engineering-office/profile/personal-info",
      engineeringOfficePersonalInfo
    );
  },
  submitContractorPersonalInfo(
    contractorPersonalInfo: ContractorPersonalInfoApiData
  ): Promise<ApiResponse<ContractorProfilePersonalInfo>> {
    // Create FormData for file upload
    const formData = new FormData();

    // Add text fields
    formData.append("company_name", contractorPersonalInfo.company_name);
    formData.append(
      "commercial_registration_number",
      contractorPersonalInfo.commercial_registration_number
    );
    formData.append(
      "authorized_person_name",
      contractorPersonalInfo.authorized_person_name
    );
    formData.append(
      "authorized_person_phone",
      contractorPersonalInfo.authorized_person_phone
    );
    formData.append(
      "representative_email",
      contractorPersonalInfo.representative_email
    );

    // Add optional location fields
    if (contractorPersonalInfo.country_id) {
      formData.append(
        "country_id",
        contractorPersonalInfo.country_id.toString()
      );
    }
    if (contractorPersonalInfo.state_id) {
      formData.append("state_id", contractorPersonalInfo.state_id.toString());
    }
    if (contractorPersonalInfo.city_id) {
      formData.append("city_id", contractorPersonalInfo.city_id.toString());
    }

    // Add file fields
    formData.append("delegation_form", contractorPersonalInfo.delegation_form);
    formData.append("avatar", contractorPersonalInfo.avatar);

    // Debug logging
    console.log("Contractor Personal Info API Data:", contractorPersonalInfo);
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    return request<ContractorProfilePersonalInfo>(
      "post",
      "/contractor/update-profile/update-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  submitSupplierPersonalInfo(
    supplierPersonalInfo: SupplierProfilePersonalInfo
  ): Promise<ApiResponse<SupplierProfilePersonalInfo>> {
    return request<SupplierProfilePersonalInfo>(
      "post",
      "/supplier/profile/personal-info",
      supplierPersonalInfo
    );
  },

  // Location APIs
  getCountries(): Promise<ApiResponse<Country[]>> {
    return request<Country[]>("get", "/world/countries");
  },

  getStates(countryCode: string): Promise<ApiResponse<State[]>> {
    return request<State[]>("get", `/world/countries/${countryCode}/states`);
  },

  getCitiesByCountry(countryCode: string): Promise<ApiResponse<City[]>> {
    return request<City[]>("get", `/world/countries/${countryCode}/cities`);
  },

  getCitiesByState(stateCode: string): Promise<ApiResponse<City[]>> {
    return request<City[]>("get", `/world/states/${stateCode}/cities`);
  },
};
