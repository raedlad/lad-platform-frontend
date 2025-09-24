// "use client";

// import React from "react";
// import AvatarUpload from "@/features/profile/components/common/AvatarUpload";
// import {
//   User,
//   FileText,
//   Shield,
//   Settings,
//   Briefcase,
//   ArrowRight,
// } from "lucide-react";
// import Link from "next/link";
// import { useAuthStore } from "@/features/auth/store";
// import { useTranslations } from "next-intl";

// interface User {
//   full_name?: string;
//   firstName?: string;
//   lastName?: string;
//   first_name?: string;
//   last_name?: string;
//   name?: string;
//   phone?: string;
//   phoneNumber?: string;
//   phone_number?: string;
// }
// // Helper function to get user display name
// const getUserDisplayName = (user: User) => {
//   if (user?.full_name) return user.full_name;
//   if (user?.firstName && user?.lastName)
//     return `${user.firstName} ${user.lastName}`;
//   if (user?.first_name && user?.last_name)
//     return `${user.first_name} ${user.last_name}`;
//   if (user?.name) return user.name;
//   return "المستخدم";
// };

// // Helper function to get user phone
// const getUserPhone = (user: User) => {
//   return user?.phone || user?.phoneNumber || user?.phone_number || "";
// };

// // Progress bar component
// const ProgressBar = ({ percentage }: { percentage: number }) => (
//   <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//     <div
//       className="bg-green-500 h-2 rounded-full transition-all duration-300"
//       style={{ width: `${percentage}%` }}
//     />
//   </div>
// );

// export default function Page() {
//   const t = useTranslations("profile");
//   const { user } = useAuthStore();

//   // Navigation items with translations
//   const navigationItems = [
//     {
//       title: t("contractorMenu.personalInfo.title"),
//       description: t("contractorMenu.personalInfo.description"),
//       icon: User,
//       url: "/dashboard/contractor/profile/personal-info",
//       type: "link",
//     },
//     {
//       title: t("contractorMenu.documents.title"),
//       description: t("contractorMenu.documents.description"),
//       icon: FileText,
//       url: "/dashboard/contractor/profile/documents",
//       type: "link",
//     },
//     {
//       title: t("contractorMenu.operational.title"),
//       description: t("contractorMenu.operational.description"),
//       icon: Briefcase,
//       url: "/dashboard/contractor/profile/operational",
//       type: "link",
//     },
//     {
//       title: t("contractorMenu.security.title"),
//       description: t("contractorMenu.security.description"),
//       icon: Shield,
//       url: "/dashboard/contractor/profile/security",
//       type: "link",
//     },
//     {
//       title: t("contractorMenu.settings.title"),
//       description: t("contractorMenu.settings.description"),
//       icon: Settings,
//       url: "/dashboard/contractor/profile/settings",
//       type: "link",
//     },
//   ];

//   return (
//     <div className="w-full h-full py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
//       <div className="max-w-2xl mx-auto border border-border rounded-xl mt-20">
//         {/* Profile Header Card */}
//         <div className="relative">
//           <div className="flex flex-col items-center text-center">
//             {/* Avatar Section */}
//             <div className="absolute inset-0 -top-16">
//               <div className="mb-4 relative">
//                 <AvatarUpload />
//               </div>
//             </div>

//             {/* User Info Section */}
//             <div className="mt-20">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">
//                 {getUserDisplayName(user as User)}
//               </h1>
//               <p className="text-sm sm:text-base text-muted-foreground mb-2">
//                 {getUserPhone(user as User)}
//               </p>

//               {/* Progress Section */}
//               <div className="mb-4">
//                 <ProgressBar percentage={85} />
//                 <p className="text-sm text-muted-foreground">
//                   {t("completion.text", { percentage: 85 })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Section */}
//         <div className="space-y-1.5">
//           {navigationItems.map((item) => {
//             const baseClasses = `group rounded-xl p-4 text-right hover:border-primary/50 hover:shadow-md transition-all duration-200 block`;

//             // Default link rendering
//             return (
//               <Link
//                 key={item.title}
//                 href={item.url || "#"}
//                 className={baseClasses}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 rounded-lg flex-shrink-0 bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                         <item.icon className="w-5 h-5 text-primary" />
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <h3 className="font-semibold text-base text-foreground">
//                         {item.title}
//                       </h3>
//                       <p className="text-xs text-muted-foreground leading-relaxed">
//                         {item.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center">
//                     <ArrowRight className="w-4 h-4 text-muted-foreground transform rtl:rotate-180" />
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function ProfilePage() {
  return <div>profile page</div>;
}