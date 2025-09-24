import {
  DocumentRequirement,
  DocumentStatus,
  UploadedFile,
} from "@/features/profile/types/documents";
import api from "@/lib/api";

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  response: T;
  message?: string;
  error?: string;
}

export interface UploadResponse {
  file: UploadedFile;
  message: string;
}

// Custom Error Classes
export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network connection failed") {
    super(message);
    this.name = "NetworkError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Utility functions for axios responses
const handleApiResponse = <T>(response: any): T => {
  // For axios, successful responses are already parsed
  if (response.data) {
    return response.data;
  }
  throw new ApiError("Invalid response format", response.status);
};

const handleApiError = (error: any): never => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const errorData = error.response.data;
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      error.message ||
      `HTTP ${status}`;
    const errorCode = errorData?.code || status.toString();

    throw new ApiError(errorMessage, status, errorCode);
  } else if (error.request) {
    // Network error - no response received
    throw new NetworkError("Network connection failed");
  } else {
    // Other error
    throw new ApiError(error.message || "Unknown error occurred", 0);
  }
};

// Enhanced Documents Service
export const documentsService = {
  // Fetch documents for a role - returns raw backend data
  async fetchDocuments(role: string): Promise<any[]> {
    try {
      const response = await api.get(`general-user/require-documents`);
      const result = handleApiResponse<ApiResponse<any[]>>(response);

      if (!result.response) {
        throw new ApiError("Failed to fetch documents", 400);
      }
      console.log("Backend response:", result.response);
      return result.response;
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      return handleApiError(error);
    }
  },

  // Adapter to map backend profile payload to our DocumentRequirement[]
  mapBackendDocuments(
    documentTypes: Array<any>,
    documents: Array<any>
  ): DocumentRequirement[] {
    const uploadedByCode: Record<string, UploadedFile[]> = {};
    // Map existing uploaded docs if provided
    (documents || []).forEach((doc) => {
      const code = doc.document_type || doc.code || doc.type_code || "";
      if (!code) return;
      const file: UploadedFile = {
        id: String(doc.id ?? `${code}-${Date.now()}`),
        fileName: doc.file_name || doc.filename || "file",
        customName: doc.custom_name || undefined,
        description: doc.description || "",
        fileUrl: doc.file_url || doc.url || "",
        uploadedAt: doc.uploaded_at || new Date().toISOString(),
        expiryDate: doc.expiry_date || undefined,
        status:
          (doc.status as any) === "approved"
            ? DocumentStatus.APPROVED
            : (doc.status as any) === "rejected"
            ? DocumentStatus.REJECTED
            : DocumentStatus.PENDING,
        size: doc.size || undefined,
      };
      uploadedByCode[code] = uploadedByCode[code] || [];
      uploadedByCode[code].push(file);
    });

    return (documentTypes || []).map((t) => {
      const acceptExts: string[] = Array.isArray(t.accepted_file_types)
        ? t.accepted_file_types
        : [];
      return {
        id: String(t.id || t.document_type_id), // Use the actual document type ID from backend
        label: t.name,
        mandatory: String(t.category).toLowerCase() === "mandatory",
        maxFiles: t.allow_multiple_files ? t.max_files_count || 10 : 1,
        maxFileSize: Number(t.max_file_size_mb) || 5,
        acceptTypes: acceptExts.map((ext: string) =>
          ext.startsWith(".") ? ext : ext.includes("/") ? ext : `.${ext}`
        ),
        status: undefined,
        uploadedFiles: uploadedByCode[t.code] || [],
        reviewComment: undefined,
      } as DocumentRequirement;
    });
  },

  // Upload file using /base/document/upload-document endpoint
  async uploadFile(
    role: string,
    docId: string,
    file: File,
    metadata?: {
      customName?: string;
      description?: string;
      expiryDate?: string;
    }
  ): Promise<UploadResponse> {
    try {
      console.log("Starting file upload:", {
        role,
        docId,
        fileName: file.name,
        fileSize: file.size,
      });

      // Validate file before upload
      if (!file) {
        throw new ValidationError("No file provided");
      }

      if (file.size === 0) {
        throw new ValidationError("Empty file not allowed");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type_id", String(parseInt(docId, 10))); // Ensure it's a valid integer

      // Add metadata if provided
      if (metadata?.customName) {
        formData.append("custom_name", metadata.customName);
      }
      if (metadata?.description) {
        formData.append("description", metadata.description);
      }
      if (metadata?.expiryDate) {
        formData.append("expiry_date", metadata.expiryDate);
      }

      console.log(
        "FormData prepared, making API call to /base/document/upload-document"
      );

      const response = await api.post(
        "/base/document/upload-document",
        formData,
        {
          headers: {
            "Content-Type": undefined, // Let axios set the correct multipart boundary
          },
        }
      );

      console.log("Upload response received:", response);

      const result = handleApiResponse<ApiResponse<any>>(response);

      console.log("Parsed response:", result);

      // Transform the response to match our UploadResponse interface
      // Backend returns file data directly in result.response, not result.response.file
      const fileData = result.response;

      return {
        file: {
          id: fileData.id?.toString() || `${docId}-${Date.now()}`,
          fileName: fileData.original_filename || file.name,
          customName: fileData.name || metadata?.customName || file.name,
          description: fileData.description || metadata?.description || "",
          fileUrl: fileData.file_path || "", // Use file_path from backend
          uploadedAt: fileData.created_at || new Date().toISOString(),
          expiryDate: fileData.expiry_date || metadata?.expiryDate,
          status: (fileData.status as DocumentStatus) || DocumentStatus.PENDING,
          size: fileData.file_size || file.size,
        },
        message: result.message || "File uploaded successfully",
      };
    } catch (error) {
      console.error("Upload error details:", error);
      if (
        error instanceof ApiError ||
        error instanceof ValidationError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      // Handle axios errors properly
      return handleApiError(error);
    }
  },

  // Remove file
  async removeFile(
    role: string,
    docId: string,
    fileId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/files/${fileId}`);

      return handleApiResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      return handleApiError(error);
    }
  },

  // Download file
  async downloadFile(
    role: string,
    docId: string,
    fileId: string
  ): Promise<string> {
    try {
      console.log("Downloading file:", { role, docId, fileId });

      const response = await api.get(`/files/${fileId}/download`, {
        responseType: "blob", // Important for file downloads
      });

      console.log("Download response received:", response);

      // For file downloads, we need to create a blob URL
      const blob = new Blob([response.data]);
      const downloadUrl = URL.createObjectURL(blob);

      return downloadUrl;
    } catch (error) {
      console.error("Download error details:", error);

      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      return handleApiError(error);
    }
  },

  // Submit documents for review
  async submitDocuments(
    role: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`/api/documents/${role}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return handleApiResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      if (error instanceof ApiError || error instanceof NetworkError) {
        throw error;
      }
      return handleApiError(error);
    }
  },

  // Retry utility for failed operations
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry validation errors or client errors (4xx)
        if (
          error instanceof ValidationError ||
          (error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500)
        ) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  },
};
