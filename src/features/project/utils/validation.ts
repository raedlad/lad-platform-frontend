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
    city: z.string().min(1, messages.city.required),
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
  // File metadata schema for backend data
  const FileMetadataSchema = z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    uploadStatus: z.enum(["pending", "uploading", "completed", "error"]),
    uploadProgress: z.number(),
    url: z.string().optional(),
    error: z.string().optional(),
  });

  const ProjectDocumentsSchema = z.object({
    architectural_plans: z
      .array(
        z.union([
          // File instance for new uploads
          z
            .instanceof(File)
            .refine((file) => file.size <= 1024 * 1024 * 5, {
              message: messages.architectural_plans.maxSize,
            })
            .refine(
              (file) => {
                const allowedTypes = [
                  "application/pdf",
                  "application/dwg",
                  "application/dxf",
                  "image/jpeg", // covers .jpg & .jpeg
                  "image/png",
                ];
                return allowedTypes.includes(file.type);
              },
              {
                message: messages.architectural_plans.invalidType,
              }
            ),
          // File metadata for existing files from backend
          FileMetadataSchema,
        ])
      )
      .min(1, messages.architectural_plans.minFiles),
    licenses: z
      .array(
        z.union([
          // File instance for new uploads
          z
            .instanceof(File)
            .refine((file) => file.size <= 1024 * 1024 * 5, {
              message: messages.licenses.maxSize,
            })
            .refine(
              (file) => {
                const allowedTypes = [
                  "application/pdf",
                  "image/jpeg",
                  "image/png",
                ];
                return allowedTypes.includes(file.type);
              },
              {
                message: messages.licenses.invalidType,
              }
            ),
          // File metadata for existing files from backend
          FileMetadataSchema,
        ])
      )
      .min(1, messages.licenses.minFiles),
    specifications: z
      .array(
        z.union([
          // File instance for new uploads
          z
            .instanceof(File)
            .refine((file) => file.size <= 1024 * 1024 * 5, {
              message: messages.specifications.maxSize,
            })
            .refine(
              (file) => {
                const allowedTypes = [
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                  "application/vnd.ms-excel", // .xls
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                ];
                return allowedTypes.includes(file.type);
              },
              {
                message: messages.specifications.invalidType,
              }
            ),
          // File metadata for existing files from backend
          FileMetadataSchema,
        ])
      )
      .min(1, messages.specifications.minFiles),
    site_photos: z
      .array(
        z.union([
          // File instance for new uploads
          z
            .instanceof(File)
            .refine((file) => file.size <= 1024 * 1024 * 5, {
              message: messages.site_photos.maxSize,
            })
            .refine(
              (file) => {
                const allowedTypes = ["image/jpeg", "image/png"];
                return allowedTypes.includes(file.type);
              },
              {
                message: messages.site_photos.invalidType,
              }
            ),
          // File metadata for existing files from backend
          FileMetadataSchema,
        ])
      )
      .min(1, messages.site_photos.minFiles),
  });

  // File Upload Validation Schema - Array of files with constraints
  return {
    ProjectEssentialInfoSchema,
    ProjectClassificationSchema,
    ProjectDocumentsSchema,
  };
};
