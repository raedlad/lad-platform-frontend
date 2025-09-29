"use client";

import SupplierProfessionalInfo from "@/features/profile/components/supplier/SupplierProfessionalInfo";
import { useTranslations } from "next-intl";

const ProfileEditPage = () => {
  const t = useTranslations();

  return (
    <div className="lg:min-h-[calc(100vh-25vh)] flex items-center justify-center">
      {/* Personal Info Component */}
      <SupplierProfessionalInfo />
    </div>
  );
};

export default ProfileEditPage;
