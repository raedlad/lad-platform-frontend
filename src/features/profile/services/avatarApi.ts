import api from "@/lib/api";

export interface AvatarUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    avatar_url?: string;
  };
}

export interface AvatarRemoveResponse {
  success: boolean;
  message?: string;
}

export interface AvatarUpdateResponse {
  success: boolean;
  message?: string;
  data?: {
    avatar_url?: string;
  };
}

export const avatarApi = {
  // Upload new avatar
  uploadAvatar: async (file: File): Promise<AvatarUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/base/profile/avatar/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });

    return {
      success: response.data.success,
      message: response.data.message,
      data: (response.data.response || response.data.data) as
        | { avatar_url?: string }
        | undefined,
    };
  },

  // Update existing avatar
  updateAvatar: async (file: File): Promise<AvatarUpdateResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/base/profile/avatar/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });

    return {
      success: response.data.success,
      message: response.data.message,
      data: (response.data.response || response.data.data) as
        | { avatar_url?: string }
        | undefined,
    };
  },

  // Remove avatar
  removeAvatar: async (): Promise<AvatarRemoveResponse> => {
    const response = await api.post("/base/profile/avatar/remove");
    return {
      success: response.data.success,
      message: response.data.message,
    };
  },
};
