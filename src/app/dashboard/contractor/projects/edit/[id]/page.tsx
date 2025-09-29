"use client";
import React from "react";
import ContractorEditAchievedProjectsForm from "@/features/profile/components/contractor/ContractorEditAchievedProjectsForm";
import { useAchievedProjectsStore } from "@/features/profile/store/achievedProjectsStore";
import { useRouter } from "next/navigation";

interface ProjectEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProjectEditPage: React.FC<ProjectEditPageProps> = ({ params }) => {
  const resolvedParams = React.use(params);
  const projectId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { currentProject, fetchProject } = useAchievedProjectsStore();

  React.useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  if (isNaN(projectId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Invalid Project ID
            </h1>
            <p className="text-muted-foreground">
              The project ID provided is not valid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSuccess = (project: any) => {
    router.push(`/dashboard/contractor/projects/${project.id}`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/contractor/projects/${projectId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ContractorEditAchievedProjectsForm
        project={currentProject}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProjectEditPage;
