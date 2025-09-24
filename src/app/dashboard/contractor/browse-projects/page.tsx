// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";
// import { useContractorOffers } from "@/features/offers/hooks/useContractorOffers";
// import { Button } from "@/shared/components/ui/button";
// import { Badge } from "@/shared/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/shared/components/ui/card";
// import {
//   MapPin,
//   Clock,
//   DollarSign,
//   Calendar,
//   Users,
//   ArrowRight,
//   RefreshCw,
//   FileText,
// } from "lucide-react";

// const BrowseProjectsPage = () => {
//   const t = useTranslations();
//   const router = useRouter();
//   const { availableProjects, fetchAvailableProjects, isLoading, error } =
//     useContractorOffers();

//   React.useEffect(() => {
//     fetchAvailableProjects();
//   }, [fetchAvailableProjects]);

//   const handleSubmitOffer = (project: any) => {
//     // Navigate to create complete offer page
//     router.push(`/dashboard/contractor/offers/create/${project.id}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-red-500 mb-4">
//           <svg
//             className="mx-auto h-12 w-12"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
//             />
//           </svg>
//         </div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">
//           {t("common.error")}
//         </h3>
//         <p className="text-gray-600 mb-4">{error}</p>
//         <Button onClick={() => window.location.reload()}>
//           <RefreshCw className="h-4 w-4 mr-2" />
//           {t("common.tryAgain")}
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             {t("navigation.browseProjects")}
//           </h1>
//           <p className="text-gray-600">{t("offers.startBrowsingProjects")}</p>
//         </div>
//         <Button
//           onClick={fetchAvailableProjects}
//           variant="outline"
//           disabled={isLoading}
//         >
//           <RefreshCw
//             className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
//           />
//           {t("common.refresh")}
//         </Button>
//       </div>

//       {/* Projects Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {availableProjects.length === 0 ? (
//           <div className="col-span-full text-center py-16">
//             <div className="text-gray-400 mb-6">
//               <svg
//                 className="mx-auto h-16 w-16"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1}
//                   d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                 />
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               {t("offers.noOffers")}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {t("offers.tryDifferentSearch")}
//             </p>
//           </div>
//         ) : (
//           availableProjects.map((project: any, index: number) => (
//             <motion.div
//               key={project.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.1 }}
//               whileHover={{ scale: 1.02 }}
//             >
//               <Card className="group h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-design-main transition-colors">
//                         {project.title}
//                       </CardTitle>
//                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-1">
//                           <MapPin className="h-4 w-4 text-design-main" />
//                           <span className="truncate">
//                             {project.location || t("common.notSpecified")}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-4 w-4 text-design-main" />
//                           <span>
//                             {project.duration || "N/A"} {t("common.days")}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <Badge className="bg-design-main/10 text-design-main border-design-main/20">
//                       {project.type || "General"}
//                     </Badge>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0 flex flex-col h-full">
//                   {/* Description */}
//                   <div className="mb-4 flex-1">
//                     <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
//                       {project.description}
//                     </p>
//                   </div>

//                   {/* Project Details */}
//                   <div className="space-y-3 mb-6">
//                     {/* Budget */}
//                     <div className="p-3 bg-gradient-to-r from-design-main/5 to-design-main/10 rounded-lg border border-design-main/20">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <DollarSign className="h-4 w-4 text-design-main" />
//                           <span className="text-sm text-gray-600">
//                             {t("offers.projectBudget")}
//                           </span>
//                         </div>
//                         <span className="font-bold text-design-main">
//                           {project.budget?.min && project.budget?.max
//                             ? `${project.budget.min} - ${project.budget.max} ${
//                                 project.budget.currency || "SAR"
//                               }`
//                             : t("common.notSpecified")}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Timeline */}
//                     <div className="p-3 bg-gray-50 rounded-lg">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Calendar className="h-4 w-4 text-gray-600" />
//                         <span className="text-sm font-medium text-gray-700">
//                           {t("offers.proposedTimeline")}
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <p className="text-gray-600 text-xs">
//                             {t("offers.startDate")}
//                           </p>
//                           <p className="font-medium text-gray-900">
//                             {project.startDate
//                               ? new Date(project.startDate).toLocaleDateString()
//                               : "TBD"}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-600 text-xs">
//                             {t("offers.endDate")}
//                           </p>
//                           <p className="font-medium text-gray-900">
//                             {project.endDate
//                               ? new Date(project.endDate).toLocaleDateString()
//                               : "TBD"}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Additional Info */}
//                     <div className="flex items-center justify-between text-sm text-gray-600">
//                       <div className="flex items-center gap-4">
//                         <div className="flex items-center gap-1">
//                           <Users className="h-4 w-4" />
//                           <span>
//                             {project.bidders || 0} {t("offers.bidders")}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Clock className="h-4 w-4" />
//                           <span>
//                             {project.deadline
//                               ? `${Math.ceil(
//                                   (new Date(project.deadline).getTime() -
//                                     new Date().getTime()) /
//                                     (1000 * 60 * 60 * 24)
//                                 )} ${t("common.days")} left`
//                               : "No deadline"}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Button */}
//                   <Button
//                     onClick={() => handleSubmitOffer(project)}
//                     className="w-full bg-design-main hover:bg-design-main/90 text-white group/btn"
//                     disabled={!project.budget || project.status === "closed"}
//                   >
//                     {project.status === "closed" ? (
//                       t("offers.closed")
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <FileText className="h-4 w-4" />
//                         Create Complete Offer
//                       </div>
//                     )}
//                     <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
//                   </Button>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default BrowseProjectsPage;

export default function BrowseProjectsPage() {
  return (
    <div>
      <h1>Browse Projects</h1>
    </div>
  );
}