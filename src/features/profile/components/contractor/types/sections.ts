// Shared types for contractor operational sections

export interface WorkField {
  work_field_id: number;
  years_of_experience_in_field: number | null;
}

export interface GeographicalCoverage {
  country_code: string;
  state_id: string;
  city_id: string;
  covers_all_areas: boolean;
}

export interface ContractorCoverage {
  country_code: string;
  state_id: string;
  city_id: string;
  covers_all_areas: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}
