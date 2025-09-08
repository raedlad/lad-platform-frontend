export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  location: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    startDate: string;
    endDate: string;
    duration: number;
  };
  requiredSkills: string[];
  clientId: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
  isUrgent?: boolean;
  attachments?: ProjectAttachment[];
  progress?: ProjectProgress;
}

export type ProjectStatus =
  | "draft"
  | "published"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "on_hold";

export type ProjectCategory =
  | "construction"
  | "engineering"
  | "design"
  | "consultation"
  | "maintenance"
  | "other";

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ProjectProgress {
  percentage: number;
  currentPhase: string;
  completedTasks: number;
  totalTasks: number;
  milestones: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  completionDate?: string;
}
