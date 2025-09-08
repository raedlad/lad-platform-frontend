import {
  DocumentRequirement,
  DocumentStatus,
  UploadedFile,
} from "@/features/profile/types/documents";
import api from "@/lib/api";

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
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

// Utility functions
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode = response.status.toString();

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorCode = errorData.code || errorCode;
    } catch {
      // If response is not JSON, use default error message
    }

    throw new ApiError(errorMessage, response.status, errorCode);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError("Invalid response format", response.status);
  }
};

// Enhanced Documents Service
export const documentsService = {
  // Fetch documents for a role
  async fetchDocuments(role: string): Promise<DocumentRequirement[]> {
    try {
      const response = await api.get(`/api/documents/${role}`);

      const data = await handleApiResponse<ApiResponse<DocumentRequirement[]>>(
        response.data
      );
      return data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError("Failed to fetch documents");
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

      const response = await api.post(
        "/base/document/upload-document",
        formData,
        {
          headers: {
            "Content-Type": undefined, // Let axios set the correct multipart boundary
          },
        }
      );

      const result = await handleApiResponse<ApiResponse<UploadResponse>>(
        response.data
      );

      // Transform the response to match our UploadResponse interface
      return {
        file: {
          id: result.data.file.id || `${docId}-${Date.now()}`,
          fileName: result.data.file.fileName || file.name,
          customName: result.data.file.customName || metadata?.customName,
          description:
            result.data.file.description || metadata?.description || "",
          fileUrl: result.data.file.fileUrl || "",
          uploadedAt: result.data.file.uploadedAt || new Date().toISOString(),
          expiryDate: result.data.file.expiryDate || metadata?.expiryDate,
          status: result.data.file.status || DocumentStatus.PENDING,
          size: result.data.file.size || file.size,
        },
        message: result.message || "File uploaded successfully",
      };
    } catch (error) {
      if (error instanceof ApiError || error instanceof ValidationError) {
        throw error;
      }
      throw new NetworkError("Upload failed due to network error");
    }
  },

  // Remove file
  async removeFile(
    role: string,
    docId: string,
    fileId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(
        `/files/${fileId}`,
      );

      return await handleApiResponse<{ success: boolean; message: string }>(
        response.data
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError("Failed to remove file");
    }
  },

  // Download file
  async downloadFile(
    role: string,
    docId: string,
    fileId: string
  ): Promise<string> {
    try {
      const response = await api.get(`/files/${fileId}/download`);

      if (response.status !== 200) {
        throw new ApiError(
          `Download failed: HTTP ${response.status}`,
          response.status
        );
      }

      const blob = await response.data.blob();
      return window.URL.createObjectURL(blob);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError("Failed to download file");
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

      return await handleApiResponse<{ success: boolean; message: string }>(
        response
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError("Failed to submit documents");
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
