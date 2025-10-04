"use client";
import { z } from "zod";
import { getProjectValidationMessages } from "./validationMessages";

export const createProjectValidationSchemas = (t: (key: string) => string) => {
  const messages = getProjectValidationMessages(t);
  const ProjectEssentialInfoSchema = z.object({
    title: z
      .string()
      .min(1, messages.projectName.required)
      .min(2, messages.projectName.minLength),
    project_type_id: z
      .number({
        error: messages.projectType.required,
      })
      .min(1, messages.projectType.required),
    city_id: z.string().min(1, messages.city.required),
    district: z
      .string()
      .min(1, messages.district.required)
      .min(2, messages.district.minLength),
    address_line: z
      .string()
      .min(1, messages.address_line.required)
      .min(2, messages.address_line.minLength),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    budget_min: z
      .number({
        error: messages.budget_min.required,
      })
      .min(1, messages.budget_min.required),
    budget_max: z
      .number({
        error: messages.budget_max.required,
      })
      .min(1, messages.budget_max.required),
    budget_unit: z.string(),
    duration_value: z
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
      .min(20, messages.description.largeMinLength),
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
          z
            .instanceof(File)
            .refine((file) => file.size <= 1024 * 1024 * 5, {
              message: messages.architectural_plans.maxSize,
            })
            .refine(
              (file) => {
                const allowedTypes = [
                  "application/pdf",
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "text/csv",
                ];
                return allowedTypes.includes(file.type);
              },
              {
                message: messages.architectural_plans.invalidType,
              }
            ),
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
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  "text/csv",
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
                  "text/plain",
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
          z
            .instanceof(File)
            .refine((file) => file.size <= 1024 * 1024 * 5, {
              message: messages.site_photos.maxSize,
            })
            .refine(
              (file) => {
                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/svg+xml",
                ];
                return allowedTypes.includes(file.type);
              },
              {
                message: messages.site_photos.invalidType,
              }
            ),
          FileMetadataSchema,
        ])
      )
      .min(1, messages.site_photos.minFiles),
  });

  const BOQItemSchema = z.object({
    name: z
      .string()
      .min(1, messages.boqItem.name.required)
      .min(2, messages.boqItem.name.minLength),
    description: z
      .string()
      .min(1, messages.boqItem.description.required)
      .min(2, messages.boqItem.description.minLength),
    unit_id: z
      .number({
        error: messages.boqItem.unit_id.required,
      })
      .min(1, messages.boqItem.unit_id.required),
    quantity: z
      .number({
        error: messages.boqItem.quantity.required,
      })
      .min(0.01, messages.boqItem.quantity.minValue),
    unit_price: z
      .number({
        error: messages.boqItem.unit_price.required,
      })
      .min(0, messages.boqItem.unit_price.minValue),
    sort_order: z.number().min(1, messages.boqItem.sort_order.minValue),
    is_required: z.boolean(),
  });

  const BOQFormSchema = z.object({
    items: z.array(BOQItemSchema).min(1, messages.boqForm.items.minItems),
    total_amount: z.number().min(0, messages.boqForm.total_amount.minValue),
    template_id: z.number().optional(),
  });

  const ProjectPublishSchema = z.object({
    offers_window_days: z
      .number({
        error: messages.publish.offers_window_days.required,
      })
      .min(1, messages.publish.offers_window_days.minValue),
    notify_matching_contractors: z.boolean(),
    notify_client_on_offer: z.boolean(),
  });

  return {
    ProjectEssentialInfoSchema,
    ProjectClassificationSchema,
    ProjectDocumentsSchema,
    BOQItemSchema,
    BOQFormSchema,
    ProjectPublishSchema,
  };
};
