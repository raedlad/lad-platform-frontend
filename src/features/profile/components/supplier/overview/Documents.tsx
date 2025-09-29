import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image,
  File,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useDocuments } from "@/features/profile/hooks/useDocuments";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Documents: React.FC = () => {
  const t = useTranslations("profile.tabs");
  const tDocuments = useTranslations("profile.documents");
  const tCommon = useTranslations("common");

  const { documents, isLoading, error, refreshDocuments } = useDocuments();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm dark:shadow-none">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {tCommon("error")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <Button
              onClick={refreshDocuments}
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {tCommon("tryAgain")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <Image className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
    }

    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="w-6 h-6 text-red-500 dark:text-red-400" />;
    }

    return <File className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
        );
      case "rejected":
        return (
          <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
        );
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success" className="text-xs font-medium px-2 py-1">
            {tDocuments("status.verified")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="destructive"
            className="text-xs font-medium px-2 py-1"
          >
            {tDocuments("status.rejected")}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
            {tDocuments("status.pending")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-medium px-2 py-1">
            {tDocuments("status.uploaded")}
          </Badge>
        );
    }
  };

  if (documents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6 dark:bg-card dark:border-border">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-design-main/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-design-main" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-design-main">
              {tDocuments("empty.title")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {tDocuments("empty.description")}
            </p>
            <Link href="/dashboard/supplier/profile/edit/documents">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                {t("uploadDocuments")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {documents.map((document) => (
          <div
            key={document.id}
            className=" border border-border rounded-lg p-4 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-design-main/10 rounded-lg flex items-center justify-center">
                  {getFileIcon(document.original_filename)}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {document.original_filename}
                  </p>
                  <p className="text-xs text-design-main">
                    {document.type_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(document.status)}
                {getStatusBadge(document.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
