import { EngineeringType } from "../../../services/engineeringTypesApi";

// Engineering Office Specialization type
export interface EngineeringOfficeSpecialization {
  engineering_specialization_id: number;
  other_specialization?: string;
  specialization_notes?: string;
  is_primary_specialization?: boolean;
  expertise_level?: "beginner" | "intermediate" | "advanced" | "expert";
}

// Engineering Office Geographical Coverage type
export interface EngineeringOfficeGeographicalCoverage {
  country_code: string;
  state_id: string;
  city_id: number;
  notes?: string;
}

// Validation Errors type
export interface ValidationErrors {
  [key: string]: string;
}

// Common props for section components
export interface SectionProps {
  control: any;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  clearFormErrors: (fieldName: string) => void;
  isLoading: boolean;
}

// Engineering Office Specializations section props
export interface EngineeringOfficeSpecializationsSectionProps
  extends SectionProps {
  engineeringTypes: EngineeringType[];
  specializations: EngineeringOfficeSpecialization[];
  setSpecializations: (
    specializations: EngineeringOfficeSpecialization[]
  ) => void;
}

// Engineering Office Geographical Coverage section props
export interface EngineeringOfficeGeographicalCoverageSectionProps
  extends SectionProps {
  geographicalCoverage: EngineeringOfficeGeographicalCoverage[];
  setGeographicalCoverage: (
    coverage: EngineeringOfficeGeographicalCoverage[]
  ) => void;
}
