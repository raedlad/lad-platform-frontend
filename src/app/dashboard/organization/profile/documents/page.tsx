"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { OrganizationDocumentUpload } from "@/features/profile/components/organization";

const DocumentsPage = () => {
  return (
    <div className="section">
      <div className="container-centered">
        {/* Header */}
        <Link href="/dashboard/individual/profile">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="header-centered-padded">
          <h1 className="heading-section text-foreground mb-2">
            Documents & Verification
          </h1>
          <p className="text-description">
            Upload and manage your verification documents
          </p>
        </div>

        {/* Document Upload Component */}
        <OrganizationDocumentUpload />
      </div>
    </div>
  );
};

export default DocumentsPage;
