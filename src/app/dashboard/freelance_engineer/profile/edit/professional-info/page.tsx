"use client";

import FreelanceEngineerProfessionalInfo from "@/features/profile/components/freelance_engineer/FreelanceEngineerProfessionalInfo";
import { useTranslations } from "next-intl";

const ProfileEditPage = () => {
  const t = useTranslations();

  return (
    <div className="lg:min-h-[calc(100vh-25vh)] flex items-center justify-center">
      {/* Personal Info Component */}
      <FreelanceEngineerProfessionalInfo />
    </div>
  );
};

export default ProfileEditPage;
