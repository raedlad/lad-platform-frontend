import { z } from "zod";
import { FreelanceEngineerDocumentUploadSchema } from "../utils/validation";

// Freelance Engineer Profile Types - Professional Info + File Upload
export interface FreelanceEngineerProfessionalInfoType {
  experience_years_range_id?: number;
  is_associated_with_office?: boolean;
  associated_office_name?: string;
  specializations: FreelanceEngineerSpecialization[];
  geographical_coverage: FreelanceEngineerGeographicalCoverage[];
  experiences?: FreelanceEngineerExperience[];
}

export interface FreelanceEngineerSpecialization {
  engineering_specialization_id: number;
  other_specialization?: string;
  specialization_notes?: string;
  is_primary_specialization?: boolean;
  expertise_level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface FreelanceEngineerGeographicalCoverage {
  country_code: string;
  state_id: string;
  city_id: number;
  notes?: string;
}

export interface FreelanceEngineerExperience {
  engineering_specialization_id?: number;
  other_specialization?: string;
}
export type FreelanceEngineerDocumentUpload = z.infer<
  typeof FreelanceEngineerDocumentUploadSchema
>;

export interface FreelanceEngineerProfilePersonalInfo {
  country_id: number;
  city_id: number;
  state_id: number;
  full_name: string;
  national_id: string;
  engineers_association_number: string;
  about_me: string;
  engineering_type_id: number;
  experience_years_range_id: number;
  is_associated_with_office?: boolean;
  associated_office_name?: string;
}

// Freelance Engineer Profile State - No auth-related fields
export interface FreelanceEngineerProfileState {
  professionalInfo: FreelanceEngineerProfessionalInfoType | null;
  documentUpload: FreelanceEngineerDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Freelance Engineer Profile Data for API
export interface FreelanceEngineerProfileData {
  professionalInfo?: FreelanceEngineerProfessionalInfoType;
  documentUpload?: FreelanceEngineerDocumentUpload;
}
