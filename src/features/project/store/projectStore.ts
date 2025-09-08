import { create } from 'zustand'  
import { Project, ProjectType } from '../types/project'

interface ProjectStoreState {
  isLoading: boolean;
  error: string | null;
  editing: boolean;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  project: Project | null;
  projectTypes: ProjectType[] | null;
  setProjectTypes: (projectTypes: ProjectType[]) => void;
  setProject: (project: Project) => void;
}

export const useProjectStore = create<ProjectStoreState>()((set) => ({
  isLoading: false,
  error: null,
  editing: false,
  setEditing: (editing: boolean) => set({ editing }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  project: null,
  projectTypes: null,
  setProjectTypes: (projectTypes) => set({ projectTypes }),
  setProject: (project) => set({ project }),
}));

export default useProjectStore;