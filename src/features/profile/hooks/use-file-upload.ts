"use client";

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react";
import {
  validateFileSize,
  validateFileType,
} from "@/features/profile/utils/documents";
import {
  FileUploadOptions,
  FileUploadState,
  FileUploadActions,
  FileMetadata,
  FileWithPreview,
} from "@/features/profile/types/documents";

// Simplified hook focused on core file handling utilities
export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024, // 50MB default
    accept = "*",
    multiple = true,
    onFilesChange,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    isDragging: false,
    errors: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Utility functions
  const generateFileId = useCallback((file: File): string => {
    return `${file.name}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }, []);

  const createFilePreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  const clearFiles = useCallback(() => {
    setState((prev) => {
      // Clean up object URLs
      prev.files.forEach((fileItem) => {
        if (fileItem.preview && fileItem.file instanceof File) {
          URL.revokeObjectURL(fileItem.preview);
        }
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      const newState = { ...prev, files: [], errors: [] };
      onFilesChange?.(newState.files);
      return newState;
    });
  }, [onFilesChange]);

  const validateAndProcessFiles = useCallback(
    (
      newFiles: FileList | File[]
    ): { validFiles: FileWithPreview[]; errors: string[] } => {
      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];
      const validFiles: FileWithPreview[] = [];

      // Check total file count
      if (multiple && state.files.length + newFilesArray.length > maxFiles) {
        errors.push(
          `Maximum ${maxFiles} files allowed. You can add ${
            maxFiles - state.files.length
          } more.`
        );
        return { validFiles: [], errors };
      }

      newFilesArray.forEach((file) => {
        // Check for duplicates in multiple mode
        if (multiple) {
          const isDuplicate = state.files.some(
            (existingFile) =>
              existingFile.file instanceof File &&
              existingFile.file.name === file.name &&
              existingFile.file.size === file.size
          );
          if (isDuplicate) return; // Skip silently
        }

        // Validate file size
        const sizeError = validateFileSize(file, maxSize);
        if (sizeError) {
          errors.push(sizeError);
          return;
        }

        // Validate file type
        const acceptTypes =
          accept === "*" ? [] : accept.split(",").map((type) => type.trim());
        const typeError = validateFileType(file, acceptTypes);
        if (typeError) {
          errors.push(typeError);
          return;
        }

        validFiles.push({
          file,
          id: generateFileId(file),
          preview: createFilePreview(file),
        });
      });

      return { validFiles, errors };
    },
    [
      state.files,
      maxFiles,
      multiple,
      maxSize,
      accept,
      generateFileId,
      createFilePreview,
    ]
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      // Clear existing errors
      setState((prev) => ({ ...prev, errors: [] }));

      // In single file mode, clear existing files first
      if (!multiple) {
        clearFiles();
      }

      const { validFiles, errors } = validateAndProcessFiles(newFiles);

      if (validFiles.length > 0 || errors.length > 0) {
        setState((prev) => {
          const newFiles = multiple
            ? [...prev.files, ...validFiles]
            : validFiles;
          onFilesChange?.(newFiles);
          return { ...prev, files: newFiles, errors };
        });
      }

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [multiple, clearFiles, validateAndProcessFiles, onFilesChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const fileToRemove = prev.files.find((file) => file.id === id);
        if (fileToRemove?.preview && fileToRemove.file instanceof File) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.files.filter((file) => file.id !== id);
        onFilesChange?.(newFiles);
        return { ...prev, files: newFiles, errors: [] };
      });
    },
    [onFilesChange]
  );

  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: [] }));
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      if (inputRef.current?.disabled || !e.dataTransfer.files?.length) return;

      const files = e.dataTransfer.files;
      if (!multiple) {
        addFiles([files[0]]);
      } else {
        addFiles(files);
      }
    },
    [addFiles, multiple]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      type: "file" as const,
      onChange: handleFileChange,
      accept: props.accept || accept,
      multiple: props.multiple !== undefined ? props.multiple : multiple,
      ref: inputRef,
    }),
    [accept, multiple, handleFileChange]
  );

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};
