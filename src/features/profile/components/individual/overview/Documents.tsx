import React from "react";
import { useTranslations } from "next-intl";
import { IndividualProfile } from "@/features/profile/types/individual";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image,
  File,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface DocumentsProps {
  profile?: IndividualProfile | null;
}

const Documents: React.FC<DocumentsProps> = ({ profile }) => {
  const tDocuments = useTranslations("profile.documents");

  const documents = profile?.documents || [];

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <Image className="w-6 h-6 text-blue-500" />;
    }

    if (["pdf", "doc", "docx", "txt"].includes(extension)) {
      return <FileText className="w-6 h-6 text-red-500" />;
    }

    return <File className="w-6 h-6 text-slate-500" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "rejected":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
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
            <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground dark:text-card-foreground">
              {tDocuments("empty.title")}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">
              {tDocuments("empty.description")}
            </p>
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
            className="bg-card border border-border rounded-lg p-4 dark:bg-card dark:border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  {getFileIcon(document.original_filename)}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground dark:text-card-foreground">
                    {document.original_filename}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
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
