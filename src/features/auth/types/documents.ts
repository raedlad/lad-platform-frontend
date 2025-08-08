export interface Document {
  id: string;
  userId: string;
  name: string;
  type: DocumentType;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  metadata?: Record<string, any>;
}

export enum DocumentType {
  ID_PROOF = "id_proof",
  ADDRESS_PROOF = "address_proof",
  PROFESSIONAL_LICENSE = "professional_license",
  BUSINESS_LICENSE = "business_license",
  TAX_DOCUMENT = "tax_document",
  INSURANCE_CERTIFICATE = "insurance_certificate",
  PROJECT_PORTFOLIO = "project_portfolio",
  REFERENCE_LETTER = "reference_letter",
  OTHER = "other",
}

export enum DocumentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export interface DocumentUploadRequest {
  file: File;
  type: DocumentType;
  metadata?: Record<string, any>;
}

export interface DocumentUploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
