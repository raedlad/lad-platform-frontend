import { create } from "zustand";
import {
  Level,
  Project,
  ProjectClassification,
  ProjectClassificationJob,
  ProjectEssentialInfo,
  ProjectType,
  DocumentsState,
  DocumentFile,
  BOQItem,
  BOQTemplate,
  Unit,
  BOQData,
  PublishSettings,
  ProjectStatus,
} from "../types/project";
import { WorkType } from "../types/project";

interface ProjectStoreState {
  projectStatus: ProjectStatus;
  setProjectStatus: (projectStatus: ProjectStatus) => void;
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

  // BOQ state and methods
  boqData: BOQData;
  originalBOQData: BOQData | null;
  boqTemplates: BOQTemplate[] | null;
  units: Unit[] | null;
  setBOQData: (boqData: BOQData) => void;
  setOriginalBOQData: (boqData: BOQData | null) => void;
  setBOQTemplates: (templates: BOQTemplate[]) => void;
  setUnits: (units: Unit[]) => void;
  addBOQItem: (item: BOQItem) => void;
  updateBOQItem: (itemId: string, updates: Partial<BOQItem>) => void;
  removeBOQItem: (itemId: string) => void;
  resetBOQ: () => void;
  hasBOQDataChanged: (currentData: any) => boolean;
  loadBOQTemplate: (templateId: number) => void;
  publishSettings: PublishSettings | null;
  setPublishSettings: (publishSettings: PublishSettings) => void;
  hasPublishSettingsChanged: (currentData: any) => boolean;

  // Project creation flow management
  resetProjectCreation: () => void;
  initializeProjectCreation: () => void;
  isProjectCreationComplete: () => boolean;

  // Step management
  canAccessStep: (step: number) => boolean;
  completeCurrentStep: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const useProjectStore = create<ProjectStoreState>()((set, get) => ({
  projectStatus: { status: "in_progress" },
  setProjectStatus: (projectStatus) => set({ projectStatus }),
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
  totalSteps: 6,
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
        [category]: state.documents[category].map((file: DocumentFile) =>
          file.id === fileId ? { ...file, ...updates } : file
        ),
      },
    })),
  removeDocumentFile: (category, fileId) =>
    set((state) => ({
      documents: {
        ...state.documents,
        [category]: state.documents[category].filter(
          (file: DocumentFile) => file.id !== fileId
        ),
      },
    })),

  // BOQ state and methods
  boqData: {
    items: [],
    total_amount: 0,
  },
  originalBOQData: null,
  boqTemplates: null,
  units: null,
  setBOQData: (boqData) => set({ boqData }),
  setOriginalBOQData: (boqData) => set({ originalBOQData: boqData }),
  setBOQTemplates: (templates) => set({ boqTemplates: templates }),
  setUnits: (units) => set({ units }),
  addBOQItem: (item) =>
    set((state) => {
      const newItem = {
        ...item,
        id:
          item.id ||
          `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      const newItems = [...state.boqData.items, newItem];
      const total_amount = newItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      return {
        boqData: {
          ...state.boqData,
          items: newItems,
          total_amount,
        },
      };
    }),
  updateBOQItem: (itemId, updates) =>
    set((state) => {
      const newItems = state.boqData.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      const total_amount = newItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      return {
        boqData: {
          ...state.boqData,
          items: newItems,
          total_amount,
        },
      };
    }),
  removeBOQItem: (itemId) =>
    set((state) => {
      const newItems = state.boqData.items.filter((item) => item.id !== itemId);
      const total_amount = newItems.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
      );
      return {
        boqData: {
          ...state.boqData,
          items: newItems,
          total_amount,
        },
      };
    }),
  resetBOQ: () =>
    set({
      boqData: {
        items: [],
        total_amount: 0,
      },
    }),
  loadBOQTemplate: (templateId) =>
    set((state) => {
      const template = state.boqTemplates?.find((t) => t.id === templateId);
      if (template) {
        const total_amount = template.items.reduce(
          (sum, item) => sum + item.quantity * item.unit_price,
          0
        );
        return {
          boqData: {
            items: template.items.map((item) => ({
              ...item,
              id: `item_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
            })),
            total_amount,
            template_id: templateId,
          },
        };
      }
      return state;
    }),
  hasBOQDataChanged: (currentData) => {
    const { originalBOQData } = get();
    if (!originalBOQData) return true;

    if (
      (originalBOQData.items?.length || 0) !== (currentData.items?.length || 0)
    ) {
      return true;
    }

    const hasItemChanged = (originalBOQData.items || []).some((item, index) => {
      const currentItem = (currentData.items || [])[index];
      if (!currentItem) return true;

      return (
        item.name !== currentItem.name ||
        item.description !== currentItem.description ||
        item.unit_id !== currentItem.unit_id ||
        item.quantity !== currentItem.quantity ||
        item.unit_price !== currentItem.unit_price ||
        item.sort_order !== currentItem.sort_order ||
        item.is_required !== currentItem.is_required
      );
    });
    const hasMetadataChanged =
      originalBOQData.total_amount !== currentData.total_amount ||
      originalBOQData.template_id !== currentData.template_id;

    return hasItemChanged || hasMetadataChanged;
  },
  publishSettings: null,
  setPublishSettings: (publishSettings) => set({ publishSettings }),
  hasPublishSettingsChanged: (currentData) => {
    const { publishSettings } = get();
    if (!publishSettings) return true;
    return (
      publishSettings.notify_matching_contractors !==
        currentData.notify_matching_contractors ||
      publishSettings.notify_client_on_offer !==
        currentData.notify_client_on_offer ||
      publishSettings.offers_window_days !== currentData.offers_window_days
    );
  },

  // Project creation flow management
  resetProjectCreation: () =>
    set({
      projectId: null,
      project: null,
      currentStep: 0,
      completedSteps: 0,
      originalClassificationData: null,
      originalEssentialInfoData: null,
      originalBOQData: null,
      publishSettings: null,
      documents: {
        architectural_plans: [],
        licenses: [],
        specifications: [],
        site_photos: [],
      },
      boqData: {
        items: [],
        total_amount: 0,
      },
      error: null,
      isLoading: false,
    }),

  initializeProjectCreation: () =>
    set({
      currentStep: 0,
      completedSteps: 0,
      error: null,
      isLoading: false,
    }),

  isProjectCreationComplete: () => {
    const { completedSteps, totalSteps } = get();
    return completedSteps >= totalSteps;
  },

  // Step management functions
  canAccessStep: (step: number) => {
    const { completedSteps } = get();
    return step <= completedSteps + 1;
  },

  completeCurrentStep: () => {
    const { currentStep, completedSteps, totalSteps } = get();
    const newCompletedSteps = Math.max(completedSteps, currentStep);

    if (newCompletedSteps < totalSteps) {
      set({
        completedSteps: newCompletedSteps,
        currentStep: newCompletedSteps + 1,
      });
    } else {
      set({
        completedSteps: newCompletedSteps,
        currentStep: totalSteps,
      });
    }
  },

  goToNextStep: () => {
    const { currentStep, completedSteps, totalSteps } = get();
    const nextStep = Math.min(currentStep + 1, totalSteps);

    if (nextStep <= completedSteps + 1) {
      set({ currentStep: nextStep });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    const prevStep = Math.max(currentStep - 1, 1);
    set({ currentStep: prevStep });
  },
}));

export default useProjectStore;
