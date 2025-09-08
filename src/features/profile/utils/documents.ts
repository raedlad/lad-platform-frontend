export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "approved":
      return "تمت الموافقة";
    case "pending":
      return "قيد المراجعة";
    case "rejected":
      return "مرفوض";
    case "expired":
      return "منتهي الصلاحية";
    default:
      return "غير مرفوع";
  }
};

// File validation utilities - pure functions
export const validateFileSize = (
  file: File,
  maxSize: number
): string | null => {
  if (file.size > maxSize) {
    return `File "${file.name}" exceeds the maximum size of ${formatBytes(
      maxSize
    )}.`;
  }
  return null;
};

export const validateFileType = (
  file: File,
  acceptTypes: string[]
): string | null => {
  if (acceptTypes.length === 0 || acceptTypes.includes("*")) {
    return null;
  }

  const fileType = file.type || "";
  const fileExtension = `.${file.name.split(".").pop()}`;

  const isAccepted = acceptTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileExtension.toLowerCase() === type.toLowerCase();
    }
    if (type.endsWith("/*")) {
      const baseType = type.split("/")[0];
      return fileType.startsWith(`${baseType}/`);
    }
    return fileType === type;
  });

  if (!isAccepted) {
    return `File "${file.name}" is not an accepted file type.`;
  }

  return null;
};

// Main validation function - pure utility
export const validateFiles = (
  fileList: FileList,
  maxFiles: number,
  maxSize: number,
  acceptTypes: string[],
  currentFileCount: number = 0
): string[] => {
  const errors: string[] = [];
  const filesArray = Array.from(fileList);

  // Check max files
  if (currentFileCount + filesArray.length > maxFiles) {
    errors.push(
      `Maximum ${maxFiles} files allowed. You can add ${
        maxFiles - currentFileCount
      } more file(s).`
    );
  }

  // Validate each file
  filesArray.forEach((file) => {
    const sizeError = validateFileSize(file, maxSize);
    if (sizeError) {
      errors.push(sizeError);
    }

    const typeError = validateFileType(file, acceptTypes);
    if (typeError) {
      errors.push(typeError);
    }
  });

  return errors;
};

// File icon utilities
export const getFileIcon = (file: File | any) => {
  const type = file instanceof File ? file.type : file.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "pdf";
  if (type.includes("word") || type.includes("doc")) return "document";
  if (type.includes("excel") || type.includes("sheet")) return "spreadsheet";
  if (type.includes("zip") || type.includes("rar")) return "archive";
  return "document";
};

export const getFileTypeLabel = (file: File | any) => {
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

// Status badge utilities
export const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case "approved":
      return "primary";
    case "pending":
    case "uploading":
      return "secondary";
    case "rejected":
    case "expired":
    case "error":
      return "destructive";
    default:
      return "outline";
  }
};

export const getUploadStatusLabel = (status?: string) => {
  switch (status) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "uploading":
      return "Uploading";
    case "rejected":
      return "Rejected";
    case "expired":
      return "Expired";
    case "error":
      return "Error";
    default:
      return "Unknown";
  }
};
