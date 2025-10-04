"use client";
import React, { useState } from "react";
import NavigationButtons from "@/features/project/components/common/NavigationButtons";
import ProjectOverview from "@/features/project/components/common/ProjectOverview";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import { useProjectStore } from "@/features/project/store/projectStore";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
const ProjectOverviewForm = () => {
  const { submitSendProjectToReview } = useCreateProject();
  const [isLoading, setIsLoading] = useState(false);
  const { projectStatus, completedSteps } = useProjectStore();
  const t = useTranslations("");
  const router = useRouter();
  const onSubmit = async () => {
    try {
      if (projectStatus.status !== "draft" && completedSteps !== 6) return;
      setIsLoading(true);
      const response = await submitSendProjectToReview();
      if (response.success) {
        toast.success(t("project.step6.success"));
        router.push("/dashboard/individual/projects");
      } else {
        toast.error(t("project.step6.error"));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("❌ Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <ProjectOverview />
      <NavigationButtons onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ProjectOverviewForm;
