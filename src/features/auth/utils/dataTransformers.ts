import { IndividualRegistrationData } from "../api/authApi";

// Transform individual registration form data to backend format
export const transformIndividualRegistrationData = (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  nationalId: string;
  agreeToTerms: boolean;
}): IndividualRegistrationData => {
  return {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    password: data.password,
    password_confirmation: data.confirmPassword,
    user_type: "individual",
    phone: data.phoneNumber,
    national_id: data.nationalId,
  };
};

// Transform phone number to international format if needed
export const formatPhoneNumber = (phone: string): string => {
  // If phone doesn't start with +, assume it's a Saudi number and add +966
  if (!phone.startsWith("+")) {
    // Remove leading 0 if present
    const cleanPhone = phone.startsWith("0") ? phone.slice(1) : phone;
    return `+966${cleanPhone}`;
  }
  return phone;
};

// Validate and transform data before sending to API
export const validateAndTransformRegistrationData = (data: any) => {
  const transformed = transformIndividualRegistrationData(data);

  // Format phone number
  transformed.phone = formatPhoneNumber(transformed.phone);

  return transformed;
};
