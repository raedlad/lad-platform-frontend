// "use client";

// import React from "react";
// import { useContractorOffersStore } from "../../store/contractorOffersStore";
// import { useIndividualOffers } from "../../hooks/useIndividualOffers";
// import { usePathname } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/shared/components/ui/card";
// import {
//   DollarSign,
//   FileText,
//   CheckCircle,
//   XCircle,
//   Clock,
//   TrendingUp,
// } from "lucide-react";

// export const OfferStats = () => {
//   const pathname = usePathname();
//   const isContractor = pathname.includes("/contractor/");
//   const isIndividual = pathname.includes("/individual/");

//   // Read contractor stats directly from store to avoid double fetching
//   const contractorStats = useContractorOffersStore((s) => s.stats);
//   const individualStats = useIndividualOffers().stats;

//   const stats = isContractor ? contractorStats : individualStats;

//   if (!stats) {
//     return (
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {[...Array(4)].map((_, i) => (
//           <Card key={i}>
//             <CardHeader className="pb-2">
//               <div className="animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="animate-pulse">
//                 <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   const statsData = isContractor
//     ? [
//         {
//           title: "Total Submitted",
//           value: stats.totalSubmitted || 0,
//           icon: FileText,
//           color: "text-blue-600",
//           bgColor: "bg-blue-100",
//         },
//         {
//           title: "Pending",
//           value: stats.pending || 0,
//           icon: Clock,
//           color: "text-yellow-600",
//           bgColor: "bg-yellow-100",
//         },
//         {
//           title: "Accepted",
//           value: stats.accepted || 0,
//           icon: CheckCircle,
//           color: "text-green-600",
//           bgColor: "bg-green-100",
//         },
//         {
//           title: "Success Rate",
//           value: `${Math.round(stats.successRate || 0)}%`,
//           icon: TrendingUp,
//           color: "text-purple-600",
//           bgColor: "bg-purple-100",
//         },
//       ]
//     : [
//         {
//           title: "Total Received",
//           value: stats.totalReceived || 0,
//           icon: FileText,
//           color: "text-blue-600",
//           bgColor: "bg-blue-100",
//         },
//         {
//           title: "Pending",
//           value: stats.pending || 0,
//           icon: Clock,
//           color: "text-yellow-600",
//           bgColor: "bg-yellow-100",
//         },
//         {
//           title: "Accepted",
//           value: stats.accepted || 0,
//           icon: CheckCircle,
//           color: "text-green-600",
//           bgColor: "bg-green-100",
//         },
//         {
//           title: "Average Value",
//           value: `$${Math.round(
//             stats.averageOfferValue || 0
//           ).toLocaleString()}`,
//           icon: DollarSign,
//           color: "text-purple-600",
//           bgColor: "bg-purple-100",
//         },
//       ];

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {statsData.map((stat, index) => {
//         const Icon = stat.icon;
//         return (
//           <Card key={index}>
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-sm font-medium text-gray-600">
//                   {stat.title}
//                 </CardTitle>
//                 <div className={`p-2 rounded-full ${stat.bgColor}`}>
//                   <Icon className={`h-4 w-4 ${stat.color}`} />
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-900">
//                 {stat.value}
//               </div>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

import React from "react";

const OfferStats = () => {
  return <div></div>;
};

export default OfferStats;
