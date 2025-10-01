// services/personalInfoApi.ts
import api from "@/lib/api";
import type { IndividualProfilePersonalInfo } from "@/features/profile/types/individual";
import type { IndividualPersonalInfoApiData } from "@/features/profile/types/api";
import type { OrganizationProfilePersonalInfo } from "@/features/profile/types/organization";
import type { FreelanceEngineerProfilePersonalInfo } from "@/features/profile/types/freelanceEngineer";
import type { FreelanceEngineerProfessionalInfoType } from "@/features/profile/types/freelanceEngineer";
import type { EngineeringOfficeProfilePersonalInfo } from "@/features/profile/types/engineeringOffice";
import type { ContractorProfilePersonalInfo } from "@/features/profile/types/contractor";
import type { SupplierProfilePersonalInfo } from "@/features/profile/types/supplier";

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
}

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
}

export const personalInfoApi = {
  async submitIndividualPersonalInfo(
    individualPersonalInfo: IndividualPersonalInfoApiData
  ): Promise<ApiResponse<IndividualProfilePersonalInfo>> {
    const response = await api.post(
      "/individual/profile/complete",
      individualPersonalInfo
    );
    return {
      success: response.data.success,
      response: response.data.response || response.data.data,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
  async submitOrganizationPersonalInfo(
    organizationPersonalInfo: OrganizationProfilePersonalInfo
  ): Promise<ApiResponse<OrganizationProfilePersonalInfo>> {
    // Create FormData for multipart form submission
    const formData = new FormData();

    // Add all text fields
    if (organizationPersonalInfo.company_name) {
      formData.append("company_name", organizationPersonalInfo.company_name);
    }
    if (organizationPersonalInfo.commercial_register_number) {
      formData.append(
        "commercial_register_number",
        organizationPersonalInfo.commercial_register_number
      );
    }
    if (organizationPersonalInfo.representative_name) {
      formData.append(
        "representative_name",
        organizationPersonalInfo.representative_name
      );
    }
    if (organizationPersonalInfo.representative_person_phone) {
      formData.append(
        "representative_person_phone",
        organizationPersonalInfo.representative_person_phone
      );
    }
    if (organizationPersonalInfo.representative_person_email) {
      formData.append(
        "representative_person_email",
        organizationPersonalInfo.representative_person_email
      );
    }
    // Handle boolean field - Laravel expects "1" for true, "0" for false
    formData.append(
      "has_government_accreditation",
      organizationPersonalInfo.has_government_accreditation ? "true" : "false"
    );
    if (organizationPersonalInfo.detailed_address) {
      formData.append(
        "detailed_address",
        organizationPersonalInfo.detailed_address
      );
    }
    if (organizationPersonalInfo.vat_number) {
      formData.append("vat_number", organizationPersonalInfo.vat_number);
    }
    if (organizationPersonalInfo.about_us) {
      formData.append("about_us", organizationPersonalInfo.about_us);
    }
    if (organizationPersonalInfo.country_id) {
      formData.append(
        "country_id",
        organizationPersonalInfo.country_id.toString()
      );
    }
    if (organizationPersonalInfo.state_id) {
      formData.append("state_id", organizationPersonalInfo.state_id.toString());
    }
    if (organizationPersonalInfo.city_id) {
      formData.append("city_id", organizationPersonalInfo.city_id.toString());
    }

    // Add file if present
    if (organizationPersonalInfo.representative_id_image) {
      formData.append(
        "representative_id_image",
        organizationPersonalInfo.representative_id_image
      );
    }

    // Debug logging
    console.log(
      "Organization Personal Info API Data:",
      organizationPersonalInfo
    );
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value, typeof value);
    }

    const response = await api.post(
      "/organization/profile/complete",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
  async submitFreelanceEngineerPersonalInfo(
    freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo
  ): Promise<ApiResponse<FreelanceEngineerProfilePersonalInfo>> {
    const response = await api.put(
      "/freelancer-engineer/profile/update",
      freelanceEngineerPersonalInfo
    );
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
  async updateFreelanceEngineerFullSpecializations(
    professionalInfo: FreelanceEngineerProfessionalInfoType
  ): Promise<ApiResponse<FreelanceEngineerProfessionalInfoType>> {
    const response = await api.put(
      "/freelancer-engineer/profile/update-full-specializations",
      professionalInfo
    );
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
  async submitEngineeringOfficePersonalInfo(
    engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo
  ): Promise<ApiResponse<EngineeringOfficeProfilePersonalInfo>> {
    try {
      // Create FormData for multipart form data
      const formData = new FormData();

      // Add all the form fields to FormData
      Object.keys(engineeringOfficePersonalInfo).forEach((key) => {
        const value =
          engineeringOfficePersonalInfo[
            key as keyof EngineeringOfficeProfilePersonalInfo
          ];
        if (value !== null && value !== undefined) {
          if (key === "delegation_form" && value instanceof File) {
            formData.append(key, value);
            console.log(`Added file: ${key}`, value.name, value.size);
          } else {
            formData.append(key, String(value));
            console.log(`Added field: ${key}`, value);
          }
        }
      });

      console.log("Submitting engineering office personal info:", {
        url: "/engineering-office/profile/update",
        method: "POST",
        contentType: "multipart/form-data",
      });

      const response = await api.post(
        "/engineering-office/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      return {
        success: response.data.success,
        data: response.data.response || response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("API Error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred",
      };
    }
  },
  async submitContractorPersonalInfo(
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

    // Debug logging
    console.log("Contractor Personal Info API Data:", contractorPersonalInfo);
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await api.post("/contractor/profile/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
  async fetchSupplierProfile(): Promise<
    ApiResponse<SupplierProfilePersonalInfo>
  > {
    const response = await api.get("/supplier/profile");
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  async submitSupplierPersonalInfo(
    supplierPersonalInfo: SupplierProfilePersonalInfo
  ): Promise<ApiResponse<SupplierProfilePersonalInfo>> {
    const response = await api.post(
      "/supplier/profile/update",
      supplierPersonalInfo
    );
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  async updateEngineeringOfficeProfessionalInfo(
    professionalInfo: FormData
  ): Promise<ApiResponse> {
    const response = await api.post(
      "/engineering-office/profile/update-full-operational",
      professionalInfo,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  // Location APIs
  async getCountries(): Promise<ApiResponse<Country[]>> {
    const response = await api.get("/world/countries");
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  async getStates(countryCode: string): Promise<ApiResponse<State[]>> {
    const response = await api.get(`/world/countries/${countryCode}/states`);
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  async getCitiesByCountry(countryCode: string): Promise<ApiResponse<City[]>> {
    const response = await api.get(`/world/countries/${countryCode}/cities`);
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  async getCitiesByState(stateCode: string): Promise<ApiResponse<City[]>> {
    const response = await api.get(`/world/states/${stateCode}/cities`);
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },

  async updateSupplierProfessionalInfo(
    professionalInfo: FormData
  ): Promise<ApiResponse<any>> {
    const response = await api.post(
      "/supplier/profile/update-full-operational",
      professionalInfo,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
};
