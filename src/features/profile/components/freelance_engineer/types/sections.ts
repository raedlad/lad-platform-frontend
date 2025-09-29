import { Control } from "react-hook-form";
import { EngineeringType } from "../../../services/engineeringTypesApi";

// Specialization type
export interface Specialization {
  engineering_specialization_id: number;
  other_specialization: string;
  specialization_notes: string;
  is_primary_specialization: boolean;
  expertise_level?: "beginner" | "intermediate" | "advanced" | "expert";
}

// Geographical Coverage type
export interface GeographicalCoverage {
  country_code: string;
  state_id: string;
  city_id: number;
  notes: string;
}

// Experience type
export interface Experience {
  engineering_specialization_id: number;
  other_specialization: string;
}

// Validation Errors type
export interface ValidationErrors {
  [key: string]: string;
}

// Common props for section components
export interface SectionProps {
  control: Control<any>;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  clearFormErrors: (fieldName: string) => void;
  isLoading: boolean;
}

// Specializations section props
export interface SpecializationsSectionProps extends SectionProps {
  engineeringTypes: EngineeringType[];
  specializations: Specialization[];
  setSpecializations: (specializations: Specialization[]) => void;
}

// Geographical Coverage section props
export interface GeographicalCoverageSectionProps extends SectionProps {
  geographicalCoverage: GeographicalCoverage[];
  setGeographicalCoverage: (coverage: GeographicalCoverage[]) => void;
}

// Experiences section props
export interface ExperiencesSectionProps extends SectionProps {
  engineeringTypes: EngineeringType[];
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;
}
