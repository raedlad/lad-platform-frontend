import { create } from "zustand";
import {
  Level,
  Project,
  ProjectClassification,
  ProjectClassificationJob,
  ProjectEssentialInfo,
  ProjectType,
  ProjectDocuments,
} from "../types/project";
import { WorkType } from "../types/project";

export interface DocumentFile {
  id: string;
  file: File | null; // Can be null when loaded from backend
  name: string;
  size: number;
  type: string;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadProgress: number;
  url?: string;
  error?: string;
}

export interface DocumentsState {
  architectural_plans: DocumentFile[];
  licenses: DocumentFile[];
  specifications: DocumentFile[];
  site_photos: DocumentFile[];
}

interface ProjectStoreState {
  isLoading: boolean;
  isLoadingProjectData: boolean;
  setLoadingProjectData: (loading: boolean) => void;
  error: string | null;
  editing: boolean;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  project: Project | null;
  projectId: string | null;
  projectTypes: ProjectType[] | null;
  setProjectId: (projectId: string) => void;
  setProjectTypes: (projectTypes: ProjectType[]) => void;
  setProject: (project: Project) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: number;
  setCompletedSteps: (steps: number) => void;
  totalSteps: number;
  setTotalSteps: (steps: number) => void;
  workTypes: WorkType[] | null;
  setWorkTypes: (workTypes: WorkType[]) => void;
  projectClassificationJobs: ProjectClassificationJob[] | null;
  setProjectClassificationJobs: (
    projectClassificationJobs: ProjectClassificationJob[]
  ) => void;
  projectClassificationLevels: Level[] | null;
  setProjectClassificationLevels: (
    projectClassificationLevels: Level[]
  ) => void;
  originalClassificationData: ProjectClassification | null;
  setOriginalClassificationData: (data: ProjectClassification | null) => void;
  hasClassificationDataChanged: (currentData: any) => boolean;
  originalEssentialInfoData: ProjectEssentialInfo | null;
  setOriginalEssentialInfoData: (data: ProjectEssentialInfo | null) => void;
  hasEssentialInfoDataChanged: (currentData: any) => boolean;
  // Documents state and methods
  documents: DocumentsState;
  setDocuments: (documents: DocumentsState) => void;
  addDocumentFile: (category: keyof DocumentsState, file: DocumentFile) => void;
  updateDocumentFile: (
    category: keyof DocumentsState,
    fileId: string,
    updates: Partial<DocumentFile>
  ) => void;
  removeDocumentFile: (category: keyof DocumentsState, fileId: string) => void;
}

export const useProjectStore = create<ProjectStoreState>()((set, get) => ({
  isLoading: false,
  isLoadingProjectData: false,
  setLoadingProjectData: (loading: boolean) =>
    set({ isLoadingProjectData: loading }),
  error: null,
  editing: false,
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  project: null,
  projectId: null,
  setProjectId: (projectId: string) => set({ projectId }),
  projectTypes: null,
  setProjectTypes: (projectTypes) => set({ projectTypes }),
  setProject: (project) => set({ project }),
  currentStep: 1,
  setCurrentStep: (step: number) => set({ currentStep: step }),
  completedSteps: 0,
  setCompletedSteps: (steps: number) => set({ completedSteps: steps }),
  totalSteps: 5,
  setTotalSteps: (steps: number) => set({ totalSteps: steps }),
  originalEssentialInfoData: null,
  setOriginalEssentialInfoData: (data) =>
    set({ originalEssentialInfoData: data }),
  workTypes: null,
  setWorkTypes: (workTypes) => set({ workTypes }),
  projectClassificationJobs: null,
  setProjectClassificationJobs: (projectClassificationJobs) =>
    set({ projectClassificationJobs }),
  projectClassificationLevels: null,
  setProjectClassificationLevels: (projectClassificationLevels) =>
    set({ projectClassificationLevels }),
  originalClassificationData: null,
  setOriginalClassificationData: (data) =>
    set({ originalClassificationData: data }),

  // hasClassificationDataChanged
  hasClassificationDataChanged: (currentData) => {
    const { originalClassificationData } = get();
    if (!originalClassificationData) return true;

    return (
      originalClassificationData.jobId !== currentData.jobId ||
      originalClassificationData.workTypeId !== currentData.workTypeId ||
      originalClassificationData.levelId !== currentData.levelId ||
      originalClassificationData.notes !== (currentData.notes || "")
    );
  },

  // hasEssentialInfoDataChanged
  hasEssentialInfoDataChanged: (currentData) => {
    const { originalEssentialInfoData } = get();
    if (!originalEssentialInfoData) return true;

    return (
      originalEssentialInfoData.name !== currentData.name ||
      originalEssentialInfoData.type !== currentData.type ||
      originalEssentialInfoData.city !== currentData.city ||
      originalEssentialInfoData.district !== currentData.district ||
      originalEssentialInfoData.location !== currentData.location ||
      originalEssentialInfoData.budget !== currentData.budget ||
      originalEssentialInfoData.budget_unit !== currentData.budget_unit ||
      originalEssentialInfoData.duration !== currentData.duration ||
      originalEssentialInfoData.duration_unit !== currentData.duration_unit ||
      originalEssentialInfoData.area_sqm !== currentData.area_sqm ||
      originalEssentialInfoData.description !== currentData.description
    );
  },

  // Documents methods
  documents: {
    architectural_plans: [],
    licenses: [],
    specifications: [],
    site_photos: [],
  },
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
        [category]: state.documents[category].filter(
          (file) => file.id !== fileId
        ),
      },
    })),
}));

export default useProjectStore;
