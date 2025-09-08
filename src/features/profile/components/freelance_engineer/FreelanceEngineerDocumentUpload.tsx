"use client";

import React from "react";
import DocumentUpload from "@/features/profile/components/common/file-upload/DocumentUpload";

const freelanceEngineerDocumentUpload: React.FC = () => {
  return (
    <DocumentUpload
      role="FREELANCE_ENGINEER"
      title="Freelance Engineer Document Upload"
      description="Upload your personal identification and verification documents. All mandatory documents must be completed before submission."
    />
  );
};

export default freelanceEngineerDocumentUpload;
