import { create } from "zustand";
import { IndividualProfilePersonalInfo } from "../types/individual";
import { OrganizationProfilePersonalInfo } from "../types/organization";
import { FreelanceEngineerProfilePersonalInfo } from "../types/freelanceEngineer";
import { EngineeringOfficeProfilePersonalInfo } from "../types/engineeringOffice";
import { ContractorProfilePersonalInfo } from "../types/contractor";
import { SupplierProfilePersonalInfo } from "../types/supplier";
import {
  personalInfoApi,
  Country,
  State,
  City,
  ContractorPersonalInfoApiData,
} from "../services/personalInfoApi";

export interface PersonalInfoStoreState {
  isLoading: boolean;
  error: string | null;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  clearError: () => void;
  individualPersonalInfo: IndividualProfilePersonalInfo | null;
  setIndividualPersonalInfo: (
    personalInfo: IndividualProfilePersonalInfo
  ) => void;
  handleIndividualPersonalInfoSubmit: (
    personalInfo: IndividualProfilePersonalInfo
  ) => void;
  organizationPersonalInfo: OrganizationProfilePersonalInfo | null;
  setOrganizationPersonalInfo: (
    organizationPersonalInfo: OrganizationProfilePersonalInfo
  ) => void;
  handleOrganizationPersonalInfoSubmit: (
    organizationPersonalInfo: OrganizationProfilePersonalInfo
  ) => void;
  freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo | null;
  setFreelanceEngineerPersonalInfo: (
    freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo
  ) => void;
  handleFreelanceEngineerPersonalInfoSubmit: (
    freelanceEngineerPersonalInfo: FreelanceEngineerProfilePersonalInfo
  ) => void;
  engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo | null;
  setEngineeringOfficePersonalInfo: (
    engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo
  ) => void;
  handleEngineeringOfficePersonalInfoSubmit: (
    engineeringOfficePersonalInfo: EngineeringOfficeProfilePersonalInfo
  ) => void;
  contractorPersonalInfo: ContractorProfilePersonalInfo | null;
  setContractorPersonalInfo: (
    contractorPersonalInfo: ContractorProfilePersonalInfo
  ) => void;
  handleContractorPersonalInfoSubmit: (
    contractorPersonalInfo: ContractorPersonalInfoApiData
  ) => void;
  supplierPersonalInfo: SupplierProfilePersonalInfo | null;
  setSupplierPersonalInfo: (
    supplierPersonalInfo: SupplierProfilePersonalInfo
  ) => void;
  handleSupplierPersonalInfoSubmit: (
    supplierPersonalInfo: SupplierProfilePersonalInfo
  ) => void;
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
  setIndividualPersonalInfo: (individualPersonalInfo) =>
    set({ individualPersonalInfo }),
  organizationPersonalInfo: null,
  setOrganizationPersonalInfo: (organizationPersonalInfo) =>
    set({ organizationPersonalInfo }),
  freelanceEngineerPersonalInfo: null,
  setFreelanceEngineerPersonalInfo: (freelanceEngineerPersonalInfo) =>
    set({ freelanceEngineerPersonalInfo }),
  engineeringOfficePersonalInfo: null,
  setEngineeringOfficePersonalInfo: (engineeringOfficePersonalInfo) =>
    set({ engineeringOfficePersonalInfo }),
  contractorPersonalInfo: null,
  setContractorPersonalInfo: (contractorPersonalInfo) =>
    set({ contractorPersonalInfo }),
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

  handleIndividualPersonalInfoSubmit: async (individualPersonalInfo) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await personalInfoApi.submitIndividualPersonalInfo(
      individualPersonalInfo
    );

    if (response.success && response.data) {
      set((state) => ({ ...state, individualPersonalInfo: response.data }));
    } else {
      set((state) => ({ ...state, error: response.message }));
    }
    set((state) => ({ ...state, isLoading: false }));
  },
  handleOrganizationPersonalInfoSubmit: async (organizationPersonalInfo) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await personalInfoApi.submitOrganizationPersonalInfo(
      organizationPersonalInfo
    );
    if (response.success && response.data) {
      set((state) => ({ ...state, organizationPersonalInfo: response.data }));
    } else {
      set((state) => ({ ...state, error: response.message }));
    }
    set((state) => ({ ...state, isLoading: false }));
  },
  handleFreelanceEngineerPersonalInfoSubmit: async (
    freelanceEngineerPersonalInfo
  ) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await personalInfoApi.submitFreelanceEngineerPersonalInfo(
      freelanceEngineerPersonalInfo
    );
    if (response.success && response.data) {
      set((state) => ({
        ...state,
        freelanceEngineerPersonalInfo: response.data,
      }));
    } else {
      set((state) => ({ ...state, error: response.message }));
    }
    set((state) => ({ ...state, isLoading: false }));
  },
  handleEngineeringOfficePersonalInfoSubmit: async (
    engineeringOfficePersonalInfo
  ) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await personalInfoApi.submitEngineeringOfficePersonalInfo(
      engineeringOfficePersonalInfo
    );
    if (response.success && response.data) {
      set((state) => ({
        ...state,
        engineeringOfficePersonalInfo: response.data,
      }));
    } else {
      set((state) => ({ ...state, error: response.message }));
    }
    set((state) => ({ ...state, isLoading: false }));
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
    const response = await personalInfoApi.submitSupplierPersonalInfo(
      supplierPersonalInfo
    );
    if (response.success && response.data) {
      set((state) => ({ ...state, supplierPersonalInfo: response.data }));
    } else {
      set((state) => ({ ...state, error: response.message }));
    }
    set((state) => ({ ...state, isLoading: false }));
  },

  // Location methods
  loadCountries: async () => {
    try {
      console.log("loadCountries called - making API request...");
      const response = await personalInfoApi.getCountries();
      console.log("loadCountries API response:", response);
      if (response.success && (response as any).response) {
        console.log(
          "Countries loaded successfully:",
          (response as any).response?.length,
          "countries"
        );
        set({ countries: (response as any).response });
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
      if (response.success && (response as any).response) {
        set((state) => ({
          ...state,
          states: (response as any).response,
          cities: [],
          selectedState: null,
          selectedCity: null,
        }));
        console.log("States loaded:", (response as any).response);
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

      if (response.success && (response as any).response) {
        set((state) => ({
          ...state,
          cities: (response as any).response,
          selectedCity: null,
        }));
        console.log("Cities loaded:", (response as any).response);
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
