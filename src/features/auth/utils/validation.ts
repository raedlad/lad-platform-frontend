import { z } from "zod";
import { getValidationMessages } from "./validationMessages";

// Factory function to create validation schemas with translation support
export const createValidationSchemas = (t: (key: string) => string) => {
  const messages = getValidationMessages(t);

  const EmailLoginSchema = z.object({
    email: z.string().email(messages.email.invalid),
    password: z.string().min(8, messages.password.minLength),
  });

  // Common validation schemas for reuse
  const validationSchemas = {
    name: z.string().min(2, messages.firstName.minLength),
    email: z.string().email(messages.email.invalid),
    phone: z.string().min(9, messages.phoneNumber.minLength),
  };

  const PhoneLoginSchema = z.object({
    phoneNumber: z.string().min(9, messages.phoneNumber.minLength),
    // Assuming OTP is used for login instead of a password for phone
  });

  // Unified schema for individual personal information (replaces individualUnifiedPersonalInfoSchema)
  const PersonalInfoSchema = z
    .object({
      firstName: z.string().min(2, messages.firstName.minLength),
      lastName: z.string().min(2, messages.lastName.minLength),
      phoneNumber: z.string().min(9, messages.phoneNumber.minLength), // Made optional for email/third-party
      email: z.string().email(messages.email.invalid),
      password: z.string().min(8, messages.password.minLength),
      confirmPassword: z.string(),
      agreeToTerms: z.boolean().refine((val) => val === true, {
        message: messages.terms.required,
      }),
    })
    .refine(
      (data) => {
        // Password validation only for email and phone auth methods if present
        if (
          (data.password || data.confirmPassword) &&
          data.password !== data.confirmPassword
        ) {
          return false;
        }
        return true;
      },
      {
        message: messages.confirmPassword.mismatch,
        path: ["confirmPassword"],
      }
    );

  // Specific schemas for different authentication methods (can be derived or separate)
  // Email-based registration/login
  const IndividualEmailRegistrationSchema = PersonalInfoSchema.extend({
    email: z.string().email(messages.email.invalid),
    password: z.string().min(8, messages.password.minLength),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(9, messages.phoneNumber.minLength),
  });

  // Phone-based registration/login
  const IndividualPhoneRegistrationSchema = PersonalInfoSchema.extend({
    phoneNumber: z.string().min(9, messages.phoneNumber.minLength),
    password: z.string().min(8, messages.password.minLength),
    confirmPassword: z.string(),
  });

  const IndividualThirdPartyRegistrationSchema = PersonalInfoSchema.extend({
    email: z.string().email(messages.email.invalid),
    phoneNumber: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  });

  // OTP Verification Schema
  const OTPVerificationSchema = z.object({
    otp: z.string().length(6, { message: messages.otp.length }),
  });

  // Password Reset Schemas
  const PasswordResetSchema = z.object({
    email: z.string().email(messages.email.invalid),
  });

  const NewPasswordSchema = z
    .object({
      password: z.string().min(8, messages.password.minLength),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.confirmPassword.mismatch,
      path: ["confirmPassword"],
    });

  // Organization-specific Schemas

  return {
    EmailLoginSchema,
    PhoneLoginSchema,
    PersonalInfoSchema,
    IndividualEmailRegistrationSchema,
    IndividualPhoneRegistrationSchema,
    IndividualThirdPartyRegistrationSchema,
    OTPVerificationSchema,
    PasswordResetSchema,
    NewPasswordSchema,
  };
};
