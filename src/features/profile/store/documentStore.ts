import { create } from "zustand";
import {
  DocumentStatus,
  DocumentRequirement,
  UploadedFile,
  Role,
  FileUploadStatus,
} from "@/features/profile/types/documents";
import {
  documentsService,
  ApiError,
  NetworkError,
  ValidationError,
  UploadResponse,
} from "@/features/profile/services/documentApi";
import { getDocumentsByRole } from "@/features/profile/constants/mockDocuments";

// Backend response interfaces
interface BackendDocument {
  id: number;
  name: string;
  description: string;
  code: string;
  category: string;
  accepted_file_types: string[];
  max_file_size_mb: number;
  allow_multiple_files: boolean;
  icon: string;
  sort_order: number;
  is_active: boolean;
  instructions: string;
  validation_rules: any;
  max_files_count: number | null;
  user_has_uploaded: boolean;
  user_document_status: string;
  uploaded_documents: BackendUploadedDocument[];
  created_at: string;
  updated_at: string;
}

interface BackendUploadedDocument {
  id: number;
  name: string;
  type: string | null;
  type_label: string;
  description: string;
  file_size: number;
  file_size_formatted: string;
  mime_type: string;
  original_filename: string;
  is_required: boolean;
  expiry_date: string | null;
  status: string;
  status_label: string;
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  expiry_info: {
    has_expiry: boolean;
    is_expired: boolean;
    expires_soon: boolean;
    days_until_expiry: number | null;
  };
  file_info: {
    extension: string;
    is_image: boolean;
    is_pdf: boolean;
    is_document: boolean;
    can_preview: boolean;
    icon: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    user_type: string;
  };
  actions: any[];
}

// Transform backend data to frontend format
const transformBackendDocument = (
  backendDoc: BackendDocument
): DocumentRequirement => {
  const uploadedFiles: UploadedFile[] = (
    backendDoc.uploaded_documents || []
  ).map((file) => ({
    id: file.id.toString(),
    fileName: file.original_filename,
    customName: file.name,
    description: file.description,
    fileUrl: "", // This would need to be provided by the backend or constructed
    uploadedAt: file.created_at,
    expiryDate: file.expiry_date || undefined,
    status: file.status as DocumentStatus,
    size: file.file_size,
  }));

  // Extract review comment from the first uploaded document's admin_notes
  const reviewComment =
    uploadedFiles.length > 0
      ? backendDoc.uploaded_documents[0]?.admin_notes || undefined
      : undefined;

  return {
    id: backendDoc.id.toString(),
    label: backendDoc.name,
    mandatory: backendDoc.category === "mandatory",
    maxFiles:
      backendDoc.max_files_count || (backendDoc.allow_multiple_files ? 5 : 1),
    maxFileSize: backendDoc.max_file_size_mb,
    acceptTypes: backendDoc.accepted_file_types,
    status: backendDoc.user_document_status as DocumentStatus,
    uploadedFiles: uploadedFiles,
    reviewComment: reviewComment,
  };
};

// Enhanced document store interface
interface DocumentsStoreState {
  // Document data
  roleDocuments: Record<string, DocumentRequirement[]>;

  // Upload status tracking - now more granular
  uploadStatuses: Record<string, FileUploadStatus>;
  uploadControllers: Record<string, AbortController>; // For cancelling uploads
  fileErrors: Record<
    string,
    { error: string; timestamp: number; retryCount: number }
  >; // File-level errors

  // Loading states
  isLoading: Record<string, boolean>;
  isUploading: Record<string, boolean>;
  isSubmitting: Record<string, boolean>;

  // Error states
  errors: Record<string, string | null>; // Role-level errors
  networkStatus: Record<string, "online" | "offline">;

  // Success states
  submitSuccess: Record<string, boolean>;

  // Settings
  useRealApi: boolean; // Toggle between real API and mock data
}

