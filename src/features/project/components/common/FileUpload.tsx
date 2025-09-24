"use client";
import React, { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { DocumentsState } from "@/features/project/types/project";
import { useCreateProject } from "../../hooks/useCreateProject";
import { Button } from "@shared/components/ui/button";
import {
  X,
  Upload,
  RefreshCw,
  FileText,
  Image,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

interface FileUploadProps {
  icon?: React.ReactNode;
  iconClassName?: string;
  category: keyof DocumentsState;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  onUpload?: (files: File[]) => void;
  onRemove?: (fileId: string) => Promise<void>;
  onReupload?: (fileId: string, file: File) => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  icon,
  iconClassName,
  category,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  onUpload,
  onRemove,
  onReupload,
  className,
}) => {
  const t = useTranslations();
  const { documents } = useCreateProject();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reuploadInputRef = useRef<HTMLInputElement>(null);
  const [reuploadingFileId, setReuploadingFileId] = useState<string | null>(
    null
  );
  const [removingFileIds, setRemovingFileIds] = useState<Set<string>>(
    new Set()
  );

  const categoryFiles = documents[category] || [];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string, iconClassName?: string) => {
    if (fileType.startsWith("image/"))
      return <Image className={cn("w-4 h-4", iconClassName)} />;
    return <FileText className="w-4 h-4" />;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`;
    }

    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const mimeType = file.type;

    const isValidType = acceptedTypes.some((acceptType) => {
      if (acceptType.startsWith(".")) {
        return fileExtension === acceptType;
      }
      return mimeType === acceptType;
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${accept}`;
    }

    return null;
  };

  const handleFiles = async (files: File[]) => {
    if (categoryFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        alert(error);
        continue;
      }
      validFiles.push(file);
    }

    if (onUpload && validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [category, categoryFiles.length, maxFiles, onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (fileId: string) => {
    if (onRemove && !removingFileIds.has(fileId)) {
      setRemovingFileIds((prev) => new Set(prev).add(fileId));
      try {
        await onRemove(fileId);
      } finally {
        setRemovingFileIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }
    }
  };

  const handleReupload = (fileId: string) => {
    setReuploadingFileId(fileId);
    reuploadInputRef.current?.click();
  };

  const handleReuploadSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!reuploadingFileId) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    if (onReupload) {
      onReupload(reuploadingFileId, file);
    }

    setReuploadingFileId(null);
    if (reuploadInputRef.current) {
      reuploadInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragOver
            ? "border-design-main bg-design-main/5 dark:bg-design-main/10"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500",
          categoryFiles.length >= maxFiles && "opacity-50 pointer-events-none"
        )}
      >
        {icon || (
          <Upload
            className={twMerge(
              "mx-auto h-8 w-8 text-gray-400 dark:text-gray-500 mb-2",
              iconClassName
            )}
          />
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {t("project.step3.dropFiles")}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-design-main hover:underline dark:text-design-main/80"
            disabled={categoryFiles.length >= maxFiles}
          >
            {t("project.step3.browse")}
          </button>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("project.step3.accept")} {accept} • {t("project.step3.maxSize")}{" "}
          {formatFileSize(maxSize)}{" "}
          <span className="block">
            {categoryFiles.length}/{maxFiles} {t("project.step3.files")}
          </span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={categoryFiles.length >= maxFiles}
        />
      </div>

      {/* Uploaded Files List */}
      {categoryFiles.length > 0 && (
        <div className="mt-4 space-y-2 ">
          {categoryFiles.map((file) => (
            <div
              key={file.id}
              className={twMerge(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                file.uploadStatus === "uploading" &&
                  "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700",
                file.uploadStatus === "completed" &&
                  "bg-design-main/10 border-design-main dark:bg-design-main/20 dark:border-design-main/70",
                file.uploadStatus === "error" &&
                  "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700",
                file.uploadStatus === "pending" &&
                  "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600"
              )}
            >
              <div className="flex-shrink-0">
                {getFileIcon(file.type, iconClassName)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {formatFileSize(file.size)}
                </p>
                {/* 
                {file.uploadStatus === "uploading" && (
                  <div className="mt-2 space-y-1">
                    <Skeleton className="h-2 w-full" />
                    <p className="text-xs text-blue-600 font-medium animate-pulse">
                      {t("project.step3.uploading")}...
                    </p>
                  </div>
                )} */}

                {file.uploadStatus === "error" && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {t("project.step3.fileError")}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {file.uploadStatus === "completed" && file.url && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.url, "_blank")}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                {file.uploadStatus === "error" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReupload(file.id)}
                    className="h-8 w-8 p-0"
                    disabled={reuploadingFileId === file.id}
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4",
                        reuploadingFileId === file.id && "animate-spin"
                      )}
                    />
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(file.id)}
                  className={cn(
                    "h-8 w-8 p-0",
                    file.uploadStatus === "uploading" ||
                      removingFileIds.has(file.id)
                      ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  )}
                  disabled={
                    file.uploadStatus === "uploading" ||
                    removingFileIds.has(file.id)
                  }
                  title={
                    file.uploadStatus === "uploading"
                      ? t("project.step3.cannotRemoveUploading")
                      : removingFileIds.has(file.id)
                      ? t("project.step3.removingFile")
                      : t("project.step3.removeFile")
                  }
                >
                  {removingFileIds.has(file.id) ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden reupload input */}
      <input
        ref={reuploadInputRef}
        type="file"
        accept={accept}
        onChange={handleReuploadSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
