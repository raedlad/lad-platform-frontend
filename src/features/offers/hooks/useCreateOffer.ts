import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOfferDocumentsStore } from "../store/offerDocumentsStore";
import { useOfferStore } from "../store/offerStore";

export const useCreateOffer = () => {
  const router = useRouter();
  const {
    documents,
    addDocumentFile,
    updateDocumentFile,
    removeDocumentFile,
    clearDocuments,
  } = useOfferDocumentsStore();

  const {
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    totalSteps,
    setTotalSteps,
    resetOfferCreation,
  } = useOfferStore();

  const initializeOfferCreation = useCallback(() => {
    setTotalSteps(5);
    setCurrentStep(1);
    setCompletedSteps(0);
  }, [setCurrentStep, setCompletedSteps, setTotalSteps]);

  const resetOffer = useCallback(() => {
    clearDocuments();
    resetOfferCreation();
  }, [clearDocuments, resetOfferCreation]);

  const handleFileUpload = useCallback(
    async (category: keyof typeof documents, files: File[]) => {
      const newDocuments = files.map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        file,
        uploadStatus: "uploading" as const,
        uploadProgress: 0,
        url: "",
      }));

      newDocuments.forEach((doc) => {
        addDocumentFile(category, doc);
      });

      try {
        newDocuments.forEach((doc) => {
          updateDocumentFile(category, doc.id, {
            uploadStatus: "completed",
            url: `https://example.com/uploads/${doc.id}-${doc.name}`,
          });
        });
      } catch (error) {
        newDocuments.forEach((doc) => {
          updateDocumentFile(category, doc.id, {
            uploadStatus: "error",
            error: "Failed to upload file",
          });
        });
      }
    },
    [addDocumentFile, updateDocumentFile, documents]
  );

  const handleFileRemoval = useCallback(
    async (category: keyof typeof documents, fileId: string) => {
      try {
        removeDocumentFile(category, fileId);
      } catch (error) {
        throw error;
      }
    },
    [removeDocumentFile, documents]
  );

  const handleFileReupload = useCallback(
    async (category: keyof typeof documents, fileId: string, file: File) => {
      try {
        updateDocumentFile(category, fileId, {
          name: file.name,
          type: file.type,
          size: file.size,
          file,
          uploadStatus: "uploading",
          error: undefined,
        });

        updateDocumentFile(category, fileId, {
          uploadStatus: "completed",
          url: `https://example.com/uploads/${fileId}-${file.name}`,
        });
      } catch (error) {
        updateDocumentFile(category, fileId, {
          uploadStatus: "error",
          error: "Failed to re-upload file",
        });
      }
    },
    [updateDocumentFile, documents]
  );

  return {
    documents,
    currentStep,
    completedSteps,
    totalSteps,
    initializeOfferCreation,
    resetOffer,
    setCurrentStep,
    setCompletedSteps,
    handleFileUpload,
    handleFileRemoval,
    handleFileReupload,
  };
};

export default useCreateOffer;
