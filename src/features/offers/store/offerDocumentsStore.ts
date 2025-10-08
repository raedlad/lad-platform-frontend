import { create } from "zustand";
import { DocumentFile } from "@/features/project/types/project";

export type OfferDocumentCategory = 
  | "attachments"
  | "invoices"
  | "contracts"
  | "other_documents";

interface OfferDocumentsState {
  documents: Record<OfferDocumentCategory, DocumentFile[]>;
  setDocuments: (documents: Record<OfferDocumentCategory, DocumentFile[]>) => void;
  addDocumentFile: (category: OfferDocumentCategory, file: DocumentFile) => void;
  updateDocumentFile: (
    category: OfferDocumentCategory,
    fileId: string,
    updates: Partial<DocumentFile>
  ) => void;
  removeDocumentFile: (category: OfferDocumentCategory, fileId: string) => void;
  clearDocuments: () => void;
}

const initialDocuments: Record<OfferDocumentCategory, DocumentFile[]> = {
  attachments: [],
  invoices: [],
  contracts: [],
  other_documents: [],
};

export const useOfferDocumentsStore = create<OfferDocumentsState>((set) => ({
  documents: { ...initialDocuments },
  
  setDocuments: (documents) => set({ documents }),
  
  addDocumentFile: (category, file) =>
    set((state) => ({
      documents: {
        ...state.documents,
        [category]: [...state.documents[category], file],
      },
    })),
    
  updateDocumentFile: (category, fileId, updates) =>
    set((state) => ({
      documents: {
        ...state.documents,
        [category]: state.documents[category].map((file) =>
          file.id === fileId ? { ...file, ...updates } : file
        ),
      },
    })),
    
  removeDocumentFile: (category, fileId) =>
    set((state) => ({
      documents: {
        ...state.documents,
        [category]: state.documents[category].filter((file) => file.id !== fileId),
      },
    })),
    
  clearDocuments: () => set({ documents: { ...initialDocuments } }),
}));
