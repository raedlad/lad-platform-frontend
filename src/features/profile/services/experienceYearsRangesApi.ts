import api from "@/lib/api";

// Experience Years Range interface
export interface ExperienceYearsRange {
  id: number;
  label: string;
  sort_order: number;
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
  FETCH_EXPERIENCE_YEARS_RANGES: "Failed to fetch experience years ranges",
} as const;

export const experienceYearsRangesApi = {
  // Fetch experience years ranges from the general-data-profile/experience-years-ranges endpoint
  async getExperienceYearsRanges(): Promise<ExperienceYearsRange[]> {
    try {
      const response = await api.get("/general-data-profile/all");

      // Extract experience years ranges from the operational data
      const operationalData =
        response.data?.response || response.data?.data || response.data;

      if (!operationalData || !operationalData.experience_years_ranges) {
        throw new Error("No experience years ranges data received");
      }

      return operationalData.experience_years_ranges;
    } catch (error) {
      console.error("Error fetching experience years ranges:", error);
      throw new Error(ERROR_MESSAGES.FETCH_EXPERIENCE_YEARS_RANGES);
    }
  },
};
