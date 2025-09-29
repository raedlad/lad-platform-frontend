import { useState, useEffect } from "react";
import { documentsApi, Document } from "../services/documentsApi";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await documentsApi.getUploadedDocuments();
      if (response.success) {
        setDocuments(response.data || []);
      } else {
        setError(response.message || "Failed to fetch documents");
      }
    } catch (err) {
      setError("Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: number) => {
    try {
      const response = await documentsApi.deleteDocument(documentId);
      if (response.success) {
        // Remove the document from local state
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      return { success: false, message: "Failed to delete document" };
    }
  };

  const uploadDocument = async (formData: FormData) => {
    try {
      const response = await documentsApi.uploadDocument(formData);
      if (response.success && response.data) {
        // Add the new document to local state
        setDocuments((prev) => [...prev, response.data!]);
        return {
          success: true,
          message: response.message,
          document: response.data,
        };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      return { success: false, message: "Failed to upload document" };
    }
  };

  const refreshDocuments = () => {
    fetchDocuments();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    deleteDocument,
    uploadDocument,
    refreshDocuments,
  };
};
