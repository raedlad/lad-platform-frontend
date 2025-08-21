"use client";

import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface FileUploadProps {
  label?: string;
  accept?: string[];
  maxSizeMB?: number;
  onChange?: (file: File | null | File[]) => void;
  multiple?: boolean;
}

export function FileUpload({
  label = "Upload Document",
  accept = ["image/jpeg", "image/png", "application/pdf"],
  maxSizeMB = 5,
  onChange,
  multiple = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    if (!accept.includes(f.type)) {
      setError("Invalid file type. Only PDF, JPG, PNG allowed.");
      return;
    }
    if (f.size / 1024 / 1024 > maxSizeMB) {
      setError(`File too large. Max size is ${maxSizeMB}MB.`);
      return;
    }
    setError(null);

    if (multiple) {
      const newFiles = [...files, f];
      setFiles(newFiles);
      onChange?.(newFiles);
    } else {
      setFiles([f]);
      onChange?.(f);
    }
  };

  const handleMultipleFiles = (fileList: FileList) => {
    const validFiles: File[] = [];
    let hasError = false;

    Array.from(fileList).forEach((f) => {
      if (!accept.includes(f.type)) {
        setError("Invalid file type. Only PDF, JPG, PNG allowed.");
        hasError = true;
        return;
      }
      if (f.size / 1024 / 1024 > maxSizeMB) {
        setError(`File too large. Max size is ${maxSizeMB}MB.`);
        hasError = true;
        return;
      }
      validFiles.push(f);
    });

    if (!hasError) {
      setError(null);
      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      onChange?.(newFiles);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (multiple) {
      handleMultipleFiles(droppedFiles);
    } else {
      const droppedFile = droppedFiles?.[0];
      if (droppedFile) handleFile(droppedFile);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      if (multiple) {
        handleMultipleFiles(selectedFiles);
      } else {
        const selectedFile = selectedFiles[0];
        if (selectedFile) handleFile(selectedFile);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (multiple) {
      onChange?.(newFiles);
    } else {
      onChange?.(newFiles[0] || null);
    }
  };

  const currentFile = multiple ? null : files[0];
  const hasFiles = files.length > 0;

  return (
    <div className="w-full">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 cursor-pointer transition",
          hasFiles
            ? "border-p-4 bg-p-1/50"
            : "border-gray-300 dark:border-gray-600 hover:border-primary/60 hover:bg-primary/5"
        )}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {!hasFiles ? (
          <>
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              اسحب وافلت الملف هنا او{" "}
              <span className="text-primary font-medium">تصفح</span>
            </p>
            <input
              id="fileInput"
              type="file"
              accept={accept.join(",")}
              multiple={multiple}
              className="hidden"
              onChange={onFileSelect}
            />
          </>
        ) : multiple ? (
          <div className="w-full space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <File className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ))}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Click to add more files
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">{currentFile?.name}</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setFiles([]);
                onChange?.(null);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
