import {
  ApiResponse,
  AuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  VerificationRequest,
  VerificationResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  PlanSelectionRequest,
  PlanSelectionResponse,
  IndividualRegistrationApiData,
  InstitutionRegistrationApiData,
  FreelanceEngineerRegistrationApiData,
  EngineeringOfficeRegistrationApiData,
  ContractorRegistrationApiData,
  SupplierRegistrationApiData,
} from "./authApiTypes";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// Helper function for simulating API calls
const simulateApiCall = <T>(
  data: T,
  success: boolean,
  message: string,
  delay = 1000
): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (success) {
        resolve({ success: true, data, message });
      } else {
        resolve({ success: false, message, errors: { general: [message] } });
      }
    }, delay);
  });
};

// Common function to handle file uploads with FormData
const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item, item.name);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  }
  return formData;
};

// --- Authentication API Service ---

export const authApi = {
  // Individual Registration
  registerIndividual: async (
    data: RegistrationRequest<IndividualRegistrationApiData>
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerIndividual", data);
    // In a real application, you would use fetch or axios here
    // const response = await fetch(`${API_BASE_URL}/register/individual`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    return simulateApiCall(
      { message: "Individual registered successfully", userId: "ind_123" },
      true,
      "Registration successful"
    );
  },

  // Institution Registration
  registerInstitution: async (
    data: RegistrationRequest<InstitutionRegistrationApiData>
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerInstitution", data);
    // Handle file uploads if necessary, e.g., commercialRegistrationDocumentUpload
    // const formData = createFormData(data.data);
    // const response = await fetch(`${API_BASE_URL}/register/institution`, {
    //   method: 'POST',
    //   body: formData,
    // });
    return simulateApiCall(
      { message: "Institution registered successfully", userId: "inst_456" },
      true,
      "Registration successful"
    );
  },

  // Freelance Engineer Registration
  registerFreelanceEngineer: async (
    data: RegistrationRequest<FreelanceEngineerRegistrationApiData>
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerFreelanceEngineer", data);
    // Handle file uploads
    // const formData = createFormData(data.data);
    // const response = await fetch(`${API_BASE_URL}/register/freelance-engineer`, {
    //   method: 'POST',
    //   body: formData,
    // });
    return simulateApiCall(
      {
        message: "Freelance Engineer registered successfully",
        userId: "fe_789",
      },
      true,
      "Registration successful"
    );
  },

  // Engineering Office Registration
  registerEngineeringOffice: async (
    data: RegistrationRequest<EngineeringOfficeRegistrationApiData>
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerEngineeringOffice", data);
    // Handle file uploads
    // const formData = createFormData(data.data);
    // const response = await fetch(`${API_BASE_URL}/register/engineering-office`, {
    //   method: 'POST',
    //   body: formData,
    // });
    return simulateApiCall(
      {
        message: "Engineering Office registered successfully",
        userId: "eo_101",
      },
      true,
      "Registration successful"
    );
  },

  // Contractor Registration
  registerContractor: async (
    data: RegistrationRequest<ContractorRegistrationApiData>
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerContractor", data);
    // Handle file uploads
    // const formData = createFormData(data.data);
    // const response = await fetch(`${API_BASE_URL}/register/contractor`, {
    //   method: 'POST',
    //   body: formData,
    // });
    return simulateApiCall(
      { message: "Contractor registered successfully", userId: "cont_202" },
      true,
      "Registration successful"
    );
  },

  // Supplier Registration
  registerSupplier: async (
    data: RegistrationRequest<SupplierRegistrationApiData>
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerSupplier", data);
    // Handle file uploads
    // const formData = createFormData(data.data);
    // const response = await fetch(`${API_BASE_URL}/register/supplier`, {
    //   method: 'POST',
    //   body: formData,
    // });
    return simulateApiCall(
      { message: "Supplier registered successfully", userId: "supp_303" },
      true,
      "Registration successful"
    );
  },

  // OTP Verification
  verifyOtp: async (
    data: VerificationRequest
  ): Promise<ApiResponse<VerificationResponse>> => {
    console.log("API Call: verifyOtp", data);
    // const response = await fetch(`${API_BASE_URL}/verify-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    return simulateApiCall(
      { message: "OTP verified successfully", isVerified: true },
      true,
      "Verification successful"
    );
  },

  // Resend OTP
  resendOtp: async (
    data: ResendOtpRequest
  ): Promise<ApiResponse<ResendOtpResponse>> => {
    console.log("API Call: resendOtp", data);
    // const response = await fetch(`${API_BASE_URL}/resend-otp`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    return simulateApiCall(
      { message: "OTP resent successfully" },
      true,
      "Resend successful"
    );
  },

  // Plan Selection
  selectPlan: async (
    data: PlanSelectionRequest
  ): Promise<ApiResponse<PlanSelectionResponse>> => {
    console.log("API Call: selectPlan", data);
    // const response = await fetch(`${API_BASE_URL}/select-plan`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    return simulateApiCall(
      { message: "Plan selected successfully" },
      true,
      "Plan selection successful"
    );
  },

  // You can add login, password reset, etc. here as well
};
