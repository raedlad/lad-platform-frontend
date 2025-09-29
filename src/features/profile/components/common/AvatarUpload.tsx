"use client";

import { useState, useRef, useCallback } from "react";
import { useAvatarUpload } from "@/features/profile/hooks/useAvatarUpload";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  PenLine,
  Upload,
  TriangleAlert,
  Loader2,
  Camera,
  X,
  Check,
  Minus,
  UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

// Constants
const AVATAR_SIZES = {
  sm: {
    container: "size-16",
    icon: "w-3 h-3",
    button: "p-1.5",
    text: "text-xs",
  },
  md: {
    container: "size-28",
    icon: "w-4 h-4",
    button: "p-2",
    text: "text-sm",
  },
  lg: {
    container: "size-36",
    icon: "w-5 h-5",
    button: "p-2.5",
    text: "text-base",
  },
} as const;

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2MB

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
  showRemoveButton?: boolean;
  size?: keyof typeof AVATAR_SIZES;
  disabled?: boolean;
  showPreview?: boolean;
}

function AvatarUpload({
  maxSize = DEFAULT_MAX_SIZE,
  className,
  onSuccess,
  onError,
  showRemoveButton = true,
  size = "md",
  disabled = false,
  showPreview = true,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    currentAvatarUrl,
    isUploading,
    isRemoving,
    error,
    uploadAvatar,
    updateAvatar,
    removeAvatar,
    clearError,
  } = useAvatarUpload({
    onSuccess: (avatarUrl) => {
      setPreviewUrl(null);
      onSuccess?.(avatarUrl);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
  const t = useTranslations();
  const sizeConfig = AVATAR_SIZES[size];
  const displayUrl = previewUrl || currentAvatarUrl;
  const hasExistingAvatar =
    currentAvatarUrl && currentAvatarUrl !== "/avatar.png";
  const isProcessing = isUploading || isRemoving;

  // File validation
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!SUPPORTED_FORMATS.includes(file.type)) {
        return t("common.fileErrors.invalidFile");
      }

      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / 1024 / 1024);
        return t("common.fileErrors.maxSize", { maxSizeMB });
      }

      return null;
    },
    [maxSize, t]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onError?.(validationError);
        return;
      }

      // Create preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Determine upload type
      if (hasExistingAvatar) {
        updateAvatar(file);
      } else {
        uploadAvatar(file);
      }
    },
    [validateFile, hasExistingAvatar, updateAvatar, uploadAvatar, onError]
  );

  // Drag and drop handlers
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled || isProcessing) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled, isProcessing]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled || isProcessing) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, isProcessing, handleFileSelect]
  );

  // File input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Open file dialog
  const openFileDialog = useCallback(() => {
    if (disabled || isProcessing) return;
    fileInputRef.current?.click();
  }, [disabled, isProcessing]);

  // Remove avatar
  const handleRemoveAvatar = useCallback(() => {
    if (disabled || isProcessing || !hasExistingAvatar) return;
    removeAvatar();
  }, [disabled, isProcessing, hasExistingAvatar, removeAvatar]);

  // Clear preview
  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Avatar Container */}
      <div className="relative group">
        <div
          className={cn(
            `${sizeConfig.container} rounded-full overflow-hidden transition-all duration-300 border-2 ring-2 ring-transparent`,
            isDragging
              ? "border-primary bg-primary/10 scale-105 ring-primary/20 shadow-lg"
              : "border-border hover:border-primary/50 hover:ring-primary/10 hover:shadow-md",
            disabled && "opacity-50 cursor-not-allowed",
            isProcessing && "pointer-events-none"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_FORMATS.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isProcessing}
          />

          {/* Avatar Image */}
          <img
            src={displayUrl}
            alt={t("common.avatar.upload.profileAvatar")}
            className="size-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/avatar.png";
            }}
          />

          {/* Upload Overlay */}
          {!disabled && !isProcessing && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-1">
                <Camera className={cn(sizeConfig.icon, "text-white")} />
                <span className={cn("text-white font-medium", sizeConfig.text)}>
                  {hasExistingAvatar
                    ? t("common.avatar.upload.changeTitle")
                    : t("common.avatar.upload.title")}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!disabled && !isProcessing && (
            <div className="absolute -bottom-1 -right-1 flex gap-1">
              {/* Upload/Edit Button */}
              <button
                type="button"
                className={cn(
                  "bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95",
                  sizeConfig.button
                )}
                onClick={openFileDialog}
                aria-label={
                  hasExistingAvatar
                    ? t("common.avatar.upload.changeTitle")
                    : t("common.avatar.upload.title")
                }
              >
                <PenLine className={sizeConfig.icon} />
              </button>

              {/* Remove Button */}
              {showRemoveButton && hasExistingAvatar && (
                <button
                  type="button"
                  className={cn(
                    "bg-destructive text-destructive-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95",
                    sizeConfig.button
                  )}
                  onClick={handleRemoveAvatar}
                  aria-label={t("common.avatar.upload.removeTitle")}
                >
                  <UserMinus className={sizeConfig.icon} />
                </button>
              )}
            </div>
          )}

          {/* Preview Clear Button */}
          {previewUrl && showPreview && !isProcessing && (
            <button
              type="button"
              className={cn(
                "absolute -top-1 -left-1 bg-muted text-muted-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95",
                sizeConfig.button
              )}
              onClick={clearPreview}
              aria-label={t("common.actions.clear")}
            >
              <X className={sizeConfig.icon} />
            </button>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2
                  className={cn(sizeConfig.icon, "animate-spin text-primary")}
                />
                <span
                  className={cn("text-primary font-medium", sizeConfig.text)}
                >
                  {isUploading
                    ? t("common.actions.uploading")
                    : t("common.actions.removing")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvatarUpload;
