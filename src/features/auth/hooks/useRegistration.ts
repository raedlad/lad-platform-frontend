import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@auth/store";
import { UserRole, UserType } from "@auth/types";

const registrationSchema = z
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

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const useRegistration = () => {
  const { signup, isLoading, error } = useAuthStore();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await signup(data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Registration failed",
      };
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    error,
  };
};

export default useRegistration;
