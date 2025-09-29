import { ApiResponse } from "@/lib/apiClient";
import { IndividualProfilePersonalInfo } from "./individual";
import { Country, State, City } from "../services/personalInfoApi";

// API Response types for profile endpoints
export interface IndividualProfileApiResponse
  extends ApiResponse<IndividualProfilePersonalInfo> {
  response?: IndividualProfilePersonalInfo;
}

export interface CountriesApiResponse extends ApiResponse<Country[]> {
  response?: Country[];
}

export interface StatesApiResponse extends ApiResponse<State[]> {
  response?: State[];
}

export interface CitiesApiResponse extends ApiResponse<City[]> {
  response?: City[];
}

// Form data types for API submission
export interface IndividualPersonalInfoApiData {
  first_name: string;
  last_name: string;
  country_id?: number | null;
  city_id?: number | null;
  state_id?: number | null;
  national_id?: string;
  detailed_address?: string;
  about_me?: string;
}

// Form data type that matches the validation schema
export interface IndividualPersonalInfoFormData {
  first_name: string;
  last_name: string;
  country_id?: number | null;
  city_id?: number | null;
  state_id?: number | null;
  national_id?: string;
  detailed_address?: string;
  about_me?: string;
}

// Organization form data type
export interface OrganizationPersonalInfoFormData {
  company_name: string;
  commercial_register_number: string;
  representative_name: string;
  representative_person_phone: string;
  representative_person_email: string;
  has_government_accreditation: boolean;
  detailed_address?: string;
  vat_number?: string;
  about_us?: string;
  country_id?: number | null;
  city_id?: number | null;
  state_id?: number | null;
  representative_id_image?: File;
}

// Location selection state
export interface LocationSelectionState {
  selectedCountryCode: string | null;
  selectedStateCode: string | null;
  selectedStateId: number | null;
  selectedCountryId: number | null;
}
