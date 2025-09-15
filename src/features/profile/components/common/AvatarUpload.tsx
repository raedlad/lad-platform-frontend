"use client";

import {
  useFileUpload,
  
} from "@/features/profile/hooks/use-file-upload";
import { FileWithPreview } from "@/features/profile/types/documents";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Upload, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
  isUpdatingProfile?: boolean;
}

export default function AvatarUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultAvatar = "/avatar.png",
  isUpdatingProfile = false,
}: AvatarUploadProps) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null);
    },
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Avatar container */}
      <div className="relative ">
        <div
          className={cn(
            "size-32 rounded-full overflow-hidden transition-all",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input {...getInputProps()} className="hidden" />

          <img
            src={previewUrl}
            alt="Profile"
            className="size-full object-cover"
          />

          {/* Upload overlay button */}
          <label
            className={cn(
              "absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-primary/90 shadow-lg hover:shadow-xl",
              isUpdatingProfile
                ? "animate-pulse pointer-events-none"
                : "hover:scale-105"
            )}
            onClick={openFileDialog}
          >
            <Upload className="w-5 h-5 rounded-full" />
          </label>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert
          variant="destructive"
          appearance="light"
          className="mt-5 w-full max-w-sm"
        >
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>File upload error(s)</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}
