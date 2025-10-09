import { z } from "zod";
import { getOfferValidationMessages } from "./validationMessages";

// Zod validation schemas for complete offer
export const createCompleteOfferValidationSchema = (
  t: (key: string) => string
) => {
  const messages = getOfferValidationMessages(t);

  const OfferPaymentPlanSchema = z.object({
    name: z
      .string()
      .min(1, messages.paymentPlans.name.required)
      .min(2, messages.paymentPlans.name.minLength),
    amount: z.number().min(0, messages.paymentPlans.amount.minValue),
    percentageOfContract: z
      .number()
      .min(0, messages.paymentPlans.percentageOfContract.minValue)
      .max(100, messages.paymentPlans.percentageOfContract.maxValue),
    sortOrder: z.number().min(0),

  });

  const OfferPhaseSchema = z.object({
    title: z
      .string()
      .min(1, messages.phases.title.required)
      .min(2, messages.phases.title.minLength),
    description: z
      .string()
      .min(1, messages.phases.description.required)
      .min(2, messages.phases.description.minLength),
    order: z.number().min(0),
    paymentPlans: z
      .array(OfferPaymentPlanSchema)
      .min(1, messages.paymentPlans.minItems),
  });

  const CreateCompleteOfferSchema = z
    .object({
      offerAmount: z.number().min(0, messages.offerAmount.minValue),
      offerValidityValue: z
        .number()
        .min(1, messages.offerValidityValue.minValue),
      offerValidityUnit: z.string().min(1, messages.offerValidityUnit.required),
      executionDurationValue: z
        .number()
        .min(1, messages.executionDurationValue.minValue),
      executionDurationUnit: z
        .string()
        .min(1, messages.executionDurationUnit.required),
      expectedStartDate: z.string().min(1, messages.expectedStartDate.required),
      expectedEndDate: z.string().min(1, messages.expectedEndDate.required),
      details: z
        .string()
        .min(1, messages.details.required)
        .min(10, messages.details.minLength),
      hasWarranty: z.boolean().optional(),
      // Accept File[] on client; using any to avoid SSR File ctor issues
      files: z.array(z.any()).optional(),
      phases: z.array(OfferPhaseSchema).min(1, messages.phases.minItems),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.expectedStartDate);
        const endDate = new Date(data.expectedEndDate);
        return endDate > startDate;
      },
      {
        message: messages.expectedEndDate.afterStartDate,
        path: ["expectedEndDate"],
      }
    );

  return {
    CreateCompleteOfferSchema,
    OfferPhaseSchema,
    OfferPaymentPlanSchema,
  };
};
