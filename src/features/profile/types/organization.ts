import { z } from "zod";
import { OrganizationDocumentUploadSchema } from "../utils/validation";

// Organization Profile Types - File Upload Only
export type OrganizationDocumentUpload = z.infer<
  typeof OrganizationDocumentUploadSchema
>;

export interface OrganizationProfilePersonalInfo {
  company_name: string;
  commercial_register_number: string;
  representative_name: string;
  representative_person_phone: string;
  representative_person_email: string;
  has_government_accreditation: boolean;
  detailed_address: string;
  vat_number: string;
  about_us?: string;
  country_id: number;
  city_id: number;
  state_id: number;
  representative_id_image?: File;
}

// Organization Profile interface with verification status and documents
export interface OrganizationProfile {
  id: number;
  user_id: string;
  company_name: string;
  commercial_register_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  authorized_person_email: string;
  has_government_accreditation: boolean;
  detailed_address: string;
  vat_number: string;
  about_us: string | null;
  verification_status: "draft" | "pending" | "approved" | "rejected";
  admin_notes: string | null;
  country_id: number | null;
  country_name: string | null;
  city_id: number | null;
  city_name: string | null;
  state_id: number | null;
  state_name: string | null;
  created_at: string;
  updated_at: string;
  formatted_created_at: string;
  formatted_updated_at: string;
  created_ago: string;
  updated_ago: string;
  documentTypes: any[];
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
  pending_profile_update: any | null;
}

// Organization Profile State - No auth-related fields
export interface OrganizationProfileState {
  documentUpload: OrganizationDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Organization Profile Data for API
export interface OrganizationProfileData {
  documentUpload?: OrganizationDocumentUpload;
}
