"use client";
import CreateProject from "@/features/project/components/client/CreateProject";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { projectApi } from "@/features/project/services/projectApi";
import {
  ProjectResponse,
  GetProjectApiResponse,
} from "@/features/project/types/project";

const Page = () => {
  const projectId = useParams().id as string;
  const [projectData, setProjectData] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);
        const response: GetProjectApiResponse = await projectApi.getProject(
          projectId
        );

        if (response.success && response.response) {
          setProjectData(response.response);
        } else {
          setError(response.message || "Failed to fetch project");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("An error occurred while fetching the project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="section">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-destructive mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Error Loading Project
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <CreateProject projectId={projectId} />
    </div>
  );
};

export default Page;
