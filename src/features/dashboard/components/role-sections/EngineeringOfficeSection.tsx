"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  Briefcase,
  Users,
  PenTool,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Eye,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface DesignProject {
  id: string;
  title: string;
  clientName: string;
  type: "architectural" | "structural" | "electrical" | "mechanical";
  status: "in_review" | "in_progress" | "completed" | "on_hold";
  progress: number;
  dueDate: string;
  assignedTeam: string[];
  priority: "low" | "medium" | "high" | "urgent";
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  utilization: number;
  currentProjects: number;
  avatar?: string;
}

interface EngineeringOfficeSectionProps {
  designProjects: DesignProject[];
  teamMembers: TeamMember[];
  className?: string;
  onViewProject?: (projectId: string) => void;
  onViewTeam?: () => void;
  onViewAllProjects?: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ar-SA", {
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "in_review":
      return "bg-yellow-100 text-yellow-800";
    case "on_hold":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "architectural":
      return <PenTool className="h-4 w-4" />;
    case "structural":
      return <Briefcase className="h-4 w-4" />;
    case "electrical":
      return <CheckCircle className="h-4 w-4" />;
    case "mechanical":
      return <Clock className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function DesignProjectCard({ project }: { project: DesignProject }) {
  const statusColor = getStatusColor(project.status);
  const priorityColor = getPriorityColor(project.priority);
  const TypeIcon = getTypeIcon(project.type);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-blue-600";
    if (progress >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {TypeIcon}
              <h4 className="font-medium text-sm line-clamp-1">
                {project.title}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Client: {project.clientName}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant="secondary" className={statusColor}>
              {project.status.replace("_", " ")}
            </Badge>
            {project.priority !== "low" && (
              <Badge variant="outline" className={cn("text-xs", priorityColor)}>
                {project.priority}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span
                className={cn(
                  "font-medium",
                  getProgressColor(project.progress)
                )}
              >
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Due: {formatDate(project.dueDate)}</span>
            <span>{project.assignedTeam.length} team members</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 70) return "text-orange-600";
    if (utilization >= 50) return "text-blue-600";
    return "text-green-600";
  };

  const userInitials = member.name
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-blue-600">
              {userInitials}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{member.name}</h4>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Utilization</span>
            <span
              className={cn(
                "font-medium",
                getUtilizationColor(member.utilization)
              )}
            >
              {member.utilization}%
            </span>
          </div>
          <Progress value={member.utilization} className="h-1" />
          <div className="text-xs text-muted-foreground">
            {member.currentProjects} active projects
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock data
const mockDesignProjects: DesignProject[] = [
  {
    id: "1",
    title: "Residential Complex Design",
    clientName: "Golden Tower Development",
    type: "architectural",
    status: "in_progress",
    progress: 65,
    dueDate: "2024-12-25T00:00:00Z",
    assignedTeam: ["arch1", "arch2", "struct1"],
    priority: "high",
  },
  {
    id: "2",
    title: "Office Building Structural Plan",
    clientName: "Modern Business Center",
    type: "structural",
    status: "in_review",
    progress: 90,
    dueDate: "2024-12-15T00:00:00Z",
    assignedTeam: ["struct1", "struct2"],
    priority: "urgent",
  },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "arch1",
    name: "Sarah Ahmad",
    role: "Senior Architect",
    utilization: 85,
    currentProjects: 3,
  },
  {
    id: "struct1",
    name: "Mohamed Ali",
    role: "Structural Engineer",
    utilization: 72,
    currentProjects: 2,
  },
  {
    id: "elect1",
    name: "Fatima Hassan",
    role: "Electrical Engineer",
    utilization: 45,
    currentProjects: 1,
  },
];

export function EngineeringOfficeSection({
  designProjects = mockDesignProjects,
  teamMembers = mockTeamMembers,
  className,
  onViewProject,
  onViewTeam,
  onViewAllProjects,
}: EngineeringOfficeSectionProps) {
  const projectsUnderReview = designProjects.filter(
    (p) => p.status === "in_review"
  );
  const urgentProjects = designProjects.filter((p) => p.priority === "urgent");
  const averageUtilization = Math.round(
    teamMembers.reduce((sum, member) => sum + member.utilization, 0) /
      teamMembers.length
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Active Projects</h3>
                <p className="text-lg font-bold text-blue-600">
                  {designProjects.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Team Utilization</h3>
                <p className="text-lg font-bold text-green-600">
                  {averageUtilization}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Under Review</h3>
                <p className="text-lg font-bold text-yellow-600">
                  {projectsUnderReview.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PenTool className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Designs Completed</h3>
                <p className="text-lg font-bold text-purple-600">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Projects Alert */}
      {urgentProjects.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg text-red-900">
                Urgent Projects Require Attention
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:shadow-sm"
                  onClick={() => onViewProject?.(project.id)}
                >
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">
                      {project.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Due: {formatDate(project.dueDate)} • {project.progress}%
                      complete
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 border-red-300"
                  >
                    Urgent
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Design Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Design Projects</CardTitle>
              <Button variant="outline" size="sm" onClick={onViewAllProjects}>
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {designProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No Active Projects</h3>
                  <p className="text-sm">
                    New design projects will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {designProjects.slice(0, 3).map((project) => (
                    <DesignProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Team Overview */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Team Overview</CardTitle>
              <Button variant="outline" size="sm" onClick={onViewTeam}>
                <Users className="h-4 w-4 mr-1" />
                View Team
              </Button>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No team members</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.slice(0, 4).map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
