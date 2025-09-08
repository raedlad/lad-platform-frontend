"use client";
import {
  FreelanceEngineerPersonalInfo,
} from "@/features/profile/components/freelance-engineer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const PersonalInfoPage = () => {
  const t = useTranslations();

  return (
    <div className="section ">
      <div className="container-centered">
        {/* Header */}
        <Link href="/dashboard/freelance-engineer/profile">
          <ArrowLeft className="w-4 h-4 " />
        </Link>
        <div className="header-centered-padded">
          <h1 className="heading-section text-foreground mb-2">
            {t("profile.freelance-engineer.personalInfo.title")}
          </h1>
          <p className="text-description">
            {t("profile.freelance-engineer.personalInfo.description")}
          </p>
        </div>

        {/* Personal Info Component */}
        <FreelanceEngineerPersonalInfo />
      </div>
    </div>
  );
};

export default PersonalInfoPage;