interface DocumentsStoreActions {
  // Document operations
  fetchDocuments: (role: string, forceRefresh?: boolean) => Promise<void>;
  setRoleDocuments: (role: string, documents: DocumentRequirement[]) => void;
  uploadFile: (
    role: string,
    docId: string,
    file: File,
    metadata?: {
      customName?: string;
      description?: string;
      expiryDate?: string;
    }
  ) => Promise<void>;
  uploadFileFromTableUpload: (
    role: string,
    docId: string,
    files: FileList
  ) => Promise<void>;
  cancelUpload: (fileId: string) => void;
  retryUpload: (role: string, docId: string, fileId: string) => Promise<void>;
  removeFile: (role: string, docId: string, fileId: string) => Promise<void>;
  downloadFile: (role: string, docId: string, fileId: string) => Promise<void>;
  updateFileMetadata: (
    role: string,
    docId: string,
    fileId: string,
    metadata: { customName?: string; description?: string; expiryDate?: string }
  ) => void;
  submitDocuments: (role: string) => Promise<void>;

  // Upload status operations
  setFileUploadStatus: (fileId: string, status: FileUploadStatus) => void;
  clearFileUploadStatus: (fileId: string) => void;
  clearAllUploadStatuses: () => void;

  // File-level error handling
  setFileError: (fileId: string, error: string) => void;
  clearFileError: (fileId: string) => void;
  getFileError: (fileId: string) => string | null;
  getFilesByError: () => Array<{
    fileId: string;
    error: string;
    fileName?: string;
  }>;
  retryFailedFile: (fileId: string) => Promise<void>;

  // Role-level error handling
  clearError: (role: string) => void;
  clearAllErrors: () => void;
  retryFailedOperation: (
    role: string,
    operation: "fetch" | "submit"
  ) => Promise<void>;

  // State management
  resetSubmitSuccess: (role: string) => void;
  setUseRealApi: (useReal: boolean) => void;
  refreshDocuments: (role: string) => Promise<void>;

  // Utility operations
  getDocumentRequirement: (
    role: string,
    docId: string
  ) => DocumentRequirement | undefined;
  getUploadedFilesCount: (role: string) => number;
  getMandatoryCompletionStatus: (role: string) => {
    completed: number;
    total: number;
  };
  canAddFiles: (role: string, docId: string) => boolean;
  canRemoveFiles: (role: string, docId: string) => boolean;
  getErrorMessage: (error: unknown) => string;

  // File management helpers
  generateFileId: (role: string, docId: string, fileName: string) => string;
  getFileUploadStatus: (fileId: string) => FileUploadStatus | undefined;
}

type DocumentsStore = DocumentsStoreState & DocumentsStoreActions;

