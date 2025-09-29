import { z } from "zod";
import { IndividualDocumentUploadSchema } from "../utils/validation";

export type IndividualDocumentUpload = z.infer<
  typeof IndividualDocumentUploadSchema
>;

// Base ProfilePersonalInfo type without validation schema
export interface IndividualProfilePersonalInfo {
  first_name: string;
  last_name: string;
  country_id?: number | null;
  city_id?: number | null;
  state_id?: number | null;
  national_id?: string | null;
  detailed_address?: string | null;
  about_me?: string | null;
}

// Individual Profile interface with verification status and documents
export interface IndividualProfile {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  national_id: string;
  detailed_address: string;
  verification_status: "draft" | "pending" | "approved" | "rejected";
  admin_notes: string | null;
  about_me: string | null;
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

// Individual Profile State - No auth-related fields
export interface IndividualProfileState {
  documentUpload: IndividualDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Individual Profile Data for API
export interface IndividualProfileData {
  documentUpload?: IndividualDocumentUpload;
}
