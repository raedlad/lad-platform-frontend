"use client";

import { OrganizationPersonalInfo } from "@/features/profile/components/organization";
import { useTranslations } from "next-intl";

const ProfileEditPage = () => {
  const t = useTranslations();

  return (
    <div className="lg:min-h-[calc(100vh-25vh)] flex items-center justify-center">


      {/* Personal Info Component */}
      <OrganizationPersonalInfo />
    </div>
  );
};

export default ProfileEditPage;
