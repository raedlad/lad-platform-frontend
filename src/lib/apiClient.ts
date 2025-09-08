import api from "@/lib/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
}

export async function request<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config: any = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request({
      method,
      url,
      data,
      ...config,
    });

    return {
      success: response.data.success,
      data: response.data.data,
      response: response.data.response,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
}
