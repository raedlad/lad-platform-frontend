import { z } from "zod";

// Create validation schemas for achieved projects
export const createAchievedProjectValidationSchemas = (
  t: (key: string) => string
) => {
  // Base project validation schema
  const AchievedProjectSchema = z.object({
    project_name_ar: z
      .string()
      .min(1, t("validation.required"))
      .max(255, t("validation.maxLength")),

    project_name_en: z
      .string()
      .min(1, t("validation.required"))
      .max(255, t("validation.maxLength")),

    description_ar: z
      .string()
      .min(1, t("validation.required"))
      .max(2000, t("validation.maxLength")),

    description_en: z
      .string()
      .min(1, t("validation.required"))
      .max(2000, t("validation.maxLength")),

    project_type_id: z
      .number()
      .int()
      .positive(t("validation.positive"))
      .optional()
      .nullable(),

    city_id: z
      .number()
      .int()
      .positive(t("validation.positive"))
      .optional()
      .nullable(),

    specific_location: z
      .string()
      .max(500, t("validation.maxLength"))
      .optional(),

    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("validation.dateFormat"))
      .optional(),

    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("validation.dateFormat"))
      .optional(),

    execution_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("validation.dateFormat"))
      .optional(),

    project_value: z
      .number()
      .positive(t("validation.positive"))
      .optional()
      .nullable(),

    currency: z.string().length(3, t("validation.currencyCode")).optional(),

    display_order: z.number().int().min(0, t("validation.minValue")).optional(),

    project_features: z
      .array(z.string().min(1, t("validation.required")))
      .max(20, t("validation.maxItems"))
      .optional(),

    challenges_faced: z
      .string()
      .max(2000, t("validation.maxLength"))
      .optional(),

    solutions_provided: z
      .string()
      .max(2000, t("validation.maxLength"))
      .optional(),

    project_images: z
      .array(z.instanceof(File))
      .max(10, t("validation.maxItems"))
      .optional(),
  });

  // Form validation schema (for form submission)
  const AchievedProjectFormSchema = AchievedProjectSchema.extend({
    project_images: z
      .array(z.instanceof(File))
      .max(10, t("validation.maxItems"))
      .optional(),
  });

  // API validation schema (for API requests)
  const AchievedProjectApiSchema = AchievedProjectSchema.omit({
    project_images: true,
  }).extend({
    project_images: z
      .array(z.string())
      .max(10, t("validation.maxItems"))
      .optional(),
  });

  // Create project validation schema
  const CreateAchievedProjectSchema = AchievedProjectFormSchema;

  // Update project validation schema
  const UpdateAchievedProjectSchema = AchievedProjectFormSchema.extend({
    id: z.number().int().positive(t("validation.required")),
  });

  // Project features validation
  const ProjectFeatureSchema = z.object({
    feature: z
      .string()
      .min(1, t("validation.required"))
      .max(255, t("validation.maxLength")),
  });

  // Project image validation
  const ProjectImageSchema = z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 8 * 1024 * 1024, // 8MB
        t("validation.fileSize")
      )
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          ),
        t("validation.fileType")
      ),
  });

  // Filters validation schema
  const AchievedProjectsFiltersSchema = z.object({
    project_type_id: z.number().int().positive().optional(),
    city_id: z.number().int().positive().optional(),
    start_date_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    start_date_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    project_value_min: z.number().positive().optional(),
    project_value_max: z.number().positive().optional(),
    search: z.string().max(255).optional(),
  });

  return {
    AchievedProjectSchema,
    AchievedProjectFormSchema,
    AchievedProjectApiSchema,
    CreateAchievedProjectSchema,
    UpdateAchievedProjectSchema,
    ProjectFeatureSchema,
    ProjectImageSchema,
    AchievedProjectsFiltersSchema,
  };
};

// Helper function to validate project features
export const validateProjectFeatures = (
  features: string[],
  t: (key: string) => string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (features.length > 20) {
    errors.push(t("validation.maxItems"));
  }

  features.forEach((feature, index) => {
    if (!feature.trim()) {
      errors.push(t("validation.required"));
    } else if (feature.length > 255) {
      errors.push(t("validation.maxLength"));
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate project images
export const validateProjectImages = (
  images: File[],
  t: (key: string) => string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (images.length > 10) {
    errors.push(t("validation.maxItems"));
  }

  images.forEach((image, index) => {
    if (image.size > 8 * 1024 * 1024) {
      errors.push(t("validation.fileSize"));
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      errors.push(t("validation.fileType"));
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to validate date ranges
export const validateDateRange = (
  t: (key: string) => string,
  startDate?: string,
  endDate?: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      errors.push(t("validation.dateRange"));
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
