import { useState } from "react";

export interface Document {
  id: string;
  name: string;
  type: string;
  category: "mandatory" | "optional";
  status: "pending" | "verified" | "rejected";
  uploadDate: string;
  size: string;
  url?: string;
  rejectionReason?: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "National ID",
      type: "Identity Document",
      category: "mandatory",
      status: "verified",
      uploadDate: "2024-01-15",
      size: "2.1 MB",
      url: "/documents/national-id.pdf",
    },
    {
      id: "2",
      name: "Professional License",
      type: "Professional Certificate",
      category: "mandatory",
      status: "verified",
      uploadDate: "2024-01-16",
      size: "1.8 MB",
      url: "/documents/professional-license.pdf",
    },
    {
      id: "3",
      name: "Commercial Registration",
      type: "Business License",
      category: "mandatory",
      status: "pending",
      uploadDate: "2024-01-20",
      size: "1.5 MB",
      url: "/documents/commercial-reg.pdf",
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const uploadDocument = async (file: File, documentType: string) => {
    setIsUploading(true);

    try {
      // Simulate upload progress
      setUploadProgress((prev) => ({ ...prev, [documentType]: 0 }));

      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress((prev) => ({ ...prev, [documentType]: progress }));
      }

      // Add new document
      const newDocument: Document = {
        id: Date.now().toString(),
        name: documentType,
        type: "Document",
        category: "mandatory",
        status: "pending",
        uploadDate: new Date().toISOString().split("T")[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        url: URL.createObjectURL(file),
      };

      setDocuments((prev) => [...prev, newDocument]);

      // Remove progress indicator
      setUploadProgress((prev) => {
        const updated = { ...prev };
        delete updated[documentType];
        return updated;
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const getDocumentStats = () => {
    const verified = documents.filter(
      (doc) => doc.status === "verified"
    ).length;
    const pending = documents.filter((doc) => doc.status === "pending").length;
    const rejected = documents.filter(
      (doc) => doc.status === "rejected"
    ).length;
    const total = documents.length;

    return { verified, pending, rejected, total };
  };

  const getRequiredDocuments = (userRole: string) => {
    const baseDocuments = [
      {
        name: "National ID",
        type: "Identity Document",
        category: "mandatory" as const,
      },
      {
        name: "Passport Photo",
        type: "Identity Document",
        category: "mandatory" as const,
      },
    ];

    const roleSpecificDocuments = {
      Individual: [],
      Organization: [
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
      ],
      "Engineering Office": [
        {
          name: "Professional License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
        {
          name: "VAT Certificate",
          type: "Tax Document",
          category: "optional" as const,
        },
      ],
      "Freelance Engineer": [
        {
          name: "Professional License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
        {
          name: "Technical CV",
          type: "Resume",
          category: "mandatory" as const,
        },
      ],
      Contractor: [
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
        {
          name: "Contractor License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
      ],
      Supplier: [
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
        {
          name: "Supplier License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
      ],
    };

    return [
      ...baseDocuments,
      ...(roleSpecificDocuments[
        userRole as keyof typeof roleSpecificDocuments
      ] || []),
    ];
  };

  const getMissingDocuments = (userRole: string) => {
    const required = getRequiredDocuments(userRole);
    const uploadedNames = documents.map((doc) => doc.name);
    return required.filter((req) => !uploadedNames.includes(req.name));
  };

  return {
    documents,
    isUploading,
    uploadProgress,
    uploadDocument,
    deleteDocument,
    getDocumentStats,
    getRequiredDocuments,
    getMissingDocuments,
  };
}
