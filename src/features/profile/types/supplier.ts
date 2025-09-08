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
  commercialEstablishmentName: string;
  authorizedPersonName: string;
  email?: string;
  authorizedPersonPhoneNumber: string;
  commercialRegistrationNumber: string;
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
