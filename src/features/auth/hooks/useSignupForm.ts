import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserRole, UserType } from "@auth/types";
import { validationSchemas } from "@auth/utils/validation";

// Unified signup schema for all user types and roles
const signupSchema = z
  .object({
    // Basic user information
    firstName: validationSchemas.name,
    lastName: validationSchemas.name,
    email: validationSchemas.email,
    phone: validationSchemas.phone.optional(),

    // Password (only for traditional signup)
    password: z.string().optional(),
    confirmPassword: z.string().optional(),

    // Social login provider (optional)
    socialProvider: z.enum(["google", "apple", "email"]).optional(),
    socialToken: z.string().optional(),

    // Terms acceptance
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    }),

    // Marketing preferences
    marketingEmails: z.boolean(),
    newsletter: z.boolean(),
  })
  .refine(
    (data) => {
      // If using traditional signup, password is required
      if (data.socialProvider === "email" || !data.socialProvider) {
        return data.password && data.password.length >= 8;
      }
      return true;
    },
    {
      message: "Password is required for email signup",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      // If using traditional signup, passwords must match
      if (data.socialProvider === "email" || !data.socialProvider) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export type SignupFormData = z.infer<typeof signupSchema>;

export const useSignupForm = (userType: UserType, role: UserRole) => {
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      socialProvider: undefined,
      socialToken: "",
      acceptTerms: false,
      acceptPrivacy: false,
      marketingEmails: false,
      newsletter: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
    trigger,
    setError,
    clearErrors,
  } = form;

  const watchedValues = watch();

  const validateField = async (fieldName: keyof SignupFormData) => {
    return await trigger(fieldName);
  };

  const validateForm = async () => {
    return await trigger();
  };

  const resetForm = () => {
    reset();
  };

  const getFieldError = (fieldName: keyof SignupFormData) => {
    return errors[fieldName]?.message;
  };

  const isFieldValid = (fieldName: keyof SignupFormData) => {
    return !errors[fieldName] && watchedValues[fieldName];
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" };

    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { label: "Very Weak", color: "text-red-500" },
      1: { label: "Weak", color: "text-red-400" },
      2: { label: "Fair", color: "text-yellow-500" },
      3: { label: "Good", color: "text-blue-500" },
      4: { label: "Strong", color: "text-green-500" },
      5: { label: "Very Strong", color: "text-green-600" },
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  };

  const setSocialLogin = (provider: "google" | "apple", token: string) => {
    setValue("socialProvider", provider);
    setValue("socialToken", token);
    setValue("password", "");
    setValue("confirmPassword", "");
    clearErrors(["password", "confirmPassword"]);
  };

  const setEmailSignup = () => {
    setValue("socialProvider", "email");
    setValue("socialToken", "");
    clearErrors(["password", "confirmPassword"]);
  };

  const isSocialLogin = () => {
    return (
      watchedValues.socialProvider && watchedValues.socialProvider !== "email"
    );
  };

  const isEmailSignup = () => {
    return (
      watchedValues.socialProvider === "email" || !watchedValues.socialProvider
    );
  };

  const getSignupMethod = () => {
    return watchedValues.socialProvider || "email";
  };

  const getAccountSummary = () => {
    return {
      userType: userType === UserType.PERSONAL ? "Personal" : "Business",
      role: role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      signupMethod: getSignupMethod(),
    };
  };

  const validateSocialLogin = () => {
    if (isSocialLogin() && !watchedValues.socialToken) {
      setError("socialToken", { message: "Social login token is required" });
      return false;
    }
    return true;
  };

  const validateEmailSignup = async () => {
    if (isEmailSignup()) {
      return await trigger(["password", "confirmPassword"]);
    }
    return true;
  };

  return {
    form,
    register,
    handleSubmit,
    errors,
    isValid,
    isDirty,
    watchedValues,
    setValue,
    reset: resetForm,
    validateField,
    validateForm,
    getFieldError,
    isFieldValid,
    getPasswordStrength,

    // Social login methods
    setSocialLogin,
    setEmailSignup,
    isSocialLogin,
    isEmailSignup,
    getSignupMethod,
    validateSocialLogin,
    validateEmailSignup,

    // Account info
    getAccountSummary,

    // User type and role info
    userType,
    role,
  };
};

export default useSignupForm;
