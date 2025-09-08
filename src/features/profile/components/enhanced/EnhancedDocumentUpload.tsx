"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Wifi,
  WifiOff,
  FileX,
  Upload,
} from "lucide-react";
import { useDocumentsStore } from "@/features/profile/store/documentStore";
import DocumentsForm from "../common/DocumentsForm";
import FileErrorsDisplay from "../common/FileErrorsDisplay";
import { cn } from "@/lib/utils";

interface EnhancedDocumentUploadProps {
  role: string;
  title: string;
  description: string;
  className?: string;
}

/**
 * Enhanced Document Upload component with comprehensive file-level error handling
 * Features:
 * - Individual file error tracking and display
 * - Real-time error recovery options
 * - Store-integrated file management
 * - Network status monitoring
 * - API/Mock data toggle
 * - Progress tracking with cancellation
 */
const EnhancedDocumentUpload: React.FC<EnhancedDocumentUploadProps> = ({
  role,
  title,
  description,
  className,
}) => {
  const {
    // Data
    roleDocuments,

    // Loading states
    isLoading,
    isSubmitting,

    // Error states
    errors,
    fileErrors,
    networkStatus,

    // Success states
    submitSuccess,

    // Settings
    useRealApi,

    // Actions
    fetchDocuments,
    setUseRealApi,
    clearError,
    clearAllErrors,
    retryFailedOperation,
    resetSubmitSuccess,
    refreshDocuments,
    getFilesByError,
  } = useDocumentsStore();

  const requirements = roleDocuments[role] || [];
  const isLoadingRole = isLoading[role];
  const error = errors[role];
  const isSubmittingRole = isSubmitting[role];
  const submitSuccessRole = submitSuccess[role];
  const networkStatusRole = networkStatus[role];
  const failedFiles = getFilesByError().filter((file) =>
    file.fileId.startsWith(role)
  );

  // Load documents on mount
  useEffect(() => {
    if (!requirements.length && !isLoadingRole) {
      fetchDocuments(role);
    }
  }, [role, requirements.length, isLoadingRole, fetchDocuments]);

  const handleToggleApi = () => {
    setUseRealApi(!useRealApi);
    refreshDocuments(role);
  };

  const handleRetryFetch = async () => {
    await retryFailedOperation(role, "fetch");
  };

  if (isLoadingRole) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with Enhanced Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Network Status */}
              <div className="flex items-center gap-2 text-sm">
                {networkStatusRole === "offline" ? (
                  <>
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Online</span>
                  </>
                )}
              </div>

              {/* API Mode Toggle */}
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <Button
                  variant={useRealApi ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleApi}
                  className="text-xs"
                >
                  {useRealApi ? "Real API" : "Mock Data"}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Status Overview */}
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
              <div className="font-semibold text-blue-800 dark:text-blue-200">
                {requirements.length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-300">
                Total Documents
              </div>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded">
              <div className="font-semibold text-green-800 dark:text-green-200">
                {requirements.filter((req) => req.uploadedFiles?.length).length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-300">
                Uploaded
              </div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded">
              <div className="font-semibold text-red-800 dark:text-red-200">
                {failedFiles.length}
              </div>
              <div className="text-xs text-red-600 dark:text-red-300">
                Failed Files
              </div>
            </div>
            <div className="text-center p-2 bg-amber-50 dark:bg-amber-950 rounded">
              <div className="font-semibold text-amber-800 dark:text-amber-200">
                {useRealApi ? "API" : "Mock"}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-300">
                Data Source
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-level Error Display with Retry Options */}
      {error && (
        <Alert variant="destructive" appearance="light">
          <AlertIcon>
            <AlertTriangle />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Error Loading Documents</AlertTitle>
            <AlertDescription>
              <p className="mb-2">{error}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryFetch}
                  disabled={isLoadingRole}
                >
                  <RefreshCw
                    className={cn(
                      "w-4 h-4 mr-2",
                      isLoadingRole && "animate-spin"
                    )}
                  />
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearError(role)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {/* File-level Errors Summary */}
      {failedFiles.length > 0 && (
        <Alert variant="destructive" appearance="light">
          <AlertIcon>
            <FileX />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>File Upload Errors</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                {failedFiles.length} file(s) failed to upload. Individual errors
                are shown below each document.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearAllErrors()}
                >
                  Clear All Errors
                </Button>
              </div>
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {/* Success Display */}
      {submitSuccessRole && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <AlertIcon>
            <CheckCircle className="text-green-600" />
          </AlertIcon>
          <AlertContent>
            <AlertTitle className="text-green-800 dark:text-green-200">
              Documents Submitted Successfully!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              <p className="mb-2">
                Your documents have been submitted for review.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => resetSubmitSuccess(role)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {/* Main Documents Form with Enhanced Error Handling */}
      {requirements.length > 0 && (
        <DocumentsForm role={role} requirements={requirements} />
      )}

      {/* Loading Overlay for Submission */}
      {isSubmittingRole && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-6">
            <CardContent className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Submitting documents...</span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Debug Panel (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Role:</strong> {role}
              </div>
              <div>
                <strong>API Mode:</strong> {useRealApi ? "Real" : "Mock"}
              </div>
              <div>
                <strong>Network:</strong> {networkStatusRole || "Unknown"}
              </div>
              <div>
                <strong>Documents:</strong> {requirements.length}
              </div>
            </div>

            <div>
              <strong>File Errors:</strong> {Object.keys(fileErrors).length}
              {Object.keys(fileErrors).length > 0 && (
                <div className="mt-1 pl-4 text-xs">
                  {Object.entries(fileErrors).map(([fileId, error]) => (
                    <div key={fileId} className="truncate">
                      {fileId}: {error.error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearAllErrors()}
              >
                Clear All Errors
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshDocuments(role)}
              >
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDocumentUpload;
