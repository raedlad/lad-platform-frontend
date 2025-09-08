"use client";
import { z } from "zod";
import { getProjectValidationMessages } from "./validationMessages";

export const createProjectValidationSchemas = (t: (key: string) => string) => {
  const messages = getProjectValidationMessages(t);
  const ProjectEssentialInfoSchema = z.object({
    name: z.string().min(2, messages.projectName.minLength),
    type: z.number(),
    city: z.string().min(2, messages.location.minLength),
    district: z.string().min(2, messages.location.minLength),
    location: z.string().min(2, messages.location.minLength),
    budget: z.number().min(1, messages.budget.minLength),
    budget_unit: z.string().min(2, messages.budget_unit.minLength),
    duration: z.number().min(1, messages.duration.minLength),
    duration_unit: z.string().min(2, messages.duration_unit.minLength),
    area_sqm: z.number().min(1, messages.area_sqm.minLength),
    description: z.string().min(2, messages.description.minLength),
  });
  return {
    ProjectEssentialInfoSchema,
  };
}