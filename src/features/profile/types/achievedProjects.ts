// Types for Achieved Projects feature

export interface ProjectImage {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  size: string;
  size_formatted: string;
  custom_properties: any[];
  order_column: string;
  created_at: string;
  updated_at: string;
  original_url: string;
}

export interface City {
  id: number;
  name: string;
}

export interface AchievedProject {
  id: number;
  contractor_id: string;
  project_name: string;
  description: string;
  project_type: ProjectType | null;
  project_type_id: string | null;
  city: City;
  city_id: string;
  specific_location: string;
  start_date: string;
  end_date: string;
  execution_date: string;
  project_value: string;
  currency: string;
  display_order: number;
  project_features: string[] | null;
  challenges_faced: string | null;
  solutions_provided: string | null;
  project_images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface AchievedProjectFormData {
  project_name_ar: string;
  project_name_en: string;
  description_ar: string;
  description_en: string;
  project_type_id?: number | null;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  specific_location?: string;
  start_date?: string;
  end_date?: string;
  execution_date?: string;
  project_value?: number | null;
  currency?: string;
  display_order?: number;
  project_features?: string[];
  challenges_faced?: string;
  solutions_provided?: string;
  project_images?: File[];
}

export interface ProjectType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievedProjectsApiResponse {
  success: boolean;
  message: string;
  response: AchievedProject[];
}

export interface CreateAchievedProjectRequest {
  project_name_ar: string;
  project_name_en: string;
  description_ar: string;
  description_en: string;
  project_type_id?: number | null;
  country_id?: number | null;
  state_id?: number | null;
  city_id?: number | null;
  specific_location?: string;
  start_date?: string;
  end_date?: string;
  execution_date?: string;
  project_value?: number | null;
  currency?: string;
  display_order?: number;
  project_features?: string[];
  challenges_faced?: string;
  solutions_provided?: string;
  project_images?: File[];
}

export interface UpdateAchievedProjectRequest
  extends CreateAchievedProjectRequest {
  id: number;
}

export interface AchievedProjectsFilters {
  project_type_id?: number;
  city_id?: number;
  start_date_from?: string;
  start_date_to?: string;
  project_value_min?: number;
  project_value_max?: number;
  search?: string;
}
