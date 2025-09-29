import api from "@/lib/api";

// Engineering Type interface
export interface EngineeringType {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  created_at?: string;
  updated_at?: string;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
}

// Error messages
const ERROR_MESSAGES = {
  FETCH_ENGINEERING_TYPES: "Failed to fetch engineering types",
} as const;

export const engineeringTypesApi = {
  // Fetch engineering types from the general-data-profile/engineering-types endpoint
  async getEngineeringTypes(): Promise<EngineeringType[]> {
    try {
      const response = await api.get("/general-data-profile/engineering-types");

      // Handle the response structure - check if data is in response.data.response or response.data.data
      const responseData =
        response.data?.response || response.data?.data || response.data;

      if (!responseData) {
        throw new Error("No engineering types data received");
      }

      return responseData;
    } catch (error) {
      console.error("Error fetching engineering types:", error);
      throw new Error(ERROR_MESSAGES.FETCH_ENGINEERING_TYPES);
    }
  },
};
