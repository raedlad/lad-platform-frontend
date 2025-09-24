import { create } from "zustand";
import { UserProject, Project } from "../types/project";

interface ProjectsStoreState {
  projects: UserProject[];
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: UserProject[]) => void;
  addProject: (project: UserProject) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useProjectsStore = create<ProjectsStoreState>()((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((userProject) =>
        userProject.project.id === projectId
          ? {
              ...userProject,
              project: { ...userProject.project, ...updates },
              updated_at: new Date().toISOString(),
            }
          : userProject
      ),
    })),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter(
        (userProject) => userProject.project.id !== projectId
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
