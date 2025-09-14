export interface Project {
  id: string;
  essential_info: ProjectEssentialInfo;
  classification: ProjectClassification[];
  documents: ProjectDocuments[];
}

export interface ProjectEssentialInfo {
  name: string;
  type: ProjectType[];
  city: string;
  district: string;
  location: string;
  budget: number;
  budget_unit: string;
  duration: number;
  duration_unit: string;
  area_sqm: number;
  description: string;
}

export interface ProjectClassificationJob {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}
export interface WorkType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface Level {
  id: number;
  level: number;
  label: string;
  sort_order: number;
}
export interface ProjectClassification {
  id: number;
  job: ProjectClassificationJob;
  workType: WorkType;
  level: Level;
  notes: string;
}

export interface ProjectDocuments {
  id: string;
  file_name: string;
  file: File;
}

export interface ProjectType{
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}