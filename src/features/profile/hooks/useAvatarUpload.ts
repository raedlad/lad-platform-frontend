"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/features/auth/store";
import { avatarApi } from "@/features/profile/services/avatarApi";
import toast from "react-hot-toast";

// Constants
const DEFAULT_AVATAR = "/avatar.png";
const TOAST_DURATION = 4000;

interface UseAvatarUploadOptions {
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
}

interface AvatarUploadState {
  currentAvatarUrl: string;
  isUploading: boolean;
  isRemoving: boolean;
  error: string | null;
}

interface AvatarUploadActions {
  uploadAvatar: (file: File) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  clearError: () => void;
}

function useAvatarUpload(
  options: UseAvatarUploadOptions = {}
): AvatarUploadState & AvatarUploadActions {
  const { onSuccess, onError } = options;
  const { user, updateUser } = useAuthStore();

  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAvatarUrl = user?.avatar_url || DEFAULT_AVATAR;

  // Generic API handler
  const handleApiCall = useCallback(
    async (
      apiCall: () => Promise<any>,
      successMessage: string,
      errorMessage: string
    ) => {
      try {
        const response = await apiCall();

        if (response.success && response.data?.avatar_url) {
          updateUser({ ...user, avatar_url: response.data.avatar_url });
          onSuccess?.(response.data.avatar_url);
          toast.success(successMessage, { duration: TOAST_DURATION });
        } else {
          throw new Error(response.message || errorMessage);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        setError(errorMsg);
        onError?.(errorMsg);
        toast.error(errorMsg, { duration: TOAST_DURATION });
        throw err;
      }
    },
    [user, updateUser, onSuccess, onError]
  );

  // Upload new avatar
  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        await handleApiCall(
          () => avatarApi.uploadAvatar(file),
          "Avatar uploaded successfully",
          "Failed to upload avatar"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [handleApiCall]
  );

  // Update existing avatar
  const updateAvatar = useCallback(
    async (file: File) => {
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        await handleApiCall(
          () => avatarApi.updateAvatar(file),
          "Avatar updated successfully",
          "Failed to update avatar"
        );
      } finally {
        setIsUploading(false);
      }
    },
    [handleApiCall]
  );

  // Remove avatar
  const removeAvatar = useCallback(async () => {
    setIsRemoving(true);
    setError(null);

    try {
      const response = await avatarApi.removeAvatar();

      if (response.success) {
        updateUser({ ...user, avatar_url: undefined });
        onSuccess?.(DEFAULT_AVATAR);
        toast.success("Avatar removed successfully", {
          duration: TOAST_DURATION,
        });
      } else {
        throw new Error(response.message || "Failed to remove avatar");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to remove avatar";
      setError(errorMsg);
      onError?.(errorMsg);
      toast.error(errorMsg, { duration: TOAST_DURATION });
    } finally {
      setIsRemoving(false);
    }
  }, [user, updateUser, onSuccess, onError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentAvatarUrl,
    isUploading,
    isRemoving,
    error,
    uploadAvatar,
    updateAvatar,
    removeAvatar,
    clearError,
  };
}

export { useAvatarUpload };
export type { UseAvatarUploadOptions, AvatarUploadState, AvatarUploadActions };
