"use client";

import React from "react";
import DocumentCard from "./DocumentCard";
import { UploadedFile } from "@/features/profile/types/documents";
import { cn } from "@/lib/utils";

interface DocumentListProps {
  /** Role for context */
  role: string;
  /** Document ID */
  docId: string;
  /** Uploaded files to display */
  files: UploadedFile[];
  /** Whether files can be removed */
  canRemove?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Enhanced list of uploaded documents with card-based layout
 * - Shows enhanced file cards with metadata
 * - Responsive grid layout
 * - Clean, modern UI
 */
const DocumentList: React.FC<DocumentListProps> = ({
  role,
  docId,
  files,
  canRemove = true,
  className,
}) => {
  if (files.length === 0) {
    return (
      <div
        className={cn(
          "text-center py-8 text-sm text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed",
          className
        )}
      >
        <div className="space-y-2">
          <p className="font-medium">No files uploaded yet</p>
          <p className="text-xs">Upload files using the area above</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-sm font-medium text-muted-foreground flex items-center justify-between">
        <span>Uploaded Files ({files.length})</span>
        <span className="text-xs text-muted-foreground/70">
          Click "Edit" on any file to add custom name, description, or expiry
          date
        </span>
      </h4>

      {/* Responsive grid layout */}
      <div className="grid gap-4 ">
        {files.map((file, index) => (
          <DocumentCard
            key={file.id || `${file.fileName}-${index}`}
            role={role}
            docId={docId}
            file={file}
            canRemove={canRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentList;
