import { ChangeEvent, DragEvent, InputHTMLAttributes } from "react";

export enum DocumentStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected",
  EXPIRED = "expired",
}
export interface Document {
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
}


export type Role =
  | "INDIVIDUAL"
  | "ORGANIZATION"
  | "ENGINEERING_OFFICE"
  | "FREELANCE_ENGINEER"
  | "SUPPLIER"
  | "CONTRACTOR";

export interface UploadedFile {
  id: string; // Unique file ID
  fileName: string;
  customName?: string; // User-defined custom name
  description?: string; // User-defined description
  fileUrl: string;
  uploadedAt: string;
  expiryDate?: string; // Optional expiry date
  status: DocumentStatus;
  size?: number; // File size in bytes
}

export interface DocumentRequirement {
  id: string;
  label: string;
  mandatory: boolean;
  maxFiles: number;
  maxFileSize: number; // in MB
  acceptTypes: string[];
  status?: DocumentStatus; // Optional - defaults to no status until uploaded
  uploadedFiles?: UploadedFile[]; // Optional - can be empty initially
  reviewComment?: string; // Optional review comment for rejected documents
}
export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
};

// Extended interface for files with status and progress
export interface FileWithStatus extends FileWithPreview {
  status?:
    | "pending"
    | "approved"
    | "rejected"
    | "expired"
    | "uploading"
    | "completed"
    | "error";
  progress?: number;

  error?: string;
  success?: boolean;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
}

export type FileUploadOptions = {
  maxFiles?: number; // Only used when multiple is true, defaults to Infinity
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean; // Defaults to false
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void; // Callback when files change
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void; // Callback when new files are added
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
};

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

export interface DocumentsState {
  roles: Record<string, DocumentRequirement[]>;
  fetchDocuments: (role: string) => Promise<void>;
  uploadFile: (role: string, docId: string, file: File) => Promise<void>;
}

// File upload status management types
export interface FileUploadStatus {
  fileId: string;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  progress?: number;
  fileName?: string;
  role?: string;
  docId?: string;
  retryCount?: number;
  timestamp?: number;
}

export interface FileUploadStatusState {
  uploadStatuses: Record<string, FileUploadStatus>;
  setFileUploadStatus: (fileId: string, status: FileUploadStatus) => void;
  clearFileUploadStatus: (fileId: string) => void;
  clearAllUploadStatuses: () => void;
}
