import { api } from "@/lib/api";

export interface WorkField {
  id: number;
  name: string;
  name_en: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const workFieldsApi = {
  async getWorkFields(): Promise<ApiResponse<WorkField[]>> {
    const response = await api.get("/work-fields");
    return {
      success: response.data.success,
      data: response.data.response || response.data.data,
      message: response.data.message,
    };
  },
};
