"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Settings } from "lucide-react";
import TableUpload from "../common/file-upload/tableUpload";
import { FileWithStatus } from "@/features/profile/types/documents";
import { useDocumentsStore } from "@/features/profile/store/documentStore";

/**
 * Demo component to test TableUpload with store integration
 * Shows how progress/error/success is handled directly in the table
 */
const TableUploadDemo: React.FC = () => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [useStoreIntegration, setUseStoreIntegration] = useState(true);

  const { useRealApi, setUseRealApi, clearAllErrors, getFilesByError } =
    useDocumentsStore();

  const failedFiles = getFilesByError();

  const handleFilesChange = (newFiles: FileWithStatus[]) => {
    setFiles(newFiles);
  };

  const handleFileAdd = (fileList: FileList) => {
    // In demo mode, just log the files
    console.log(
      "Files added:",
      Array.from(fileList).map((f) => f.name)
    );
  };

  const handleClearFiles = () => {
    setFiles([]);
    clearAllErrors();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            TableUpload Demo - Direct Progress/Error Handling
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Test the TableUpload component with store integration. Progress,
            errors, and success messages are handled directly in the table rows.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {/* API Mode Toggle */}
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <Button
                variant={useRealApi ? "primary" : "outline"}
                size="sm"
                onClick={() => setUseRealApi(!useRealApi)}
                className="text-xs"
              >
                {useRealApi ? "Real API" : "Mock API"}
              </Button>
            </div>

            {/* Store Integration Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={useStoreIntegration ? "primary" : "outline"}
                size="sm"
                onClick={() => setUseStoreIntegration(!useStoreIntegration)}
                className="text-xs"
              >
                {useStoreIntegration
                  ? "Store Integration ON"
                  : "Store Integration OFF"}
              </Button>
            </div>

            {/* Clear files */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFiles}
              className="text-xs"
            >
              Clear Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="font-semibold text-blue-800 dark:text-blue-200">
                {files.length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-300">
                Total Files
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="font-semibold text-green-800 dark:text-green-200">
                {useStoreIntegration ? "Enabled" : "Disabled"}
              </div>
              <div className="text-xs text-green-600 dark:text-green-300">
                Store Integration
              </div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="font-semibold text-red-800 dark:text-red-200">
                {failedFiles.length}
              </div>
              <div className="text-xs text-red-600 dark:text-red-300">
                Failed Uploads
              </div>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
              <div className="font-semibold text-amber-800 dark:text-amber-200">
                {useRealApi ? "Real" : "Mock"}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-300">
                API Mode
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">
                1
              </Badge>
              <div>
                <strong>Store Integration ON:</strong> Files will be uploaded
                via the store, showing real progress and API calls. Progress,
                errors, and success messages appear directly in the table rows.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">
                2
              </Badge>
              <div>
                <strong>Store Integration OFF:</strong> Traditional file
                handling without API calls. Only basic file display without
                upload functionality.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-xs">
                3
              </Badge>
              <div>
                <strong>Mock API:</strong> Simulates upload with progress
                animation.
                <strong className="ml-2">Real API:</strong> Makes actual API
                calls (will fail in demo).
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TableUpload Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            File Upload Table
          </CardTitle>
          <div className="flex gap-2 text-xs">
            {useStoreIntegration && (
              <Badge variant="primary">Store Integration Active</Badge>
            )}
            <Badge variant="secondary">
              Progress: {useStoreIntegration ? "In Table Rows" : "Disabled"}
            </Badge>
            <Badge variant="secondary">
              Errors: {useStoreIntegration ? "Per File in Table" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <TableUpload
            // Store integration settings
            role="DEMO"
            docId="test-document"
            useStore={useStoreIntegration}
            // File management
            files={files}
            onFilesChange={handleFilesChange}
            onFileAdd={handleFileAdd}
            // Upload rules
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
            accept=".pdf,.jpg,.png,.doc,.docx"
            multiple={true}
            // UI options
            showStatus={true}
            showProgress={true} // This will show progress directly in table rows
            allowAddFiles={true}
            allowRemoveFiles={true}
            className="border-2 border-dashed border-muted-foreground/25"
          />
        </CardContent>
      </Card>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>
              <strong>Files in State:</strong> {files.length}
            </div>
            <div>
              <strong>Store Integration:</strong>{" "}
              {useStoreIntegration ? "ON" : "OFF"}
            </div>
            <div>
              <strong>API Mode:</strong> {useRealApi ? "Real" : "Mock"}
            </div>
            <div>
              <strong>Failed Files:</strong> {failedFiles.length}
            </div>
            {failedFiles.length > 0 && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                <div>
                  <strong>Failed Files Details:</strong>
                </div>
                {failedFiles.map((file) => (
                  <div key={file.fileId} className="text-xs">
                    • {file.fileName}: {file.error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TableUploadDemo;
