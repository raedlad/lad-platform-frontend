"use client";

import { useState } from "react";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileNavigation } from "@/features/profile/components/ProfileNavigation";
import { ProfileOverview } from "@/features/profile/components/sections/ProfileOverview";
import { ProfilePersonalInfo } from "@/features/profile/components/sections/ProfilePersonalInfo";
import { ProfileDocuments } from "@/features/profile/components/sections/ProfileDocuments";
import { ProfileProfessionalInfo } from "@/features/profile/components/sections/ProfileProfessionalInfo";
import { ProfileTechnicalInfo } from "@/features/profile/components/sections/ProfileTechnicalInfo";
import { ProfileSecurity } from "@/features/profile/components/sections/ProfileSecurity";
import { ProfileSettings } from "@/features/profile/components/sections/ProfileSettings";
import { useSearchParams } from "next/navigation";

export type ProfileTab =
  | "overview"
  | "personal"
  | "documents"
  | "professional"
  | "technical"
  | "security"
  | "settings";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as ProfileTab) || "overview";
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview />;
      case "personal":
        return <ProfilePersonalInfo />;
      case "documents":
        return <ProfileDocuments />;
      case "professional":
        return <ProfileProfessionalInfo />;
      case "technical":
        return <ProfileTechnicalInfo />;
      case "security":
        return <ProfileSecurity />;
      case "settings":
        return <ProfileSettings />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader />

      {/* Content with Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <ProfileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
}
