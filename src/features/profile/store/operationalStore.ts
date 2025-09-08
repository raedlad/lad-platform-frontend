import { create } from "zustand";

// Operational data types based on the API specification
export interface ExecutedProjectValueRange {
  id: number;
  label: string;
  sort_order: number;
}

export interface TargetProjectValueRange {
  id: number;
  label: string;
  sort_order: number;
}

export interface StaffSizeRange {
  id: number;
  label: string;
  sort_order: number;
}

export interface ClassificationLevel {
  id: number;
  level: number;
  label: string;
  sort_order: number;
}

export interface WorkField {
  id: number;
  name: string;
  description: string;
  code: string | null;
  icon: string;
  sort_order: string;
  is_active: boolean;
}

export interface WorkType {
  id: number;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface ExperienceYearsRange {
  id: number;
  label: string;
  sort_order: number;
}

export interface AnnualProjectsRange {
  id: number;
  label: string;
  sort_order: number;
}

export interface ProjectType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface BoqUnit {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

export interface BoqTemplate {
  id: number;
  name: string;
  project_type_id: string;
  classification_job_id: string;
  is_active: boolean;
  items: BoqTemplateItem[];
}

export interface BoqTemplateItem {
  id: number;
  template_id: string;
  name: string;
  description: string;
  unit_id: string;
  default_qty: number;
  default_price: number;
  sort_order: number;
}

export interface OperationalData {
  executed_project_value_ranges: ExecutedProjectValueRange[];
  target_project_value_ranges: TargetProjectValueRange[];
  staff_size_ranges: StaffSizeRange[];
  classification_levels: ClassificationLevel[];
  classification_jobs: ClassificationJob[];
  work_fields: WorkField[];
  work_types: WorkType[];
  experience_years_ranges: ExperienceYearsRange[];
  annual_projects_ranges: AnnualProjectsRange[];
  project_types: ProjectType[];
  boq_units: BoqUnit[];
  boq_templates: BoqTemplate[];
}

export interface ClassificationJob {
  id: number;
  name: string;
  sort_order: number;
  is_active: boolean;
}

// Work field with experience details
export interface WorkFieldWithExperience {
  work_field_id: number;
  years_of_experience_in_field: number;
}

// Operational geographical coverage
export interface OperationalGeographicalCoverage {
  country_code: string;
  state_id?: string;
  city_id?: string;
  covers_all_areas: boolean;
}

// Contractor geographic coverage
export interface ContractorGeographicCoverage {
  country_code: string;
  state_id?: string;
  city_id?: string;
  covers_all_areas: boolean;
}

// Contractor operational form data
export interface ContractorOperationalData {
  executed_project_range_id: number;
  staff_size_range_id: number;
  experience_years_range_id: number;
  annual_projects_range_id: number;
  classification_level_id?: number;
  classification_file?: File;
  has_government_accreditation: boolean;
  covers_all_regions: boolean;
  target_project_value_range_ids: number[];
  work_fields: WorkFieldWithExperience[];
  operational_geographical_coverage: OperationalGeographicalCoverage[];
  contractor_geographic_coverages: ContractorGeographicCoverage[];
}

// Store state
export interface OperationalStoreState {
  // Data from API
  operationalData: OperationalData | null;
  isLoading: boolean;
  error: string | null;

  // Form data
  contractorOperationalData: ContractorOperationalData | null;

  // Actions
  setOperationalData: (data: OperationalData) => void;
  setContractorOperationalData: (data: ContractorOperationalData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetOperationalData: () => void;
}

export const useOperationalStore = create<OperationalStoreState>()((set) => ({
  // Initial state
  operationalData: null,
  isLoading: false,
  error: null,
  contractorOperationalData: null,

  // Actions
  setOperationalData: (data) => set({ operationalData: data }),
  setContractorOperationalData: (data) =>
    set({ contractorOperationalData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  resetOperationalData: () =>
    set({
      operationalData: null,
      contractorOperationalData: null,
      isLoading: false,
      error: null,
    }),
}));
