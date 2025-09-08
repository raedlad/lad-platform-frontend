"use client";

import React, { useState } from "react";
import { Button } from "@shared/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Download,
  Trash2,
  FileText,
  Image,
  File,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { useDocumentsStore } from "@/features/profile/store/documentStore";
import { UploadedFile } from "@/features/profile/types/documents";
import { formatBytes } from "@/features/profile/utils/documents";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  /** Role for context */
  role: string;
  /** Document ID */
  docId: string;
  /** Uploaded file to display */
  file: UploadedFile;
  /** Whether file can be removed */
  canRemove?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  role,
  docId,
  file,
  canRemove = true,
  className,
}) => {
  const {
    removeFile,
    downloadFile,
    updateFileMetadata,
    canRemoveFiles,
    getDocumentRequirement,
  } = useDocumentsStore();
  const allowRemove = canRemoveFiles(role, docId) && canRemove;
  const docRequirement = getDocumentRequirement(role, docId);
  const isApprovedMandatory =
    docRequirement?.mandatory && docRequirement?.status === "approved";

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    customName: file.customName || file.fileName,
    description: file.description || "",
    expiryDate: file.expiryDate || "",
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <Image className="w-5 h-5" />;
    }

    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="w-5 h-5" />;
    }

    return <File className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="success" className="text-xs">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="text-xs">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Uploaded
          </Badge>
        );
    }
  };

  const handleRemove = () => {
    removeFile(role, docId, file.id);
  };

  const handleDownload = () => {
    downloadFile(role, docId, file.id);
  };

  const handleSave = () => {
    updateFileMetadata(role, docId, file.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      customName: file.customName || file.fileName,
      description: file.description || "",
      expiryDate: file.expiryDate || "",
    });
    setIsEditing(false);
  };

  const isExpired = file.expiryDate && new Date(file.expiryDate) < new Date();

  return (
    <Card className={cn("w-full transition-all hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* File Icon */}
          <div className="flex-shrink-0 text-muted-foreground mt-1">
            {getFileIcon(file.fileName)}
          </div>

          <div className="flex-1 min-w-0">
            {/* File Name / Custom Name */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <Input
                    value={editData.customName}
                    onChange={(e) =>
                      setEditData({ ...editData, customName: e.target.value })
                    }
                    className="text-sm font-medium"
                    placeholder="Custom name"
                  />
                ) : (
                  <CardTitle className="text-sm font-medium break-words line-clamp-2 leading-tight">
                    {file.customName || file.fileName}
                  </CardTitle>
                )}
                <p className="text-xs text-muted-foreground mt-1 break-all line-clamp-1">
                  Original: {file.fileName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(file.status)}
                {isExpired && (
                  <Badge variant="destructive" className="text-xs">
                    Expired
                  </Badge>
                )}
                {isApprovedMandatory && (
                  <Badge
                    variant="outline"
                    className="text-xs border-yellow-500 text-yellow-700"
                  >
                    Protected
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              {isEditing ? (
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Add description..."
                  className="min-h-[60px] text-sm"
                />
              ) : (
                file.description && (
                  <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                    {file.description}
                  </p>
                )
              )}
            </div>

            {/* File Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground mb-3">
              <div>
                <span className="font-medium">Uploaded:</span>
                <br />
                {new Date(file.uploadedAt).toLocaleDateString()}
              </div>

              {file.size && (
                <div>
                  <span className="font-medium">Size:</span>
                  <br />
                  {formatBytes(file.size)}
                </div>
              )}

              <div>
                <span className="font-medium">Status:</span>
                <br />
                <div className="flex items-center gap-1 mt-1">
                  {getStatusIcon(file.status)}
                  <span className="capitalize">{file.status}</span>
                </div>
              </div>

              <div>
                <span className="font-medium">Expiry:</span>
                <br />
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.expiryDate}
                    onChange={(e) =>
                      setEditData({ ...editData, expiryDate: e.target.value })
                    }
                    className="text-xs h-6 mt-1"
                  />
                ) : (
                  <span
                    className={cn(
                      "flex items-center gap-1 mt-1",
                      isExpired && "text-red-600"
                    )}
                  >
                    <Calendar className="w-3 h-3" />
                    {file.expiryDate
                      ? new Date(file.expiryDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {/* Edit */}
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2 text-xs"
                title="Edit metadata"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            )}

            {/* Save/Cancel when editing */}
            {isEditing && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 px-2 text-xs"
                  title="Save changes"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 px-2 text-xs"
                  title="Cancel editing"
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Download */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </Button>

            {/* Remove */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={!allowRemove}
              className={cn(
                "h-8 w-8 p-0",
                allowRemove
                  ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                  : "text-muted-foreground/30 cursor-not-allowed"
              )}
              title={
                isApprovedMandatory
                  ? "Cannot delete: Mandatory document is approved"
                  : allowRemove
                  ? "Remove file"
                  : "Cannot delete this file"
              }
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
