import { create } from "zustand";
import {
  IndividualProfilePersonalInfo,
  IndividualProfile,
} from "../types/individual";
import {
  OrganizationProfilePersonalInfo,
  OrganizationProfile,
} from "../types/organization";
import { FreelanceEngineerProfilePersonalInfo } from "../types/freelanceEngineer";
import { EngineeringOfficeProfilePersonalInfo } from "../types/engineeringOffice";
import {
  ContractorProfilePersonalInfo,
  ContractorProfile,
} from "../types/contractor";
import { SupplierProfilePersonalInfo } from "../types/supplier";
import {
  personalInfoApi,
  Country,
  State,
  City,
  ContractorPersonalInfoApiData,
} from "../services/personalInfoApi";
import { IndividualPersonalInfoApiData } from "../types/api";
import { profileApi } from "../services/profileApi";

export interface PersonalInfoStoreState {
  isLoading: boolean;
  error: string | null;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  clearError: () => void;
  individualPersonalInfo: IndividualProfilePersonalInfo | null;
  individualProfile: IndividualProfile | null;
  handleIndividualProfileFetch: () => Promise<void>;
  setIndividualPersonalInfo: (
    personalInfo: IndividualProfilePersonalInfo
  ) => void;
  setIndividualProfile: (profile: IndividualProfile) => void;
  handleIndividualPersonalInfoSubmit: (
    personalInfo: IndividualPersonalInfoApiData
  ) => Promise<{ success: boolean; message?: string }>;
  organizationPersonalInfo: OrganizationProfilePersonalInfo | null;
  organizationProfile: OrganizationProfile | null;
  setOrganizationPersonalInfo: (
    organizationPersonalInfo: OrganizationProfilePersonalInfo
  ) => void;
  setOrganizationProfile: (profile: OrganizationProfile) => void;
  handleOrganizationProfileFetch: () => Promise<void>;
  handleOrganizationPersonalInfoSubmit: (
    organizationPersonalInfo: OrganizationProfilePersonalInfo
  ) => Promise<{ success: boolean; message?: string }>;
  freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo | null;
  setFreelanceEngineerPersonalInfo: (
    freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo
  ) => void;
  handleFreelanceEngineerProfileFetch: () => Promise<void>;
  handleFreelanceEngineerPersonalInfoSubmit: (
    freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo
  ) => Promise<{ success: boolean; message?: string }>;
  engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo | null;
  setEngineeringOfficePersonalInfo: (
    engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo
  ) => void;
  handleEngineeringOfficeProfileFetch: () => Promise<void>;
  handleEngineeringOfficePersonalInfoSubmit: (
    engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo
  ) => Promise<{ success: boolean; message?: string; data?: any }>;
  contractorPersonalInfo: ContractorProfilePersonalInfo | null;
  contractorProfile: ContractorProfile | null;
  setContractorPersonalInfo: (
    contractorPersonalInfo: ContractorProfilePersonalInfo
  ) => void;
  setContractorProfile: (profile: ContractorProfile) => void;
  handleContractorProfileFetch: () => Promise<void>;
  handleContractorPersonalInfoSubmit: (
    contractorPersonalInfo: ContractorPersonalInfoApiData
  ) => void;
  supplierPersonalInfo: SupplierProfilePersonalInfo | null;
  setSupplierPersonalInfo: (
    supplierPersonalInfo: SupplierProfilePersonalInfo
  ) => void;
  handleSupplierPersonalInfoSubmit: (
    supplierPersonalInfo: SupplierProfilePersonalInfo
  ) => Promise<{
    success: boolean;
    message?: string;
    data?: SupplierProfilePersonalInfo;
  }>;
  handleSupplierProfileFetch: () => Promise<void>;
  // Location data
  countries: Country[];
  states: State[];
  cities: City[];
  selectedCountry: string | null;
  selectedState: string | null;
  selectedCity: string | null;
  setCountries: (countries: Country[]) => void;
  setStates: (states: State[]) => void;
  setCities: (cities: City[]) => void;
  setSelectedCountry: (countryCode: string | null) => void;
  setSelectedState: (stateCode: string | null) => void;
  setSelectedCity: (cityCode: string | null) => void;
  loadCountries: () => Promise<void>;
  loadStates: (countryCode: string) => Promise<void>;
  loadCities: (countryCode: string, stateCode?: string) => Promise<void>;
  clearLocationData: () => void;
}

