"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  FileText,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  RefreshCw,
} from "lucide-react";

// Import the enhanced components
import EnhancedDocumentUpload from "../enhanced/EnhancedDocumentUpload";
import DocumentUploadWithApi from "../enhanced/DocumentUploadWithApi";
import GenericDocumentUpload from "../common/GenericDocumentUpload";

/**
 * Examples showcasing different document upload implementations
 * with file-level error handling
 */
const DocumentUploadExamples: React.FC = () => {
  const [selectedExample, setSelectedExample] =
    React.useState<string>("enhanced");

  const examples = [
    {
      id: "enhanced",
      title: "Enhanced Document Upload",
      description: "Full-featured upload with file-level error handling",
      features: [
        "Individual file error tracking",
        "Real-time error recovery",
        "Store-integrated management",
        "Progress tracking with cancellation",
        "API/Mock data toggle",
      ],
      component: (
        <EnhancedDocumentUpload
          role="INDIVIDUAL"
          title="Enhanced Document Upload"
          description="Upload with comprehensive error handling"
        />
      ),
    },
    {
      id: "api-integration",
      title: "API Integration Demo",
      description: "Demonstrates real API integration features",
      features: [
        "Network status monitoring",
        "Retry mechanisms",
        "Upload cancellation",
        "Error recovery options",
        "Development debug panel",
      ],
      component: (
        <DocumentUploadWithApi
          role="ENGINEERING_OFFICE"
          title="API Integration Demo"
          description="Real API integration with error handling"
        />
      ),
    },
    {
      id: "generic",
      title: "Generic Document Upload",
      description: "Basic implementation with store integration",
      features: [
        "Store-based state management",
        "Basic error handling",
        "Progress indicators",
        "Success/error states",
        "Clean UI components",
      ],
      component: (
        <GenericDocumentUpload
          role="FREELANCE_ENGINEER"
          title="Generic Document Upload"
          description="Basic document upload with store integration"
        />
      ),
    },
  ];

  const selectedExampleData = examples.find((ex) => ex.id === selectedExample);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Document Upload Examples
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Comprehensive examples showcasing file-level error handling and
            store integration
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((example) => (
              <Card
                key={example.id}
                className={`cursor-pointer transition-all ${
                  selectedExample === example.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/50"
                }`}
                onClick={() => setSelectedExample(example.id)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {example.title}
                    {selectedExample === example.id && (
                      <Badge variant="default" className="ml-auto text-xs">
                        Selected
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {example.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {example.features.slice(0, 3).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs"
                      >
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {example.features.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{example.features.length - 3} more features
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Key Features Demonstrated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">
                  File-Level Errors
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Individual error tracking for each uploaded file with specific
                  error messages
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <RefreshCw className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-green-800 dark:text-green-200">
                  Error Recovery
                </h4>
                <p className="text-xs text-green-600 dark:text-green-300">
                  Retry failed uploads with one-click recovery options
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-purple-800 dark:text-purple-200">
                  Store Integration
                </h4>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  Zustand store manages all state with no prop drilling
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">
                Enhanced Upload with Error Handling
              </h4>
              <pre className="text-xs overflow-x-auto">
                {`// Full-featured upload with file-level errors
<EnhancedDocumentUpload
  role="INDIVIDUAL"
  title="Upload Your Documents"
  description="Complete document upload with error recovery"
/>

// Store integration automatically handles:
// - File-level error tracking
// - Progress monitoring  
// - Retry mechanisms
// - Cancel functionality`}
              </pre>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">
                Store Usage for Custom Components
              </h4>
              <pre className="text-xs overflow-x-auto">
                {`const {
  // File-level error handling
  setFileError,
  clearFileError,
  getFileError,
  getFilesByError,
  
  // Upload management
  uploadFile,
  cancelUpload,
  generateFileId,
} = useDocumentsStore();

// Set file-specific error
setFileError(fileId, "Upload failed: Network error");

// Get errors for display
const failedFiles = getFilesByError();`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Example Display */}
      {selectedExampleData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedExampleData.title} - Live Demo
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              {selectedExampleData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>{selectedExampleData.component}</CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentUploadExamples;
