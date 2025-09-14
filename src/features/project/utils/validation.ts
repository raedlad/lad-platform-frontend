"use client";
import { z } from "zod";
import { getProjectValidationMessages } from "./validationMessages";

export const createProjectValidationSchemas = (t: (key: string) => string) => {
  const messages = getProjectValidationMessages(t);
  const ProjectEssentialInfoSchema = z.object({
    name: z
      .string()
      .min(1, messages.projectName.required)
      .min(2, messages.projectName.minLength),
    type: z
      .number({
        error: messages.projectType.required,
      })
      .min(1, messages.projectType.required),
    city: z
      .string()
      .min(1, messages.city.required)
      .min(2, messages.city.minLength),
    district: z
      .string()
      .min(1, messages.district.required)
      .min(2, messages.district.minLength),
    location: z
      .string()
      .min(1, messages.location.required)
      .min(2, messages.location.minLength),
    budget: z
      .number({
        error: messages.budget.required,
      })
      .min(1, messages.budget.required),
    budget_unit: z.string(),
    duration: z
      .number({
        error: messages.duration.required,
      })
      .min(1, messages.duration.required),
    duration_unit: z.string(),
    area_sqm: z
      .number({
        error: messages.area_sqm.required,
      })
      .min(1, messages.area_sqm.required),
    description: z
      .string()
      .min(1, messages.description.required)
      .min(2, messages.description.minLength),
  });

  const ProjectClassificationSchema = z.object({
    jobId: z.number().min(1, messages.jobId.required),
    levelId: z.number().min(1, messages.levelId.required),
    workTypeId: z.number().min(1, messages.workTypeId.required),
    notes: z
      .string()
      .min(2, messages.notes.minLength)
      .or(z.literal(""))
      .optional(),
  });
  const ProjectDocumentsSchema = z.object({
    documentType: z.string({
      error: "messages.documentType.required",
    }),
    document: z.instanceof(File),
  });
  return {
    ProjectEssentialInfoSchema,
    ProjectClassificationSchema,
    ProjectDocumentsSchema,
  };
};
