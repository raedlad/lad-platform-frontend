import { z } from "zod";
import { UserRole, UserType } from "./auth";

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z.string().optional(),
    role: z.nativeEnum(UserRole),
    userType: z.nativeEnum(UserType),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const passwordResetFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const newPasswordFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const otpFormSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordFormSchema>;
export type OTPFormData = z.infer<typeof otpFormSchema>;
