"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  Trash2,
  AlertCircle,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  type: string;
  category: "mandatory" | "optional";
  status: "pending" | "verified" | "rejected";
  uploadDate: string;
  size: string;
  url?: string;
  rejectionReason?: string;
}

export function ProfileDocuments() {
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Mock user role - this should come from user store/context
  const userRole = "Engineering Office";

  // Mock documents data - replace with actual data from store/API
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "National ID",
      type: "Identity Document",
      category: "mandatory",
      status: "verified",
      uploadDate: "2024-01-15",
      size: "2.1 MB",
      url: "/documents/national-id.pdf",
    },
    {
      id: "2",
      name: "Professional License",
      type: "Professional Certificate",
      category: "mandatory",
      status: "verified",
      uploadDate: "2024-01-16",
      size: "1.8 MB",
      url: "/documents/professional-license.pdf",
    },
    {
      id: "3",
      name: "Commercial Registration",
      type: "Business License",
      category: "mandatory",
      status: "pending",
      uploadDate: "2024-01-20",
      size: "1.5 MB",
      url: "/documents/commercial-reg.pdf",
    },
    {
      id: "4",
      name: "VAT Certificate",
      type: "Tax Document",
      category: "optional",
      status: "rejected",
      uploadDate: "2024-01-18",
      size: "0.9 MB",
      rejectionReason:
        "Document is not clear. Please upload a higher quality scan.",
    },
  ]);

  // Document requirements based on user role
  const getRequiredDocuments = (role: string) => {
    const baseDocuments = [
      {
        name: "National ID",
        type: "Identity Document",
        category: "mandatory" as const,
      },
      {
        name: "Passport Photo",
        type: "Identity Document",
        category: "mandatory" as const,
      },
    ];

    const roleSpecificDocuments = {
      Individual: [],
      Organization: [
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
      ],
      "Engineering Office": [
        {
          name: "Professional License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
        {
          name: "VAT Certificate",
          type: "Tax Document",
          category: "optional" as const,
        },
        {
          name: "Previous Work Portfolio",
          type: "Portfolio",
          category: "optional" as const,
        },
      ],
      "Freelance Engineer": [
        {
          name: "Professional License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
        {
          name: "Technical CV",
          type: "Resume",
          category: "mandatory" as const,
        },
        {
          name: "Certifications",
          type: "Professional Certificate",
          category: "optional" as const,
        },
      ],
      Contractor: [
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
        {
          name: "Contractor License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
        {
          name: "Insurance Certificate",
          type: "Insurance Document",
          category: "mandatory" as const,
        },
        {
          name: "Previous Projects",
          type: "Portfolio",
          category: "optional" as const,
        },
      ],
      Supplier: [
        {
          name: "Commercial Registration",
          type: "Business License",
          category: "mandatory" as const,
        },
        {
          name: "Supplier License",
          type: "Professional Certificate",
          category: "mandatory" as const,
        },
        {
          name: "Product Catalog",
          type: "Catalog",
          category: "optional" as const,
        },
      ],
    };

    return [
      ...baseDocuments,
      ...(roleSpecificDocuments[role as keyof typeof roleSpecificDocuments] ||
        []),
    ];
  };

  const requiredDocuments = getRequiredDocuments(userRole);
  const uploadedDocumentNames = documents.map((doc) => doc.name);
  const missingDocuments = requiredDocuments.filter(
    (req) => !uploadedDocumentNames.includes(req.name)
  );

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Verified
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleFileUpload = (documentName: string, file: File) => {
    console.log(`Uploading ${documentName}:`, file);

    // Simulate upload progress
    setUploadProgress((prev) => ({ ...prev, [documentName]: 0 }));

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[documentName] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [documentName]: currentProgress + 10 };
      });
    }, 200);
  };

  const handleDownload = (document: Document) => {
    console.log("Downloading document:", document.name);
  };

  const handleView = (document: Document) => {
    console.log("Viewing document:", document.name);
  };

  const handleDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const mandatoryDocuments = documents.filter(
    (doc) => doc.category === "mandatory"
  );
  const optionalDocuments = documents.filter(
    (doc) => doc.category === "optional"
  );

  const verifiedCount = documents.filter(
    (doc) => doc.status === "verified"
  ).length;
  const totalCount = documents.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Document Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Document Verification Status</span>
          </CardTitle>
          <CardDescription>
            Track the status of your document uploads and verification process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {documents.filter((doc) => doc.status === "verified").length}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Verified
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {documents.filter((doc) => doc.status === "pending").length}
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Pending
              </p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {documents.filter((doc) => doc.status === "rejected").length}
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">Rejected</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Verification Progress</span>
              <span className="text-gray-600 dark:text-gray-300">
                {verifiedCount} of {totalCount} documents verified
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Missing Documents Alert */}
      {missingDocuments.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="h-5 w-5" />
              <span>Missing Required Documents</span>
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Please upload the following required documents to complete your
              profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missingDocuments.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {doc.type}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mandatory Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            These documents are mandatory for account verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mandatoryDocuments.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(document.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{document.name}</h4>
                      {getStatusBadge(document.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <span>{document.type}</span>
                      <span>•</span>
                      <span>{document.size}</span>
                      <span>•</span>
                      <span>
                        Uploaded{" "}
                        {new Date(document.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                    {document.status === "rejected" &&
                      document.rejectionReason && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          {document.rejectionReason}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(document)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  {document.status === "rejected" && (
                    <Button variant="outline" size="sm">
                      <Upload className="w-3 h-3 mr-1" />
                      Re-upload
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optional Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Optional Documents</CardTitle>
          <CardDescription>
            Additional documents to enhance your profile credibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {optionalDocuments.length > 0 ? (
            <div className="space-y-4">
              {optionalDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(document.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{document.name}</h4>
                        {getStatusBadge(document.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>{document.type}</span>
                        <span>•</span>
                        <span>{document.size}</span>
                        <span>•</span>
                        <span>
                          Uploaded{" "}
                          {new Date(document.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                      {document.status === "rejected" &&
                        document.rejectionReason && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            {document.rejectionReason}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(document)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    {document.status === "rejected" && (
                      <Button variant="outline" size="sm">
                        <Upload className="w-3 h-3 mr-1" />
                        Re-upload
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No optional documents uploaded
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upload additional documents to enhance your profile credibility
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
          <CardDescription>
            Please follow these guidelines for document uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Accepted Formats</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• PDF files (.pdf)</li>
                <li>• Image files (.jpg, .jpeg, .png)</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Quality Requirements</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• High resolution and clear text</li>
                <li>• Full document visible</li>
                <li>• No watermarks or modifications</li>
                <li>• Original or certified copies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
