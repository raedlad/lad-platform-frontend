"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CloudUpload,
  Download,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  Trash2,
  TriangleAlert,
  Upload,
  VideoIcon,
} from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { documentsService } from "@/features/profile/services/documentApi";

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status:
    | "uploading"
    | "completed"
    | "error"
    | "pending"
    | "approved"
    | "rejected"
    | "expired";
  error?: string;
  customName?: string;
  notes?: string;
  description?: string;
  expireDate?: string;
}

interface TableUploadIntegratedProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  // API integration props
  role: string;
  docId: string;
  onUploadSuccess?: (file: any) => void;
  onUploadError?: (error: string) => void;
}

export default function TableUploadIntegrated({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = "*",
  multiple = true,
  className,
  onFilesChange,
  role,
  docId,
  onUploadSuccess,
  onUploadError,
}: TableUploadIntegratedProps) {
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change
      const newUploadFiles = newFiles.map((file) => {
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id
        );

        if (existingFile) {
          return {
            ...existingFile,
            ...file,
          };
        } else {
          return {
            ...file,
            progress: 0,
            status: "pending" as const,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const retryUpload = async (fileId: string) => {
    const fileItem = uploadFiles.find((f) => f.id === fileId);
    if (!fileItem) return;

    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: "uploading" as const,
              error: undefined,
            }
          : file
      )
    );

    await uploadSingleFile(fileItem);
  };

  const uploadSingleFile = async (fileItem: FileUploadItem) => {
    if (!fileItem.file) return;

    try {
      setIsUploading(true);

      const response = await documentsService.uploadFile(
        role,
        docId,
        fileItem.file,
        {
          customName: fileItem.customName,
          description: fileItem.description,
          expiryDate: fileItem.expireDate,
        }
      );

      // Update file status to completed
      setUploadFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id
            ? {
                ...file,
                progress: 100,
                status: "completed" as const,
                preview: response.file.fileUrl,
              }
            : file
        )
      );

      onUploadSuccess?.(response.file);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      setUploadFiles((prev) =>
        prev.map((file) =>
          file.id === fileItem.id
            ? {
                ...file,
                status: "error" as const,
                error: errorMessage,
              }
            : file
        )
      );

      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadAllFiles = async () => {
    const pendingFiles = uploadFiles.filter((f) => f.status === "pending");

    for (const fileItem of pendingFiles) {
      await uploadSingleFile(fileItem);
    }
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith("image/")) return <ImageIcon className="size-4" />;
    if (type.startsWith("video/")) return <VideoIcon className="size-4" />;
    if (type.startsWith("audio/")) return <HeadphonesIcon className="size-4" />;
    if (type.includes("pdf")) return <FileTextIcon className="size-4" />;
    if (type.includes("word") || type.includes("doc"))
      return <FileTextIcon className="size-4" />;
    if (type.includes("excel") || type.includes("sheet"))
      return <FileSpreadsheetIcon className="size-4" />;
    if (type.includes("zip") || type.includes("rar"))
      return <FileArchiveIcon className="size-4" />;
    return <FileTextIcon className="size-4" />;
  };

  const getFileTypeLabel = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Audio";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("word") || type.includes("doc")) return "Word";
    if (type.includes("excel") || type.includes("sheet")) return "Excel";
    if (type.includes("zip") || type.includes("rar")) return "Archive";
    if (type.includes("json")) return "JSON";
    if (type.includes("text")) return "Text";
    return "File";
  };

  const pendingFiles = uploadFiles.filter((f) => f.status === "pending");
  const hasErrors = uploadFiles.some((f) => f.status === "error");

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative rounded-lg border border-dashed p-6 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25"
            )}
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drop files here or{" "}
              <button
                type="button"
                onClick={openFileDialog}
                className="cursor-pointer text-primary underline-offset-4 hover:underline"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {formatBytes(maxSize)} • Maximum files:{" "}
              {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Files ({uploadFiles.length})
            </h3>
            <div className="flex gap-2">
              <Button onClick={openFileDialog} variant="outline" size="sm">
                <CloudUpload />
                Add files
              </Button>
              <Button onClick={clearFiles} variant="outline" size="sm">
                <Trash2 />
                Remove all
              </Button>
              {pendingFiles.length > 0 && (
                <Button
                  onClick={uploadAllFiles}
                  disabled={isUploading}
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading
                    ? "Uploading..."
                    : `Upload ${pendingFiles.length}`}
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="relative w-full overflow-auto">
              <Table className="w-full caption-bottom text-foreground text-sm">
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="h-9">Name</TableHead>
                    <TableHead className="h-9">Type</TableHead>
                    <TableHead className="h-9">Size</TableHead>
                    <TableHead className="h-9">Status</TableHead>
                    <TableHead className="h-9 w-[300px] text-end">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadFiles.map((fileItem) => (
                    <TableRow key={fileItem.id}>
                      <TableCell className="py-2 ps-1.5">
                        <div className="flex items-center gap-1">
                          <div
                            className={cn(
                              "size-8 shrink-0 relative flex items-center justify-center text-muted-foreground/80"
                            )}
                          >
                            {getFileIcon(fileItem.file)}
                          </div>
                          <p className="flex items-center gap-1 truncate text-sm font-medium">
                            {fileItem.file.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="secondary" className="text-xs">
                          {getFileTypeLabel(fileItem.file)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-sm text-muted-foreground">
                        {formatBytes(fileItem.file.size)}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant={
                            fileItem.status === "completed"
                              ? "default"
                              : fileItem.status === "error"
                              ? "destructive"
                              : fileItem.status === "uploading"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {fileItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 pe-1">
                        <div className="flex items-center gap-1">
                          {fileItem.preview && (
                            <Button
                              variant="dim"
                              size="icon"
                              className="size-8"
                              asChild
                            >
                              <Link href={fileItem.preview} target="_blank">
                                <Download className="size-3.5" />
                              </Link>
                            </Button>
                          )}
                          {fileItem.status === "error" ? (
                            <Button
                              onClick={() => retryUpload(fileItem.id)}
                              variant="dim"
                              size="icon"
                              className="size-8 text-destructive/80 hover:text-destructive"
                            >
                              <RefreshCwIcon className="size-3.5" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => removeUploadFile(fileItem.id)}
                              variant="dim"
                              size="icon"
                              className="size-8"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light" className="mt-5">
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
