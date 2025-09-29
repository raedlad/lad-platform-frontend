"use client";

import { SupplierPersonalInfo } from "@/features/profile/components/supplier";
import { useTranslations } from "next-intl";

const ProfileEditPage = () => {
  const t = useTranslations();

  return (
    <div className="lg:min-h-[calc(100vh-25vh)] flex items-center justify-center">


      {/* Personal Info Component */}
      <SupplierPersonalInfo />
    </div>
  );
};

export default ProfileEditPage;
