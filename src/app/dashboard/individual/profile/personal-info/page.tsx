// "use client";

// import {
//   IndividualPersonalInfo,
// } from "@/features/profile/components/individual";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useTranslations } from "next-intl";

// const PersonalInfoPage = () => {
//   const t = useTranslations();
  
//   return (
//     <div className="section ">
//       <div className="container-centered">
//         {/* Header */}
//         <Link href="/dashboard/individual/profile">
//           <ArrowLeft className="w-4 h-4 " />
//         </Link>
//         <div className="header-centered-padded">
//           <h1 className="heading-section text-foreground mb-2">
//             {t("profile.individual.personalInfo.title")}
//           </h1>
//           <p className="text-description">
//             {t("profile.individual.personalInfo.description")}
//           </p>
//         </div>

//         {/* Personal Info Component */}
//         <IndividualPersonalInfo />
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoPage;

export default function PersonalInfoPage() {
  return <div>personal info page</div>;
}