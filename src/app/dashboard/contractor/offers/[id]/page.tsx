// "use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import { useContractorOffers } from "@/features/offers/hooks/useContractorOffers";
// import { OfferDetails } from "@/features/offers/components/common/OfferDetails";

// const ContractorOfferDetailsPage = () => {
//   const params = useParams();
//   const offerId = params.id as string;
//   const { currentOffer, fetchOffer, isLoading, error } = useContractorOffers();

//   React.useEffect(() => {
//     if (offerId) {
//       fetchOffer(offerId);
//     }
//   }, [offerId, fetchOffer]);

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!currentOffer) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-600">Offer not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Offer Details</h1>
//         <p className="text-gray-600">View and manage your offer details</p>
//       </div>

//       <OfferDetails offer={currentOffer} />
//     </div>
//   );
// };

// export default ContractorOfferDetailsPage;

export default function ContractorOfferDetailsPage() {
  return (
    <div>
      <h1>Contractor Offer Details</h1>
    </div>
  )
}
