import { z } from "zod";

// Additional clause validation schema
export const additionalClauseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  text: z.string().min(10, "Clause text must be at least 10 characters").max(500, "Clause text must not exceed 500 characters"),
});

// Change request comment schema
export const changeRequestSchema = z.object({
  comment: z.string()
    .min(20, "Please provide a detailed comment (at least 20 characters)")
    .max(1000, "Comment is too long (max 1000 characters)"),
});

// Contract status validation
export const contractStatusSchema = z.enum([
  "Waiting for Contract Draft",
  "Awaiting Client Review",
  "Awaiting Contractor Review",
  "Awaiting Client Modification",
  "Approved - Awaiting Signatures",
  "Awaiting Contractor Signature",
  "Signed - Active",
]);

// User role validation
export const userRoleSchema = z.enum(["client", "contractor"]);

// Project validation schema
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
});

// Offer validation schema
export const offerSchema = z.object({
  id: z.number(),
  contractor_name: z.string(),
  offer_amount: z.number().positive("Offer amount must be positive"),
  duration: z.string(),
});

// Standard clause validation schema
export const standardClauseSchema = z.object({
  id: z.number(),
  title: z.string(),
  text: z.string(),
});

// Contract version validation schema
export const contractVersionSchema = z.object({
  versionNumber: z.number().int().positive(),
  modifiedBy: userRoleSchema,
  modifiedAt: z.string(),
  comment: z.string().optional(),
});

// Full contract validation schema
export const contractSchema = z.object({
  id: z.number(),
  project: projectSchema,
  offer: offerSchema,
  versionNumber: z.number().int().positive(),
  lastNegotiationComment: z.string().nullable(),
  status: contractStatusSchema,
  standardClauses: z.array(standardClauseSchema),
  additionalClauses: z.array(additionalClauseSchema),
  clientSignedPDF_URL: z.string().nullable(),
  contractorSignedPDF_URL: z.string().nullable(),
  versionHistory: z.array(contractVersionSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Form schemas for React Hook Form
export const additionalClauseFormSchema = z.object({
  text: z.string()
    .min(10, "Clause text must be at least 10 characters")
    .max(500, "Clause text must not exceed 500 characters")
    .trim(),
});

export const changeRequestFormSchema = z.object({
  comment: z.string()
    .min(20, "Please provide a detailed comment (at least 20 characters)")
    .max(1000, "Comment is too long (max 1000 characters)")
    .trim(),
});

// Type exports
export type AdditionalClauseFormData = z.infer<typeof additionalClauseFormSchema>;
export type ChangeRequestFormData = z.infer<typeof changeRequestFormSchema>;

// Validation helper functions
export const validateAdditionalClause = (text: string): boolean => {
  try {
    additionalClauseFormSchema.parse({ text });
    return true;
  } catch {
    return false;
  }
};

export const validateChangeRequest = (comment: string): boolean => {
  try {
    changeRequestFormSchema.parse({ comment });
    return true;
  } catch {
    return false;
  }
};

// Status transition validation
export const isValidStatusTransition = (
  currentStatus: string,
  nextStatus: string,
  role: string
): boolean => {
  const transitions: Record<string, { role: string; nextStatus: string }[]> = {
    "Waiting for Contract Draft": [
      { role: "system", nextStatus: "Awaiting Client Review" },
    ],
    "Awaiting Client Review": [
      { role: "client", nextStatus: "Awaiting Contractor Review" },
    ],
    "Awaiting Contractor Review": [
      { role: "contractor", nextStatus: "Awaiting Client Modification" },
      { role: "contractor", nextStatus: "Approved - Awaiting Signatures" },
    ],
    "Awaiting Client Modification": [
      { role: "client", nextStatus: "Awaiting Contractor Review" },
    ],
    "Approved - Awaiting Signatures": [
      { role: "client", nextStatus: "Awaiting Contractor Signature" },
    ],
    "Awaiting Contractor Signature": [
      { role: "contractor", nextStatus: "Signed - Active" },
    ],
  };

  const validTransitions = transitions[currentStatus] || [];
  return validTransitions.some(
    (t) => t.role === role && t.nextStatus === nextStatus
  );
};
