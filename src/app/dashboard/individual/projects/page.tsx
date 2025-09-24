"use client";

import React, { useEffect, useState } from "react";
import { useProjectData } from "@/features/project/hooks/useProjectData";
import { Project } from "@/features/project/types/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Square,
  FileText,
  Settings,
  Package,
} from "lucide-react";
import Link from "next/link";

const ProjectsPage = () => {
  const { getMockProjects } = useProjectData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const loadProjects = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allProjects = getMockProjects();
      setProjects(allProjects);
      setLoading(false);
    };

    loadProjects();
  }, [getMockProjects]);

  const getProjectTypeName = (typeId: number) => {
    const types = {
      1: "Residential Building",
      2: "Commercial Building",
      3: "Industrial Building",
      4: "Infrastructure",
    };
    return types[typeId as keyof typeof types] || "Unknown";
  };

  const getCompletionStatus = (project: Project) => {
    let stepsCompleted = 0;
    const totalSteps = 5;

    // Check Essential Info completion
    if (project.essential_info.name && project.essential_info.type > 0) {
      stepsCompleted++;
    }

    // Check Classification completion
    if (
      project.classification.jobId > 0 &&
      project.classification.workTypeId > 0 &&
      project.classification.levelId > 0
    ) {
      stepsCompleted++;
    }

    // Check Documents completion
    const hasDocuments =
      project.documents.architectural_plans.length > 0 ||
      project.documents.licenses.length > 0 ||
      project.documents.specifications.length > 0 ||
      project.documents.site_photos.length > 0;
    if (hasDocuments) {
      stepsCompleted++;
    }

    // Check BOQ completion
    if (project.boq.items.length > 0) {
      stepsCompleted++;
    }

    // Check Publish Settings completion
    if (project.publish_settings.offers_window_days > 0) {
      stepsCompleted++;
    }

    return {
      completed: stepsCompleted,
      total: totalSteps,
      percentage: Math.round((stepsCompleted / totalSteps) * 100),
    };
  };

  const getStatusBadge = (project: Project) => {
    const status = getCompletionStatus(project);

    if (status.completed === 0) {
      return <Badge variant="secondary">Not Started</Badge>;
    } else if (status.completed === status.total) {
      return (
        <Badge variant="default" className="bg-green-600">
          Completed
        </Badge>
      );
    } else {
      return <Badge variant="outline">In Progress</Badge>;
    }
  };

  const getNextStep = (project: Project) => {
    const status = getCompletionStatus(project);

    if (status.completed === 0) return "Essential Information";
    if (status.completed === 1) return "Classification";
    if (status.completed === 2) return "Documents";
    if (status.completed === 3) return "BOQ";
    if (status.completed === 4) return "Publish Settings";
    return "Completed";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
        <p className="text-gray-600">
          Manage and track your construction projects
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const status = getCompletionStatus(project);
          const nextStep = getNextStep(project);

          return (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {project.essential_info.name}
                  </CardTitle>
                  {getStatusBadge(project)}
                </div>
                <CardDescription className="text-sm text-gray-600">
                  {getProjectTypeName(project.essential_info.type)}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Project Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {project.essential_info.city},{" "}
                      {project.essential_info.district}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>
                      {project.essential_info.budget.toLocaleString()}{" "}
                      {project.essential_info.budget_unit}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {project.essential_info.duration}{" "}
                      {project.essential_info.duration_unit}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Square className="h-4 w-4 mr-2" />
                    <span>
                      {project.essential_info.area_sqm.toLocaleString()} m²
                    </span>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">
                      {status.completed}/{status.total} steps
                    </span>
                  </div>
                  <Progress value={status.percentage} className="h-2" />
                  <p className="text-xs text-gray-500">Next: {nextStep}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/dashboard/individual/projects/${project.id}/edit`}
                  >
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>

                  <Link href={`/dashboard/individual/projects/${project.id}`}>
                    <Button variant="default" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first project
          </p>
          <Link href="/dashboard/individual/projects/new">
            <Button>Create New Project</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