export const useDocumentsStore = create<DocumentsStore>((set, get) => ({
  // Initial state
  roleDocuments: {},
  uploadStatuses: {},
  uploadControllers: {},
  fileErrors: {}, // File-level errors
  isLoading: {},
  isUploading: {},
  isSubmitting: {},
  errors: {}, // Role-level errors
  networkStatus: {},
  submitSuccess: {},
  useRealApi: true, // Enable real API calls

  // Fetch documents for a role
  fetchDocuments: async (role: string, forceRefresh: boolean = false) => {
    const state = get();

    // Skip if already loaded and not forcing refresh
    if (
      !forceRefresh &&
      state.roleDocuments[role]?.length > 0 &&
      !state.isLoading[role]
    ) {
      return;
    }

    set((state) => ({
      isLoading: { ...state.isLoading, [role]: true },
      errors: { ...state.errors, [role]: null },
      networkStatus: { ...state.networkStatus, [role]: "online" },
    }));

    try {
      let documents: DocumentRequirement[];

      if (state.useRealApi) {
        // Use real API with retry logic
        const backendDocuments: BackendDocument[] =
          await documentsService.withRetry(
            () => documentsService.fetchDocuments(role),
            3, // max retries
            1000 // initial delay
          );
        // Transform backend data to frontend format
        documents = backendDocuments.map(transformBackendDocument);
      } else {
        // Use mock data
        documents = await getDocumentsByRole(role as Role);
      }

      set((state) => ({
        roleDocuments: { ...state.roleDocuments, [role]: documents },
        isLoading: { ...state.isLoading, [role]: false },
        networkStatus: { ...state.networkStatus, [role]: "online" },
      }));
    } catch (error) {
      const errorMessage = get().getErrorMessage(error);
      const isNetworkError = error instanceof NetworkError;

      set((state) => ({
        errors: { ...state.errors, [role]: errorMessage },
        isLoading: { ...state.isLoading, [role]: false },
        networkStatus: {
          ...state.networkStatus,
          [role]: isNetworkError ? "offline" : "online",
        },
      }));

      console.error(`Failed to fetch documents for ${role}:`, error);
    }
  },

  // Directly set documents for a role (adapter from backend shape)
  setRoleDocuments: (role: string, documents: DocumentRequirement[]) => {
    set((state) => ({
      roleDocuments: { ...state.roleDocuments, [role]: documents },
    }));
  },

  // Generate consistent file ID
  generateFileId: (role: string, docId: string, fileName: string) => {
    return `${role}-${docId}-${fileName}-${Date.now()}`;
  },

  // Upload a file with real API integration
  uploadFile: async (
    role: string,
    docId: string,
    file: File,
    metadata?: {
      customName?: string;
      description?: string;
      expiryDate?: string;
    }
  ) => {
    console.log("Upload file", role, docId, file.name, metadata);

    const fileId = get().generateFileId(role, docId, file.name);
    const controller = new AbortController();

    // Clear any previous error for this file
    get().clearFileError(fileId);

    // Store controller for cancellation
    set((state) => ({
      uploadControllers: { ...state.uploadControllers, [fileId]: controller },
      isUploading: { ...state.isUploading, [fileId]: true },
    }));

    // Set initial upload status with enhanced metadata
    get().setFileUploadStatus(fileId, {
      fileId,
      status: "uploading",
      progress: 0,
      fileName: file.name,
      role,
      docId,
      retryCount: 0,
      timestamp: Date.now(),
    });

    try {
      const state = get();
      let uploadResponse: UploadResponse;

      if (state.useRealApi) {
        // Real API upload without progress tracking
        uploadResponse = await documentsService.uploadFile(
          role,
          docId,
          file,
          metadata
        );
      } else {
        // Mock upload with simulated progress
        for (let progress = 10; progress <= 90; progress += 20) {
          if (controller.signal.aborted) {
            throw new Error("Upload cancelled");
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
          get().setFileUploadStatus(fileId, {
            fileId,
            status: "uploading",
            progress,
          });
        }

        // Mock response
        uploadResponse = {
          file: {
            id: fileId,
            fileName: file.name,
            customName:
              metadata?.customName ||
              file.name.split(".").slice(0, -1).join("."),
            description: metadata?.description || "",
            fileUrl: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
            expiryDate: metadata?.expiryDate || "",
            status: DocumentStatus.PENDING,
            size: file.size,
          },
          message: "File uploaded successfully",
        };
      }

      // Update document with uploaded file
      set((state) => {
        const documents = state.roleDocuments[role] || [];
        const updatedDocuments = documents.map((doc) => {
          if (doc.id === docId) {
            const updatedFiles = [
              ...(doc.uploadedFiles || []),
              uploadResponse.file,
            ];
            return {
              ...doc,
              uploadedFiles: updatedFiles,
              status: DocumentStatus.PENDING,
            };
          }
          return doc;
        });

        return {
          roleDocuments: { ...state.roleDocuments, [role]: updatedDocuments },
          isUploading: { ...state.isUploading, [fileId]: false },
          uploadControllers: (() => {
            const { [fileId]: _, ...rest } = state.uploadControllers;
            return rest;
          })(),
        };
      });

      // Set success status
      get().setFileUploadStatus(fileId, {
        fileId,
        status: "success",
      });

      // Clear success status after 3 seconds
      setTimeout(() => {
        get().clearFileUploadStatus(fileId);
      }, 3000);
    } catch (error) {
      const errorMessage = get().getErrorMessage(error);
      console.log("Store upload error:", error);
      console.log("Store error message:", errorMessage);

      // Set file-level error
      get().setFileError(fileId, errorMessage);

      set((state) => ({
        isUploading: { ...state.isUploading, [fileId]: false },
        uploadControllers: (() => {
          const { [fileId]: _, ...rest } = state.uploadControllers;
          return rest;
        })(),
      }));

      // Don't show error status for cancelled uploads
      const isCancelled =
        (error as Error).message.includes("cancel") ||
        (error as Error).message.includes("abort");
      if (!isCancelled) {
        get().setFileUploadStatus(fileId, {
          fileId,
          status: "error",
          error: errorMessage,
          fileName: file.name,
          role,
          docId,
          timestamp: Date.now(),
        });
      }

      console.error(`Upload failed for ${fileId}:`, error);

      // Re-throw the error so components can catch it
      throw error;
    }
  },

  // Upload files from TableUpload component
  uploadFileFromTableUpload: async (
    role: string,
    docId: string,
    files: FileList
  ) => {
    // Upload each file individually
    const uploadPromises = Array.from(files).map((file) =>
      get().uploadFile(role, docId, file)
    );

    try {
      await Promise.allSettled(uploadPromises);
    } catch (error) {
      // Individual file errors are handled in uploadFile method
      console.error("Some files failed to upload:", error);
    }
  },

  // Cancel upload
  cancelUpload: (fileId: string) => {
    const state = get();
    const controller = state.uploadControllers[fileId];

    if (controller) {
      controller.abort();

      // Clear upload status immediately
      set((state) => ({
        uploadControllers: (() => {
          const { [fileId]: _, ...rest } = state.uploadControllers;
          return rest;
        })(),
        isUploading: { ...state.isUploading, [fileId]: false },
      }));

      get().clearFileUploadStatus(fileId);
    }
  },

  // Retry upload
  retryUpload: async (role: string, docId: string, fileId: string) => {
    // Clear previous error
    get().clearFileError(fileId);
    // Extract file info from fileId (this is a simplified approach)
    // In a real implementation, you'd store file references
    console.warn("Retry upload not fully implemented - file reference needed");
  },

  // Remove a file with API integration
  removeFile: async (role: string, docId: string, fileId: string) => {
    try {
      const state = get();

      if (state.useRealApi) {
        await documentsService.removeFile(role, docId, fileId);
      }

      // Update local state
      set((state) => {
        const documents = state.roleDocuments[role] || [];
        const updatedDocuments = documents.map((doc) => {
          if (doc.id === docId) {
            const updatedFiles = (doc.uploadedFiles || []).filter(
              (file) => file.id !== fileId
            );
            return {
              ...doc,
              uploadedFiles: updatedFiles,
              status: updatedFiles.length === 0 ? undefined : doc.status,
            };
          }
          return doc;
        });

        return {
          roleDocuments: { ...state.roleDocuments, [role]: updatedDocuments },
        };
      });
    } catch (error) {
      const errorMessage = get().getErrorMessage(error);
      console.error("Failed to remove file:", error);

      // You might want to show a toast notification here
      throw new Error(`Failed to remove file: ${errorMessage}`);
    }
  },

  // Download a file with API integration
  downloadFile: async (role: string, docId: string, fileId: string) => {
    try {
      const state = get();
      let downloadUrl: string;

      if (state.useRealApi) {
        downloadUrl = await documentsService.downloadFile(role, docId, fileId);
      } else {
        // Mock download - find file in local state
        const documents = state.roleDocuments[role] || [];
        const document = documents.find((doc) => doc.id === docId);
        const file = document?.uploadedFiles?.find(
          (file) => file.id === fileId
        );

        if (!file) {
          throw new Error("File not found");
        }
        downloadUrl = file.fileUrl;
      }

      // Trigger download
      const link = window.document.createElement("a");
      link.href = downloadUrl;
      link.download = ""; // Let browser determine filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL if it was created locally
      if (downloadUrl.startsWith("blob:")) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    } catch (error) {
      const errorMessage = get().getErrorMessage(error);
      console.error("Failed to download file:", error);
      throw new Error(`Download failed: ${errorMessage}`);
    }
  },

  // Update file metadata (custom name, description, expiry date)
  updateFileMetadata: (
    role: string,
    docId: string,
    fileId: string,
    metadata: { customName?: string; description?: string; expiryDate?: string }
  ) => {
    set((state) => {
      const documents = state.roleDocuments[role] || [];
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === docId) {
          const updatedFiles = (doc.uploadedFiles || []).map((file) => {
            if (file.id === fileId) {
              return {
                ...file,
                customName:
                  metadata.customName !== undefined
                    ? metadata.customName
                    : file.customName,
                description:
                  metadata.description !== undefined
                    ? metadata.description
                    : file.description,
                expiryDate:
                  metadata.expiryDate !== undefined
                    ? metadata.expiryDate
                    : file.expiryDate,
              };
            }
            return file;
          });
          return {
            ...doc,
            uploadedFiles: updatedFiles,
          };
        }
        return doc;
      });

      return {
        roleDocuments: { ...state.roleDocuments, [role]: updatedDocuments },
      };
    });
  },

  // Submit documents with API integration
  submitDocuments: async (role: string) => {
    set((state) => ({
      isSubmitting: { ...state.isSubmitting, [role]: true },
      errors: { ...state.errors, [role]: null },
    }));

    try {
      const state = get();

      if (state.useRealApi) {
        // Use real API with retry logic
        await documentsService.withRetry(
          () => documentsService.submitDocuments(role),
          2, // max retries for submissions
          2000 // delay between retries
        );
      } else {
        // Simulate API submission
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Update documents status to approved
      set((state) => {
        const documents = state.roleDocuments[role] || [];
        const updatedDocuments = documents.map((doc) => ({
          ...doc,
          status:
            doc.status === DocumentStatus.PENDING
              ? DocumentStatus.APPROVED
              : doc.status,
        }));

        return {
          roleDocuments: { ...state.roleDocuments, [role]: updatedDocuments },
          isSubmitting: { ...state.isSubmitting, [role]: false },
          submitSuccess: { ...state.submitSuccess, [role]: true },
        };
      });
    } catch (error) {
      const errorMessage = get().getErrorMessage(error);
      set((state) => ({
        errors: { ...state.errors, [role]: errorMessage },
        isSubmitting: { ...state.isSubmitting, [role]: false },
      }));

      console.error(`Failed to submit documents for ${role}:`, error);
    }
  },

  // Upload status operations
  setFileUploadStatus: (fileId: string, status: FileUploadStatus) => {
    set((state) => ({
      uploadStatuses: { ...state.uploadStatuses, [fileId]: status },
    }));
  },

  clearFileUploadStatus: (fileId: string) => {
    set((state) => {
      const newStatuses = { ...state.uploadStatuses };
      delete newStatuses[fileId];
      return { uploadStatuses: newStatuses };
    });
  },

  clearAllUploadStatuses: () => {
    set({ uploadStatuses: {} });
  },

  // File-level error handling
  setFileError: (fileId: string, error: string) => {
    set((state) => ({
      fileErrors: {
        ...state.fileErrors,
        [fileId]: {
          error,
          timestamp: Date.now(),
          retryCount: (state.fileErrors[fileId]?.retryCount || 0) + 1,
        },
      },
    }));
  },

  clearFileError: (fileId: string) => {
    set((state) => {
      const newFileErrors = { ...state.fileErrors };
      delete newFileErrors[fileId];
      return { fileErrors: newFileErrors };
    });
  },

  getFileError: (fileId: string) => {
    const state = get();
    return state.fileErrors[fileId]?.error || null;
  },

  getFilesByError: () => {
    const state = get();
    return Object.entries(state.fileErrors).map(([fileId, errorInfo]) => {
      const status = state.uploadStatuses[fileId];
      return {
        fileId,
        error: errorInfo.error,
        fileName: status?.fileName,
      };
    });
  },

  retryFailedFile: async (fileId: string) => {
    const state = get();
    const status = state.uploadStatuses[fileId];

    if (status?.role && status?.docId && status?.fileName) {
      // Clear the error and retry
      get().clearFileError(fileId);

      // Find the file from document store (this is a limitation - we'd need to store file references)
      console.warn(
        "Retry failed file: File reference needed for retry functionality"
      );
      // In a real implementation, you'd store file references or prompt user to re-select
    }
  },

  // Role-level error handling
  clearError: (role: string) => {
    set((state) => ({
      errors: { ...state.errors, [role]: null },
    }));
  },

  clearAllErrors: () => {
    set((state) => ({
      errors: {},
      fileErrors: {},
    }));
  },

  retryFailedOperation: async (role: string, operation: "fetch" | "submit") => {
    if (operation === "fetch") {
      await get().fetchDocuments(role, true);
    } else if (operation === "submit") {
      await get().submitDocuments(role);
    }
  },

  // State management operations
  resetSubmitSuccess: (role: string) => {
    set((state) => ({
      submitSuccess: { ...state.submitSuccess, [role]: false },
    }));
  },

  setUseRealApi: (useReal: boolean) => {
    set({ useRealApi: useReal });
  },

  refreshDocuments: async (role: string) => {
    await get().fetchDocuments(role, true);
  },

  // Utility operations
  getDocumentRequirement: (role: string, docId: string) => {
    const documents = get().roleDocuments[role] || [];
    return documents.find((doc) => doc.id === docId);
  },

  getUploadedFilesCount: (role: string) => {
    const documents = get().roleDocuments[role] || [];
    return documents.reduce(
      (count, doc) => count + (doc.uploadedFiles?.length || 0),
      0
    );
  },

  getMandatoryCompletionStatus: (role: string) => {
    const documents = get().roleDocuments[role] || [];
    const mandatoryDocs = documents.filter((doc) => doc.mandatory);
    const completedDocs = mandatoryDocs.filter(
      (doc) => doc.uploadedFiles && doc.uploadedFiles.length > 0
    );

    return {
      completed: completedDocs.length,
      total: mandatoryDocs.length,
    };
  },

  canAddFiles: (role: string, docId: string) => {
    const doc = get().getDocumentRequirement(role, docId);
    return doc?.status !== DocumentStatus.APPROVED;
  },

  canRemoveFiles: (role: string, docId: string) => {
    const doc = get().getDocumentRequirement(role, docId);
    // Cannot remove if document is both mandatory AND approved
    if (doc?.mandatory && doc?.status === DocumentStatus.APPROVED) {
      return false;
    }
    // Can remove in all other cases
    return true;
  },

  // Error message formatting
  getErrorMessage: (error: unknown): string => {
    if (error instanceof ApiError) {
      return `${error.message} (Status: ${error.status})`;
    }

    if (error instanceof ValidationError) {
      return `Validation Error: ${error.message}`;
    }

    if (error instanceof NetworkError) {
      return `Network Error: ${error.message}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  },

  // Get file upload status
  getFileUploadStatus: (fileId: string) => {
    const state = get();
    return state.uploadStatuses[fileId];
  },
}));

// Keep the old hook for backward compatibility during migration
export const useFileUploadStatusStore = useDocumentsStore;
