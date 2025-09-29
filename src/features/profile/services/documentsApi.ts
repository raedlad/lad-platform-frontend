import api from "@/lib/api";

// Document interface based on the profile structure
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

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
}

export const documentsApi = {
  // Get uploaded documents
  async getUploadedDocuments(): Promise<ApiResponse<Document[]>> {
    try {
      const response = await api.get("/base/document/uploaded-documents");
      return {
        success: response.data.success,
        data: response.data.response || response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error fetching uploaded documents:", error);
      return {
        success: false,
        data: [],
        message: error?.response?.data?.message || "Failed to fetch documents",
      };
    }
  },

  // Delete a document
  async deleteDocument(documentId: number): Promise<ApiResponse<any>> {
    try {
      const response = await api.delete(
        `/base/document/uploaded-documents/${documentId}`
      );
      return {
        success: response.data.success,
        data: response.data.response || response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error deleting document:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to delete document",
      };
    }
  },

  // Upload a document
  async uploadDocument(formData: FormData): Promise<ApiResponse<Document>> {
    try {
      const response = await api.post(
        "/base/document/uploaded-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return {
        success: response.data.success,
        data: response.data.response || response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Error uploading document:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to upload document",
      };
    }
  },
};
