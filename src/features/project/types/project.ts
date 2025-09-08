export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  location: string;
  budget: number;
  timeline: string;
  requiredSkills: string[];
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

export interface ProjectType{
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}