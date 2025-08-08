import { z } from "zod";

export const validationSchemas = {
  email: z.string().email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
};

export const validationHelpers = {
  isValidEmail(email: string): boolean {
    try {
      validationSchemas.email.parse(email);
      return true;
    } catch {
      return false;
    }
  },

  isValidPassword(password: string): boolean {
    try {
      validationSchemas.password.parse(password);
      return true;
    } catch {
      return false;
    }
  },

  isValidPhone(phone: string): boolean {
    try {
      validationSchemas.phone.parse(phone);
      return true;
    } catch {
      return false;
    }
  },

  isValidName(name: string): boolean {
    try {
      validationSchemas.name.parse(name);
      return true;
    } catch {
      return false;
    }
  },
};
