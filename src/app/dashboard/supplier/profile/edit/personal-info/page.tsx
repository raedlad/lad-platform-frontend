"use client";

import { FreelanceEngineerPersonalInfo } from "@/features/profile/components/freelance_engineer";
import { useTranslations } from "next-intl";

const ProfileEditPage = () => {
  const t = useTranslations();

  return (
    <div className="lg:min-h-[calc(100vh-25vh)] flex items-center justify-center">


      {/* Personal Info Component */}
      <FreelanceEngineerPersonalInfo />
    </div>
  );
};

export default ProfileEditPage;
