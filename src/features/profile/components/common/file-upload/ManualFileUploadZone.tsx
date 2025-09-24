"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import {
  Upload,
  Plus,
  X,
  FileText,
  Image,
  File,
  Cloud,
  AlertCircle,
  Download,
  Edit,
  Calendar,
  CheckCircle,
  RefreshCwIcon,
} from "lucide-react";
import { useDocumentsStore } from "@/features/profile/store/documentStore";
import { formatBytes } from "@/features/profile/utils/documents";
import { cn } from "@/lib/utils";
import { DocumentRequirement } from "@/features/profile/types/documents";

interface ManualFileUploadZoneProps {
  /** Role for upload context - optional for shared usage */
  role?: string;
  /** Document ID - optional for shared usage */
  docId?: string;
  /** Maximum number of files */
  maxFiles: number;
  /** Maximum file size in bytes */
  maxSize: number;
  /** Accepted file types */
  acceptTypes: string[];
  /** Whether upload is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Upload function - role and docId will be passed as empty strings if not provided */
  uploadFile: (
    role: string,
    docId: string,
    file: File,
    metadata: { customName: string; description: string; expiryDate: string }
  ) => Promise<void>;
  /** Check if files can be added - role and docId will be passed as empty strings if not provided */
  canAddFiles: (role: string, docId: string) => boolean;
  /** Get document requirement - role and docId will be passed as empty strings if not provided */
  getDocumentRequirement: (
    role: string,
    docId: string
  ) => DocumentRequirement | undefined;
  /** Get error message formatter */
  getErrorMessage: (error: unknown) => string;
}

interface FileItem {
  id: string;
  file: File;
  preview?: string;
  error?: string;
  isUploading?: boolean;
  isUploaded?: boolean;
  metadata: {
    customName: string;
    description: string;
    expiryDate: string;
  };
}

/**
 * Manual file upload zone with individual file uploads
 * - Each file has its own upload button and error handling
 * - Files are uploaded immediately when user clicks upload
 * - Shows individual status for each file
 */
