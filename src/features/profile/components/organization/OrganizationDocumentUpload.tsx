"use client";

import React from "react";
import DocumentUpload from "@/features/profile/components/common/file-upload/DocumentUpload";

const OrganizationDocumentUpload: React.FC = () => {
  return (
    <DocumentUpload
      role="ORGANIZATION"
      title="Organization Document Upload"
      description="Upload your organization identification and verification documents. All mandatory documents must be completed before submission."
    />
  );
};

export default OrganizationDocumentUpload;
