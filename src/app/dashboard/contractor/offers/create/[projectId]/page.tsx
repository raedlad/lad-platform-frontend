// "use client";
// import React from "react";
// import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { CreateCompleteOfferForm } from "@/features/offers/components";

// interface CreateCompleteOfferPageProps {
//   params: {
//     projectId: string;
//   };
// }

// export default function CreateCompleteOfferPage({
//   params,
// }: CreateCompleteOfferPageProps) {
//   const t = useTranslations();
//   const router = useRouter();
//   const { projectId } = params;

//   const handleSuccess = () => {
//     router.push("/dashboard/contractor/offers");
//   };

//   const handleCancel = () => {
//     router.back();
//   };

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={handleCancel}
//           className="flex items-center gap-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Create Complete Offer
//           </h1>
//           <p className="text-gray-600">
//             Submit a comprehensive offer with project phases and payment plans
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <CreateCompleteOfferForm
//         projectId={projectId}
//         projectTitle="Project Title" // This should be fetched from the project data
//         onSuccess={handleSuccess}
//         onCancel={handleCancel}
//       />
//     </div>
//   );
// }

export default function CreateCompleteOfferPage() {
  return (
    <div>
      <h1>Create Complete Offer</h1>
    </div>
  );
}