export const usePersonalInfoStore = create<PersonalInfoStoreState>()((set) => ({
  isLoading: false,
  error: null,
  editing: false,
  setEditing: (editing) => set({ editing }),
  clearError: () => set({ error: null }),
  individualPersonalInfo: null,
  individualProfile: null,
  setIndividualPersonalInfo: (individualPersonalInfo) =>
    set({ individualPersonalInfo }),
  setIndividualProfile: (individualProfile) => set({ individualProfile }),
  organizationPersonalInfo: null,
  organizationProfile: null,
  setOrganizationPersonalInfo: (organizationPersonalInfo) =>
    set({ organizationPersonalInfo }),
  setOrganizationProfile: (organizationProfile) => set({ organizationProfile }),
  freelanceEngineerPersonalInfo: null,
  setFreelanceEngineerPersonalInfo: (freelanceEngineerPersonalInfo) =>
    set({ freelanceEngineerPersonalInfo }),
  engineeringOfficePersonalInfo: null,
  setEngineeringOfficePersonalInfo: (engineeringOfficePersonalInfo) =>
    set({ engineeringOfficePersonalInfo }),
  contractorPersonalInfo: null,
  contractorProfile: null,
  setContractorPersonalInfo: (contractorPersonalInfo) =>
    set({ contractorPersonalInfo }),
  setContractorProfile: (contractorProfile) => set({ contractorProfile }),
  supplierPersonalInfo: null,
  setSupplierPersonalInfo: (supplierPersonalInfo) =>
    set({ supplierPersonalInfo }),

  // Location data
  countries: [],
  states: [],
  cities: [],
  selectedCountry: null,
  selectedState: null,
  selectedCity: null,
  setCountries: (countries) => set({ countries }),
  setStates: (states) => set({ states }),
  setCities: (cities) => set({ cities }),
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  setSelectedState: (selectedState) => set({ selectedState }),
  setSelectedCity: (selectedCity) => set({ selectedCity }),

  handleIndividualProfileFetch: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await profileApi.fetchIndividualProfile();

      if (response.success && (response.data || response.response)) {
        const profileData = response.data || response.response;

        if (profileData) {
          // Extract personal info from the profile data
          const personalInfo: IndividualProfilePersonalInfo = {
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            country_id: profileData.country_id || null,
            city_id: profileData.city_id || null,
            state_id: profileData.state_id || null,
            national_id: profileData.national_id || "",
            detailed_address: profileData.detailed_address || "",
            about_me: profileData.about_me || "",
          };

          set((state) => ({
            ...state,
            individualPersonalInfo: personalInfo,
            individualProfile: profileData,
          }));
        } else {
          set((state) => ({
            ...state,
            error: "No profile data received",
          }));
        }
      } else {
        set((state) => ({
          ...state,
          error: response.message || "Failed to fetch profile",
        }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching profile",
      }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  handleContractorProfileFetch: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await profileApi.fetchContractorProfile();

      if (response.success && (response.data || response.response)) {
        const profileData = response.data || response.response;

        if (profileData) {
          // Extract personal info from the profile data
          const personalInfo: ContractorProfilePersonalInfo = {
            company_name:
              profileData.company_name || profileData.companyName || "",
            commercial_registration_number:
              profileData.commercial_registration_number ||
              profileData.commercialRegistrationNumber ||
              "",
            authorized_person_name:
              profileData.authorized_person_name ||
              profileData.authorizedPersonName ||
              "",
            authorized_person_phone:
              profileData.authorized_person_phone ||
              profileData.authorizedPersonPhoneNumber ||
              "",
            representative_email:
              profileData.representative_email ||
              profileData.representativeEmail ||
              "",
            delegation_form:
              profileData.delegation_form || profileData.delegationForm || null,
            country_id: profileData.country_id || profileData.country || "",
            state_id: profileData.state_id || profileData.state || "",
            city_id: profileData.city_id || profileData.city || "",
          };

          set((state) => ({
            ...state,
            contractorPersonalInfo: personalInfo,
            contractorProfile: profileData,
          }));
        } else {
          set((state) => ({
            ...state,
            error: "No profile data received",
          }));
        }
      } else {
        set((state) => ({
          ...state,
          error: response.message || "Failed to fetch profile",
        }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching profile",
      }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  handleOrganizationProfileFetch: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await profileApi.fetchOrganizationProfile();

      if (response.success && (response.data || response.response)) {
        const profileData = response.data || response.response;

        if (profileData) {
          // Extract personal info from the profile data
          const personalInfo: OrganizationProfilePersonalInfo = {
            company_name: profileData.company_name || "",
            commercial_register_number:
              profileData.commercial_register_number || "",
            representative_name: profileData.authorized_person_name || "",
            representative_person_phone:
              profileData.authorized_person_phone || "",
            representative_person_email:
              profileData.authorized_person_email || "",
            has_government_accreditation:
              profileData.has_government_accreditation || false,
            detailed_address: profileData.detailed_address || "",
            vat_number: profileData.vat_number || "",
            about_us: profileData.about_us || "",
            country_id: profileData.country_id || null,
            city_id: profileData.city_id || null,
            state_id: profileData.state_id || null,
          };

          set((state) => ({
            ...state,
            organizationPersonalInfo: personalInfo,
            organizationProfile: profileData,
          }));
        } else {
          set((state) => ({
            ...state,
            error: "No organization profile data received",
          }));
        }
      } else {
        set((state) => ({
          ...state,
          error: response.message || "Failed to fetch organization profile",
        }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching organization profile",
      }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  handleIndividualPersonalInfoSubmit: async (
    individualPersonalInfo: IndividualPersonalInfoApiData
  ) => {
    set((state) => ({ ...state, isLoading: true, error: null }));

    try {
      const response = await personalInfoApi.submitIndividualPersonalInfo(
        individualPersonalInfo
      );

      if (response.success && response.response) {
        set((state) => ({
          ...state,
          individualPersonalInfo: response.response,
        }));
        set((state) => ({ ...state, isLoading: false }));
        return { success: true };
      } else {
        set((state) => ({ ...state, error: response.message }));
        set((state) => ({ ...state, isLoading: false }));
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      set((state) => ({ ...state, error: errorMessage, isLoading: false }));
      return { success: false, message: errorMessage };
    }
  },
  handleOrganizationPersonalInfoSubmit: async (organizationPersonalInfo) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await personalInfoApi.submitOrganizationPersonalInfo(
        organizationPersonalInfo
      );
      if (response.success && response.data) {
        set((state) => ({ ...state, organizationPersonalInfo: response.data }));
        return { success: true };
      } else {
        set((state) => ({ ...state, error: response.message }));
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while submitting organization personal info";
      set((state) => ({
        ...state,
        error: errorMessage,
      }));
      return { success: false, message: errorMessage };
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  handleFreelanceEngineerProfileFetch: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await profileApi.fetchFreelanceEngineerProfile();

      if (response.success && (response.data || response.response)) {
        const profileData = response.data || response.response;

        if (profileData) {
          const personalInfo: FreelanceEngineerProfilePersonalInfo = {
            full_name: profileData.full_name || "",
            national_id: profileData.national_id || "",
            engineers_association_number:
              profileData.engineers_association_number || "",
            about_me: profileData.about_me || "",
            engineering_type_id: profileData.engineering_type_id ?? null,
            experience_years_range_id:
              profileData.experience_years_range_id ?? null,
            is_associated_with_office:
              profileData.is_associated_with_office ?? false,
            associated_office_name: profileData.associated_office_name || "",
            country_id: profileData.country_id ?? null,
            city_id: profileData.city_id ?? null,
            state_id: profileData.state_id ?? null,
          };

          set((state) => ({
            ...state,
            freelanceEngineerPersonalInfo: personalInfo,
          }));
        } else {
          set((state) => ({
            ...state,
            error: "No freelance engineer profile data received",
          }));
        }
      } else {
        set((state) => ({
          ...state,
          error:
            response.message || "Failed to fetch freelance engineer profile",
        }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching freelance engineer profile",
      }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  handleEngineeringOfficeProfileFetch: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await profileApi.fetchEngineeringOfficeProfile();

      if (response.success && (response.data || response.response)) {
        const profileData = response.data || response.response;

        if (profileData) {
          const personalInfo: EngineeringOfficeProfilePersonalInfo = {
            country_id: profileData.country_id ?? null,
            city_id: profileData.city_id ?? null,
            state_id: profileData.state_id ?? null,
            engineering_type_id: profileData.engineering_type_id ?? null,
            office_name: profileData.office_name || "",
            license_number: profileData.license_number || "",
            authorized_person_name: profileData.authorized_person_name || "",
            authorized_person_phone: profileData.authorized_person_phone || "",
            representative_email: profileData.representative_email || "",
            about_us: profileData.about_us || "",
            delegation_form: profileData.delegation_form || null,
          };

          set((state) => ({
            ...state,
            engineeringOfficePersonalInfo: personalInfo,
          }));
        } else {
          set((state) => ({
            ...state,
            error: "No engineering office profile data received",
          }));
        }
      } else {
        set((state) => ({
          ...state,
          error:
            response.message || "Failed to fetch engineering office profile",
        }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching engineering office profile",
      }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  handleFreelanceEngineerPersonalInfoSubmit: async (
    freelanceEngineerPersonalInfo
  ) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response =
        await personalInfoApi.submitFreelanceEngineerPersonalInfo(
          freelanceEngineerPersonalInfo
        );
      if (response.success && response.data) {
        set((state) => ({
          ...state,
          freelanceEngineerPersonalInfo: response.data,
        }));
        return { success: true };
      } else {
        set((state) => ({ ...state, error: response.message }));
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while submitting freelance engineer personal info";
      set((state) => ({
        ...state,
        error: errorMessage,
      }));
      return { success: false, message: errorMessage };
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  handleEngineeringOfficePersonalInfoSubmit: async (
    engineeringOfficePersonalInfo
  ) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response =
        await personalInfoApi.submitEngineeringOfficePersonalInfo(
          engineeringOfficePersonalInfo
        );
      if (response.success && response.data) {
        set((state) => ({
          ...state,
          engineeringOfficePersonalInfo: response.data,
          isLoading: false,
        }));
        return response;
      } else {
        set((state) => ({
          ...state,
          error: response.message,
          isLoading: false,
        }));
        return response;
      }
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: error?.message || "An error occurred",
        isLoading: false,
      }));
      return {
        success: false,
        message: error?.message || "An error occurred",
      };
    }
  },
  handleContractorPersonalInfoSubmit: async (contractorPersonalInfo) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await personalInfoApi.submitContractorPersonalInfo(
      contractorPersonalInfo
    );
    if (response.success && response.data) {
      set((state) => ({ ...state, contractorPersonalInfo: response.data }));
    } else {
      set((state) => ({ ...state, error: response.message }));
    }
    set((state) => ({ ...state, isLoading: false }));
  },
  handleSupplierPersonalInfoSubmit: async (supplierPersonalInfo) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await personalInfoApi.submitSupplierPersonalInfo(
        supplierPersonalInfo
      );
      if (response.success && response.data) {
        set((state) => ({
          ...state,
          supplierPersonalInfo: response.data,
          isLoading: false,
        }));
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        set((state) => ({
          ...state,
          error: response.message,
          isLoading: false,
        }));
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      set((state) => ({
        ...state,
        error:
          error?.message || "An error occurred while updating supplier profile",
        isLoading: false,
      }));
      return {
        success: false,
        message:
          error?.message || "An error occurred while updating supplier profile",
      };
    }
  },

  handleSupplierProfileFetch: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await personalInfoApi.fetchSupplierProfile();
      if (response.success && response.data) {
        set((state) => ({
          ...state,
          supplierPersonalInfo: response.data,
          isLoading: false,
        }));
      } else {
        set((state) => ({
          ...state,
          error: response.message || "Failed to fetch supplier profile",
          isLoading: false,
        }));
      }
    } catch (error: any) {
      set((state) => ({
        ...state,
        error:
          error?.message || "An error occurred while fetching supplier profile",
        isLoading: false,
      }));
    }
  },

  // Location methods
  loadCountries: async () => {
    try {
      console.log("loadCountries called - making API request...");
      const response = await personalInfoApi.getCountries();
      console.log("loadCountries API response:", response);
      if (response.success && response.response) {
        console.log(
          "Countries loaded successfully:",
          response.response?.length,
          "countries"
        );
        set({ countries: response.response });
      } else {
        console.log("Failed to load countries - no response data:", response);
      }
    } catch (error) {
      console.error("Failed to load countries:", error);
    }
  },

  loadStates: async (countryCode: string) => {
    try {
      console.log("Loading states for country:", countryCode);
      const response = await personalInfoApi.getStates(countryCode);
      console.log("States response:", response);
      if (response.success && response.response) {
        set((state) => ({
          ...state,
          states: response.response,
          cities: [],
          selectedState: null,
          selectedCity: null,
        }));
        console.log("States loaded:", response.response);
      } else {
        console.log("No states found or error:", response);
        // If no states, try to load cities directly
        set((state) => ({
          ...state,
          states: [],
          cities: [],
          selectedState: null,
          selectedCity: null,
        }));
      }
    } catch (error) {
      console.error("Failed to load states:", error);
    }
  },

  loadCities: async (countryCode: string, stateCode?: string) => {
    try {
      console.log(
        "Loading cities for country:",
        countryCode,
        "state:",
        stateCode
      );
      let response;
      if (stateCode) {
        response = await personalInfoApi.getCitiesByState(stateCode);
      } else {
        response = await personalInfoApi.getCitiesByCountry(countryCode);
      }
      console.log("Cities response:", response);

      if (response.success && response.response) {
        set((state) => ({
          ...state,
          cities: response.response,
          selectedCity: null,
        }));
        console.log("Cities loaded:", response.response);
      } else {
        console.log("No cities found or error:", response);
        set((state) => ({
          ...state,
          cities: [],
          selectedCity: null,
        }));
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  },

  clearLocationData: () => {
    set({
      states: [],
      cities: [],
      selectedCountry: null,
      selectedState: null,
      selectedCity: null,
    });
  },
}));
