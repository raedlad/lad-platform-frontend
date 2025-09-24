// "use client";

// import React from "react";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useTranslations } from "next-intl";
// import { ContractorDocumentUpload } from "@/features/profile/components/contractor";

// const DocumentsPage = () => {
//   const t = useTranslations("profile.documents.page");

//   return (
//     <div className="">
//       <div className="container-centered max-w-7xl  px-0">
//         {/* Header */}
//         <Link href="/dashboard/contractor/profile">
//           <ArrowLeft className="w-4 h-4" />
//         </Link>
//         <div className="header-centered-padded">
//           <h1 className="heading-section text-foreground mb-2">{t("title")}</h1>
//           <p className="text-description">{t("description")}</p>
//         </div>

//         {/* Document Upload Component */}
//         <ContractorDocumentUpload />
//       </div>
//     </div>
//   );
// };

// export default DocumentsPage;

export default function DocumentsPage() {
  return <div>documents page</div>;
}