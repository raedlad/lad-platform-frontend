"use client";

import EngineeringOfficeProfessionalInfo from "@/features/profile/components/engineering_office/EngineeringOfficeProfessionalInfo";
import { useTranslations } from "next-intl";

const ProfileEditPage = () => {
  const t = useTranslations();

  return (
    <div className="lg:min-h-[calc(100vh-25vh)] flex items-center justify-center">
      {/* Personal Info Component */}
      <EngineeringOfficeProfessionalInfo />
    </div>
  );
};

export default ProfileEditPage;
