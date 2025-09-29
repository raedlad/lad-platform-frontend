import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  AchievedProject,
  AchievedProjectFormData,
  ProjectType,
  AchievedProjectsFilters,
  CreateAchievedProjectRequest,
  UpdateAchievedProjectRequest,
} from "../types/achievedProjects";
import { achievedProjectsApi } from "../services/achievedProjectsApi";

interface AchievedProjectsState {
  // Data
  projects: AchievedProject[];
  projectTypes: ProjectType[];
  currentProject: AchievedProject | null;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Pagination
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;

  // Filters
  filters: AchievedProjectsFilters;

  // Actions
  setProjects: (projects: AchievedProject[]) => void;
  setProjectTypes: (types: ProjectType[]) => void;
  setCurrentProject: (project: AchievedProject | null) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (total: number, page: number, limit: number) => void;
  setFilters: (filters: AchievedProjectsFilters) => void;
  clearError: () => void;

  // API Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  fetchProjectTypes: () => Promise<void>;
  createProject: (
    data: CreateAchievedProjectRequest
  ) => Promise<AchievedProject>;
  updateProject: (
    id: number,
    data: UpdateAchievedProjectRequest
  ) => Promise<AchievedProject>;
  deleteProject: (id: number) => Promise<void>;

  // Utility Actions
  addProject: (project: AchievedProject) => void;
  updateProjectInList: (project: AchievedProject) => void;
  removeProjectFromList: (id: number) => void;
  reset: () => void;
}

const initialState = {
  projects: [],
  projectTypes: [],
  currentProject: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  hasMore: false,
  filters: {},
};

export const useAchievedProjectsStore = create<AchievedProjectsState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setProjects: (projects) => set({ projects }),
      setProjectTypes: (types) => set({ projectTypes: types }),
      setCurrentProject: (project) => set({ currentProject: project }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSubmitting: (submitting) => set({ isSubmitting: submitting }),
      setError: (error) => set({ error }),
      setPagination: (total, page, limit) =>
        set({
          total,
          page,
          limit,
          hasMore: page * limit < total,
        }),
      setFilters: (filters) => set({ filters }),
      clearError: () => set({ error: null }),

      // API Actions
      fetchProjects: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await achievedProjectsApi.getAchievedProjects();

          set({
            projects: response.response || [],
            projectTypes: get().projectTypes, // No project types in this response
            total: response.response?.length || 0,
            page: 1,
            hasMore: false, // No pagination since we're fetching all at once
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch projects",
            isLoading: false,
          });
        }
      },

      fetchProject: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const project = await achievedProjectsApi.getAchievedProject(id);
          set({ currentProject: project, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch project",
            isLoading: false,
          });
        }
      },

      fetchProjectTypes: async () => {
        try {
          const types = await achievedProjectsApi.fetchProjectTypes();
          set({ projectTypes: types });
        } catch (error) {
          console.error("Failed to fetch project types:", error);
        }
      },

      createProject: async (data) => {
        try {
          set({ isSubmitting: true, error: null });
          const project = await achievedProjectsApi.createAchievedProject(data);

          // Add to the beginning of the list
          set({
            projects: [project, ...(get().projects || [])],
            isSubmitting: false,
          });

          return project;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create project";
          set({ error: errorMessage, isSubmitting: false });
          throw new Error(errorMessage);
        }
      },

      updateProject: async (id, data) => {
        try {
          set({ isSubmitting: true, error: null });
          const project = await achievedProjectsApi.updateAchievedProject(
            id,
            data
          );

          // Update in the list
          const updatedProjects = (get().projects || []).map((p) =>
            p.id === project.id ? project : p
          );
          set({
            projects: updatedProjects,
            currentProject: project,
            isSubmitting: false,
          });

          return project;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update project";
          set({ error: errorMessage, isSubmitting: false });
          throw new Error(errorMessage);
        }
      },

      // updateProject: async (data) => {
      //   // Update functionality not available in current API
      //   throw new Error("Update not supported by current API");
      // },

      deleteProject: async (id) => {
        try {
          set({ isSubmitting: true, error: null });
          await achievedProjectsApi.deleteAchievedProject(id);

          // Remove from the list
          const updatedProjects = (get().projects || []).filter(
            (p) => p.id !== id
          );
          set({
            projects: updatedProjects,
            currentProject:
              get().currentProject?.id === id ? null : get().currentProject,
            isSubmitting: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to delete project";
          set({ error: errorMessage, isSubmitting: false });
          throw new Error(errorMessage);
        }
      },

      // reorderProjects: async (projectIds) => {
      //   // Reorder functionality not available in current API
      //   throw new Error("Reorder not supported by current API");
      // },

      // Utility Actions
      addProject: (project) => {
        set({ projects: [project, ...(get().projects || [])] });
      },

      updateProjectInList: (project) => {
        const updatedProjects = (get().projects || []).map((p) =>
          p.id === project.id ? project : p
        );
        set({ projects: updatedProjects });
      },

      removeProjectFromList: (id) => {
        const updatedProjects = (get().projects || []).filter(
          (p) => p.id !== id
        );
        set({ projects: updatedProjects });
      },

      reset: () => set(initialState),
    }),
    {
      name: "achieved-projects-store",
    }
  )
);