const ManualFileUploadZone: React.FC<ManualFileUploadZoneProps> = ({
  role,
  docId,
  maxFiles,
  maxSize,
  acceptTypes,
  disabled = false,
  className,
  uploadFile,
  canAddFiles,
  getDocumentRequirement,
  getErrorMessage,
}) => {
  const t = useTranslations("profile.documents.uploadZone");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const dragCounterRef = useRef(0);

  // Safe fallback values for optional role and docId
  const safeRole = role || "";
  const safeDocId = docId || "";

  // Check if upload is allowed - handle cases where role/docId might be empty
  const allowUpload = canAddFiles(safeRole, safeDocId) && !disabled;

  // Get current uploaded files count to enforce max files limit
  const currentDoc = getDocumentRequirement(safeRole, safeDocId);
  const currentUploadedCount = currentDoc?.uploadedFiles?.length || 0;

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <Image className="w-4 h-4 text-blue-500" />;
    }

    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="w-4 h-4 text-red-500" />;
    }

    return <File className="w-4 h-4 text-gray-500" />;
  };

  const validateFile = (file: File): string | null => {
    // Size check
    if (file.size > maxSize) {
      return `File size exceeds ${formatBytes(maxSize)}`;
    }

    // Type check (accept .ext, ext, mime, and wildcards like image/*)
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    const fileMime = (file.type || "").toLowerCase();
    const normalizedAccept = (acceptTypes || []).map((t) => t.toLowerCase());

    if (normalizedAccept.length > 0 && !normalizedAccept.includes("*")) {
      const isAllowed = normalizedAccept.some((t) => {
        if (!t) return false;
        if (t === fileExtension) return true; // e.g., "jpg"
        if (t === `.${fileExtension}`) return true; // e.g., ".jpg"
        if (t.endsWith("/*")) {
          const prefix = t.slice(0, -1); // keep trailing '/'
          return fileMime.startsWith(prefix);
        }
        return t === fileMime; // e.g., "image/jpeg"
      });

      if (!isAllowed) {
        return `File type not accepted. Allowed: ${acceptTypes.join(", ")}`;
      }
    }

    // Max files check - include currently uploaded files + current file items
    const totalFiles = currentUploadedCount + fileItems.length;
    if (totalFiles >= maxFiles) {
      return `Maximum ${maxFiles} files allowed (${currentUploadedCount} uploaded, ${fileItems.length} selected)`;
    }

    return null;
  };

  const handleFiles = useCallback(
    (files: FileList) => {
      if (!allowUpload) return;

      const newFileItems: FileItem[] = [];

      Array.from(files).forEach((file, index) => {
        const error = validateFile(file);
        const fileItem: FileItem = {
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}-${index}`,
          file,
          error: error || undefined,
          isUploading: false,
          isUploaded: false,
          metadata: {
            customName: file.name.split(".").slice(0, -1).join("."), // filename without extension as default
            description: "",
            expiryDate: "",
          },
        };

        // Create preview for images
        if (file.type.startsWith("image/") && !error) {
          fileItem.preview = URL.createObjectURL(file);
        }

        newFileItems.push(fileItem);
      });

      setFileItems((prev) => [...prev, ...newFileItems]);
    },
    [allowUpload, validateFile, currentUploadedCount, fileItems.length]
  );

  const removeFileItem = (id: string) => {
    setFileItems((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      // Clean up preview URLs
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const downloadFileItem = (fileItem: FileItem) => {
    // Create download link for file
    const url = URL.createObjectURL(fileItem.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileItem.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateFileItemMetadata = (
    fileId: string,
    metadata: Partial<FileItem["metadata"]>
  ) => {
    setFileItems((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, metadata: { ...f.metadata, ...metadata } } : f
      )
    );
  };

  const clearFileError = (fileId: string) => {
    setFileItems((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, error: undefined } : f))
    );
  };

  const uploadSingleFile = async (fileItem: FileItem) => {
    if (fileItem.isUploading || fileItem.isUploaded) return;

    // Set uploading state and clear any previous error
    setFileItems((prev) =>
      prev.map((f) =>
        f.id === fileItem.id ? { ...f, isUploading: true, error: undefined } : f
      )
    );

    try {
      // Upload file with metadata - store will now throw errors
      await uploadFile(safeRole, safeDocId, fileItem.file, fileItem.metadata);

      // Upload successful - show toast and remove from local state
      toast.success(t("toast.uploadSuccess"), {
        duration: 3000,
        position: "top-right",
      });

      // Remove the uploaded file from local state since it's now in the store
      setFileItems((prev) => {
        const updated = prev.filter((f) => f.id !== fileItem.id);
        // Clean up preview URL
        if (fileItem.preview) {
          URL.revokeObjectURL(fileItem.preview);
        }
        return updated;
      });
    } catch (error) {
      // Handle error from store
      console.log("Upload error caught in component:", error);
      const errorMessage = getErrorMessage(error);
      console.log("Formatted error message:", errorMessage);

      // Show error toast
      toast.error(t("toast.uploadError"), {
        duration: 4000,
        position: "top-right",
      });

      setFileItems((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? {
                ...f,
                isUploading: false,
                error: errorMessage,
              }
            : f
        )
      );
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!allowUpload) return;

    dragCounterRef.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!allowUpload) return;

    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!allowUpload) return;

    dragCounterRef.current = 0;
    setIsDragging(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const validFiles = fileItems.filter((f) => !f.error);
  const hasErrors = fileItems.some((f) => f.error);
  // Note: uploadedFiles is now 0 since we remove uploaded files from local state
  const uploadedFiles = fileItems.filter((f) => f.isUploaded);

  if (!allowUpload) {
    return (
      <div className={cn("p-4 border rounded-lg bg-muted/20", className)}>
        <p className="text-sm text-muted-foreground text-center">
          {!role || !docId ? t("configIncomplete") : t("uploadDisabled")}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer",
          "hover:bg-design-main/5 hover:border-design-main/50",
          isDragging
            ? "border-design-main bg-design-main/10"
            : "border-design-main/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptTypes.join(",")}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-design-main/10 flex items-center justify-center">
            <Plus className="w-6 h-6 text-design-main" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">{t("title")}</p>
            <p className="text-xs text-muted-foreground">
              {t("maxFiles", {
                maxFiles,
                uploaded: currentUploadedCount,
                selected: fileItems.length,
              })}{" "}
              • {t("maxSize", { size: formatBytes(maxSize) })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("acceptedTypes", { types: acceptTypes.join(", ") })}
            </p>
            {(!role || !docId) && (
              <p className="text-xs text-d-5 font-medium">
                {t("configWarning")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {fileItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-medium">
                {t("selectedFiles", { count: fileItems.length })}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("fillMetadata")}
              </p>
            </div>

            {fileItems.length === 0 && currentUploadedCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {t("uploadedSuccessfully", { count: currentUploadedCount })}
              </Badge>
            )}
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {fileItems.map((fileItem) => (
              <div
                key={fileItem.id}
                className={cn(
                  "border rounded-lg bg-background transition-all duration-300",
                  fileItem.error && "border-destructive/30 bg-destructive/5",
                  fileItem.isUploaded &&
                    "border-green-500/50 bg-green-50/80 dark:bg-green-950/20"
                )}
              >
                {/* File Header */}
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 border-b",
                    fileItem.isUploaded
                      ? "bg-green-100/50 dark:bg-green-950/30"
                      : "bg-muted/30"
                  )}
                >
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {fileItem.preview ? (
                      <img
                        src={fileItem.preview}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(fileItem.file.name)
                    )}
                  </div>

                  {/* File Basic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium break-all line-clamp-1">
                        {fileItem.file.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(fileItem.file.size)}
                    </p>
                    {fileItem.error && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-destructive" />
                        <p className="text-xs text-destructive break-words flex-1">
                          {fileItem.error}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    {/* Download file */}
                    {fileItem.isUploaded && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFileItem(fileItem)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        title={t("downloadFile")}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}

                    {/* Upload Button */}
                    {!fileItem.isUploaded && (
                      <Button
                        variant={fileItem.error ? "destructive" : "primary"}
                        size="sm"
                        onClick={() => uploadSingleFile(fileItem)}
                        className="h-8 px-3 text-xs"
                        title={
                          fileItem.error ? t("retryUpload") : t("uploadFile")
                        }
                      >
                        {fileItem.error ? (
                          <RefreshCwIcon className="w-3 h-3 mr-1" />
                        ) : fileItem.isUploading ? (
                          <Upload className="w-3 h-3 mr-1 animate-bounce" />
                        ) : (
                          <Upload className="w-3 h-3 mr-1" />
                        )}
                        {fileItem.error
                          ? t("retry")
                          : fileItem.isUploading
                          ? t("uploading")
                          : t("upload")}
                      </Button>
                    )}

                    {/* Remove Button */}
                    {!fileItem.isUploaded && !fileItem.isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFileItem(fileItem.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        title={t("removeFile")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Metadata Form */}
                {!fileItem.error && (
                  <div className="p-4 space-y-4">
                    {/* Custom Name */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        {t("customName")}
                      </label>
                      <Input
                        value={fileItem.metadata.customName}
                        onChange={(e) =>
                          updateFileItemMetadata(fileItem.id, {
                            customName: e.target.value,
                          })
                        }
                        placeholder={t("customNamePlaceholder")}
                        className="text-sm"
                        disabled={fileItem.isUploaded}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {t("description")}
                      </label>
                      <Textarea
                        value={fileItem.metadata.description}
                        onChange={(e) =>
                          updateFileItemMetadata(fileItem.id, {
                            description: e.target.value,
                          })
                        }
                        placeholder={t("descriptionPlaceholder")}
                        className="text-sm min-h-[60px]"
                        disabled={fileItem.isUploaded}
                      />
                    </div>

                    {/* Expiry Date */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t("expiryDate")}
                      </label>
                      <Input
                        type="date"
                        value={fileItem.metadata.expiryDate}
                        onChange={(e) =>
                          updateFileItemMetadata(fileItem.id, {
                            expiryDate: e.target.value,
                          })
                        }
                        className="text-sm"
                        disabled={fileItem.isUploaded}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-muted/30 p-4 rounded-lg border-t">
            <div className="text-sm">
              <p className="font-medium">
                {t("summary.uploaded", {
                  uploaded: currentUploadedCount,
                  total: currentUploadedCount + fileItems.length,
                })}
              </p>
              {validFiles.length > 0 && !hasErrors && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t("summary.readyToUpload", {
                    count: validFiles.length,
                  })}
                </p>
              )}
              {fileItems.length === 0 && currentUploadedCount > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                  ✓ {t("summary.allUploaded")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualFileUploadZone;
