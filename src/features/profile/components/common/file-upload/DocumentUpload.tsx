"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Upload, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useDocumentsStore } from "@/features/profile/store/documentStore";
import ManualFileUploadZone from "./ManualFileUploadZone";
import DocumentList from "./DocumentList";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  /** User role for document requirements */
  role: string;
  /** Optional title override */
  title?: string;
  /** Optional description override */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Clean, professional document upload component
 * - Single responsibility: Handle document upload for a role
 * - Store integration: All state managed centrally
 * - No nesting: Direct, simple architecture
 */
const DocumentUpload: React.FC<DocumentUploadProps> = ({
  role,
  title,
  description,
  className,
}) => {
  const t = useTranslations("profile.documents.upload");
  const {
    roleDocuments,
    isLoading,
    errors,
    submitSuccess,
    fetchDocuments,
    submitDocuments,
    getMandatoryCompletionStatus,
    clearError,
    resetSubmitSuccess,
    uploadFile,
    canAddFiles,
    getDocumentRequirement,
    getErrorMessage,
  } = useDocumentsStore();

  const requirements = roleDocuments[role] || [];
  const isLoadingRole = isLoading[role];
  const error = errors[role];
  const success = submitSuccess[role];
  const { completed, total } = getMandatoryCompletionStatus(role);

  // Load documents on mount
  useEffect(() => {
    if (!requirements.length && !isLoadingRole && !error) {
      fetchDocuments(role);
    }
  }, [role, requirements.length, isLoadingRole, error]); // Added error check to prevent retry loops

  const handleSubmit = () => {
    submitDocuments(role);
  };

  const handleRetry = () => {
    clearError(role);
    fetchDocuments(role);
  };

  const getRoleTitle = () => {
    const titles: Record<string, string> = {
      INDIVIDUAL: t("individualDocuments"),
      ORGANIZATION: t("organizationDocuments"),
      ENGINEERING_OFFICE: t("engineeringOfficeDocuments"),
      FREELANCE_ENGINEER: t("freelanceEngineerDocuments"),
      CONTRACTOR: t("contractorDocuments"),
      SUPPLIER: t("supplierDocuments"),
    };
    return title || titles[role] || "Documents";
  };

  const getRoleDescription = () => {
    if (description) return description;
    return `Upload and verify your ${role
      .toLowerCase()
      .replace(
        "_",
        " "
      )} documents. Complete all mandatory documents to proceed.`;
  };

  if (isLoadingRole) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>{t("loading")}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {t("errorLoading")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("tryAgain")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-design-main" />
            {t("title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </CardHeader>
        <CardContent>
          {/* Progress Overview - Responsive */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-medium">
                {t("mandatoryProgress")}
              </span>
              <span className="font-bold text-lg text-design-main">
                {completed}/{total}
              </span>
            </div>

            <Progress
              value={total > 0 ? (completed / total) * 100 : 0}
              className="h-3 bg-design-main/20"
              indicatorClassName="bg-design-main"
            />

            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-design-main rounded-full" />
                <span>
                  {t("completed")} ({completed})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-design-main/10 rounded-full" />
                <span>
                  {t("pending")} ({total - completed})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {success && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 dark:text-green-200 font-medium">
                {t("submittedSuccessfully")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetSubmitSuccess(role)}
              className="text-green-600 hover:text-green-700"
            >
              {t("dismiss")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Document Requirements - Responsive Layout */}
      <div className="space-y-6">
        {requirements.map((requirement) => (
          <Card key={requirement.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              {/* Responsive header layout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>{requirement.label}</span>
                  {requirement.mandatory && <span className="text-d-6 inline-flex">*</span>}
                </CardTitle>
              </div>

              {/* File requirements - responsive text */}
              <div className="text-xs text-muted-foreground space-y-1 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span>{t("maxFiles", { count: requirement.maxFiles })}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{t("maxSize", { size: requirement.maxFileSize })}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="break-all">
                    {t("acceptedTypes", {
                      types: requirement.acceptTypes.join(", "),
                    })}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Rejection Comment */}
              {requirement.status === "rejected" &&
                requirement.reviewComment && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="text-sm min-w-0">
                        <p className="font-medium text-destructive mb-2">
                          {t("reviewComment")}
                        </p>
                        <p className="text-destructive/80 break-words">
                          {requirement.reviewComment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* File Upload Zone */}
              <div className="w-full">
                <ManualFileUploadZone
                  role={role}
                  docId={requirement.id}
                  maxFiles={requirement.maxFiles}
                  maxSize={requirement.maxFileSize * 1024 * 1024}
                  acceptTypes={requirement.acceptTypes}
                  disabled={requirement.status === "approved"}
                  uploadFile={uploadFile}
                  canAddFiles={canAddFiles}
                  getDocumentRequirement={getDocumentRequirement}
                  getErrorMessage={getErrorMessage}
                />
              </div>

              {/* Document List */}
              <DocumentList
                role={role}
                docId={requirement.id}
                files={requirement.uploadedFiles || []}
                canRemove={requirement.status !== "approved"}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Submit Button - Responsive */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {completed === total
                ? t("allCompleted")
                : t("remaining", { count: total - completed })}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={completed < total}
              className="min-w-[140px] w-full sm:w-auto"
            >
              {completed === total
                ? t("submitDocuments")
                : t("completeRequired")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
