"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ContractorDocumentUpload } from "@/features/profile/components/contractor";
import { authApi } from "@/features/auth/services/authApi";

const DocumentsPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      await authApi.hydrateProfileFromBackend("contractor");
      setLoaded(true);
    };
    hydrate();
  }, []);

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
        {loaded && <ContractorDocumentUpload />}
      </div>
    </div>
  );
};

export default DocumentsPage;
