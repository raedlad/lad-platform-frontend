import { z } from "zod";
import {
  ContractorTechnicalOperationalInfoSchema,
  ContractorDocumentUploadSchema,
} from "../utils/validation";

// Contractor Profile Types - Professional Info + File Upload
export type ContractorTechnicalOperationalInfo = z.infer<
  typeof ContractorTechnicalOperationalInfoSchema
>;
export type ContractorDocumentUpload = z.infer<
  typeof ContractorDocumentUploadSchema
>;

export interface ContractorProfileProfessionalInfo {
  commercialRegistrationNumber: string;
  authorizedPersonName: string;
  email?: string;
  authorizedPersonPhoneNumber: string;
}

// Contractor Profile State - No auth-related fields
export interface ContractorProfileState {
  technicalOperationalInfo: ContractorTechnicalOperationalInfo | null;
  documentUpload: ContractorDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Contractor Profile Data for API
export interface ContractorProfileData {
  technicalOperationalInfo?: ContractorTechnicalOperationalInfo;
  documentUpload?: ContractorDocumentUpload;
}
export interface ContractorProfile {
  id: number;
  user_id: string;
  company_name: string;
  commercial_registration_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  representative_email: string;
  about_us: string;
  is_premium_member: boolean;
  is_distinguished_contractor: boolean;
  distinguished_since: string;
  current_step: string;
  verification_status: "draft" | "pending" | "approved" | "rejected";
  admin_notes: string | null;
  profile_verified_at: string | null;
  last_activity_at: string;
  country_id: number | null;
  country_name: string | null;
  city_id: number | null;
  city_name: string | null;
  state_id: number | null;
  state_name: string | null;
  avatar: string | null;
  operational_profile: {
    id: number;
    contractor_id: string;
    executed_project_range: {
      id: number;
      label: string;
      sort_order: number;
    };
    staff_size_range: {
      id: number;
      label: string;
      sort_order: number;
    };
    has_government_accreditation: boolean;
    classification_level: {
      id: number;
      level: number;
      label: string;
      sort_order: number;
    };
    experience_years_range: {
      id: number;
      label: string;
      sort_order: number;
    };
    annual_projects_range: {
      id: number;
      label: string;
      sort_order: number;
    };
    covers_all_regions: boolean;
    work_fields: Array<{
      id: number;
      contractor_operational_profile_id: string;
      work_field: {
        id: number;
        name: string;
        description: string;
        code: string | null;
        icon: string;
        sort_order: string;
        is_active: boolean;
      };
      years_of_experience_in_field: number;
      field_specific_notes: string | null;
      created_at: string;
      updated_at: string;
    }>;
    geographical_coverage: Array<{
      id: number;
      contractor_operational_profile_id: string;
      city: {
        id: number;
        name: string;
        country: string;
      };
      covers_all_areas: boolean;
      specific_areas: string | null;
      priority: string;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>;
    created_at: string;
    updated_at: string;
  } | null;
  target_project_values: Array<{
    id: number;
    contractor_id: string;
    project_value_range: {
      id: number;
      label: string;
      sort_order: number;
    };
    created_at: string;
    updated_at: string;
  }>;
  geographical_coverage: Array<{
    id: number;
    contractor_operational_profile_id: string;
    city: {
      id: number;
      name: string;
      country: string;
    };
    covers_all_areas: boolean;
    specific_areas: string | null;
    priority: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
  documents: Array<{
    id: number;
    name: string;
    description: string | null;
    original_filename: string;
    file_path: string;
    file_url: string;
    download_url: string;
    file_size: number;
    formatted_file_size: string;
    mime_type: string;
    status: "verified" | "pending" | "rejected";
    status_name: string;
    admin_notes: string | null;
    is_required: boolean;
    expiry_date: string | null;
    is_expired: boolean;
    is_expiring_soon: boolean;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
    type_name: string;
    metadata: any | null;
  }>;
}

export interface ContractorProfilePersonalInfo {
  company_name: string;
  commercial_registration_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  representative_email: string;
  delegation_form: File;
  country_id?: string;
  state_id?: string;
  city_id?: string;
}
