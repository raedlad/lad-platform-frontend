import { z } from "zod";
import {
  SupplierOperationalCommercialInfoSchema,
  SupplierDocumentUploadSchema,
} from "../utils/validation";

// Supplier Profile Types - Professional Info + File Upload
export type SupplierOperationalCommercialInfo = z.infer<
  typeof SupplierOperationalCommercialInfoSchema
>;
export type SupplierDocumentUpload = z.infer<
  typeof SupplierDocumentUploadSchema
>;

export interface SupplierProfilePersonalInfo {
  company_name: string;
  commercial_registration_number: string;
  authorized_person_name: string;
  authorized_person_phone: string;
  representative_email: string;
  country_id: number | null;
  city_id: number | null;
  state_id: number | null;
}

// Supplier Profile State - No auth-related fields
export interface SupplierProfileState {
  operationalCommercialInfo: SupplierOperationalCommercialInfo | null;
  documentUpload: SupplierDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Supplier Profile Data for API
export interface SupplierProfileData {
  operationalCommercialInfo?: SupplierOperationalCommercialInfo;
  documentUpload?: SupplierDocumentUpload;
}
