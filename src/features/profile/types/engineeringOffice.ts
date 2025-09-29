import { z } from "zod";
import {
  EngineeringOfficeTechnicalOperationalInfoSchema,
  EngineeringOfficeDocumentUploadSchema,
} from "../utils/validation";

// Engineering Office Profile Types - Professional Info + File Upload
export type EngineeringOfficeTechnicalOperationalInfo = z.infer<
  typeof EngineeringOfficeTechnicalOperationalInfoSchema
>;
export type EngineeringOfficeDocumentUpload = z.infer<
  typeof EngineeringOfficeDocumentUploadSchema
>;

export interface EngineeringOfficeProfilePersonalInfo {
  country_id: number | null;
  city_id: number | null;
  state_id: number | null;
  engineering_type_id: number | null;
  office_name: string;
  license_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  representative_email: string;
  about_us: string;
  delegation_form: File | null;
}

export interface EngineeringOfficeProfileProfessionalInfo {
  experience_years_range_id: number | null;
  staff_size_range_id: number | null;
  annual_projects_range_id: number | null;
  has_government_accreditation: boolean;
  classification_file: File | null;
  custom_name?: string;
  description?: string;
  expiry_date?: string;
  specializations: Array<{
    engineering_specialization_id: number;
    other_specialization?: string;
    specialization_notes?: string;
    is_primary_specialization?: boolean;
    expertise_level?: "beginner" | "intermediate" | "advanced" | "expert";
  }>;
  geographical_coverage: Array<{
    country_code: string;
    state_id: string;
    city_id: number;
    notes?: string;
  }>;
}

// Engineering Office Profile State - No auth-related fields
export interface EngineeringOfficeProfileState {
  technicalOperationalInfo: EngineeringOfficeTechnicalOperationalInfo | null;
  documentUpload: EngineeringOfficeDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Engineering Office Profile Data for API
export interface EngineeringOfficeProfileData {
  technicalOperationalInfo?: EngineeringOfficeTechnicalOperationalInfo;
  documentUpload?: EngineeringOfficeDocumentUpload;
}
