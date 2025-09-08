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
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useDocumentsStore } from "@/features/profile/store/documentStore";
import DocumentsForm from "../common/DocumentsForm";
import { cn } from "@/lib/utils";

interface DocumentUploadWithApiProps {
  role: string;
  title: string;
  description: string;
  className?: string;
}

/**
 * Enhanced Document Upload component with full API integration
 * Demonstrates all new features:
 * - Real API integration with fallback to mock data
 * - Progress tracking with cancellation
 * - Comprehensive error handling
 * - Retry mechanisms
 * - Network status monitoring
 */
const DocumentUploadWithApi: React.FC<DocumentUploadWithApiProps> = ({
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
    networkStatus,

    // Success states
    submitSuccess,

    // Settings
    useRealApi,

    // Actions
    fetchDocuments,
    submitDocuments,
    setUseRealApi,
    clearError,
    clearAllErrors,
    retryFailedOperation,
    resetSubmitSuccess,
    refreshDocuments,
  } = useDocumentsStore();

  const requirements = roleDocuments[role] || [];
  const isLoadingRole = isLoading[role];
  const error = errors[role];
  const isSubmittingRole = isSubmitting[role];
  const submitSuccessRole = submitSuccess[role];
  const networkStatusRole = networkStatus[role];

  // Load documents on mount
  useEffect(() => {
    if (!requirements.length && !isLoadingRole) {
      fetchDocuments(role);
    }
  }, [role, requirements.length, isLoadingRole, fetchDocuments]);

  const handleToggleApi = () => {
    setUseRealApi(!useRealApi);
    // Refresh data when switching API modes
    refreshDocuments(role);
  };

  const handleRetryFetch = async () => {
    await retryFailedOperation(role, "fetch");
  };

  const handleRetrySubmit = async () => {
    await retryFailedOperation(role, "submit");
  };

  const handleClearAllErrors = () => {
    clearAllErrors();
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
      {/* Header with API Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Network Status Indicator */}
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

      {/* Error Display with Retry Options */}
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

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <div className="text-center">
          <div className="font-semibold text-blue-800 dark:text-blue-200">
            {useRealApi ? "Real API" : "Mock API"}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Data Source
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-800 dark:text-blue-200">
            ✓ Progress Tracking
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Real-time Upload
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-800 dark:text-blue-200">
            ✓ Error Recovery
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Auto Retry Logic
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-blue-800 dark:text-blue-200">
            ✓ Upload Control
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            Cancel & Resume
          </div>
        </div>
      </div>

      {/* Documents Form */}
      {requirements.length > 0 && (
        <DocumentsForm role={role} requirements={requirements} />
      )}

      {/* Loading Overlay for Submission */}
      {isSubmittingRole && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Submitting documents...</span>
            </div>
          </div>
        </div>
      )}

      {/* Debug Panel (Development Only) */}
      {process.env.NODE_ENV === "development" && (
        <details className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <summary className="cursor-pointer font-semibold">
            Debug Information
          </summary>
          <div className="mt-2 space-y-2 text-xs">
            <div>
              <strong>Role:</strong> {role}
            </div>
            <div>
              <strong>API Mode:</strong> {useRealApi ? "Real" : "Mock"}
            </div>
            <div>
              <strong>Network Status:</strong> {networkStatusRole || "Unknown"}
            </div>
            <div>
              <strong>Documents Count:</strong> {requirements.length}
            </div>
            <div>
              <strong>Loading States:</strong> Loading: {String(isLoadingRole)},
              Submitting: {String(isSubmittingRole)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllErrors}
              className="mt-2"
            >
              Clear All Errors
            </Button>
          </div>
        </details>
      )}
    </div>
  );
};

export default DocumentUploadWithApi;
