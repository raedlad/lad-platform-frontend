/**
 * Project Workflow Stage System
 * Tracks the lifecycle of a project from creation to completion
 */

export type WorkflowStage =
  | "project_creation"
  | "awaiting_offers"
  | "offer_review"
  | "contract_negotiation"
  | "contract_signing"
  | "project_execution"
  | "project_completion"
  | "project_closed";

export interface StageDefinition {
  id: WorkflowStage;
  order: number;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
  allowedRoles: ("owner" | "contractor")[];
  allowedStatuses: string[];
}

export interface WorkflowProgress {
  currentStage: WorkflowStage;
  currentStageOrder: number;
  totalStages: number;
  completedStages: number;
  progressPercentage: number;
  nextStage?: WorkflowStage;
  previousStage?: WorkflowStage;
  isComplete: boolean;
}

export interface StageAction {
  id: string;
  label: string;
  labelAr: string;
  action: () => void;
  variant: "default" | "outline" | "destructive";
  requiredRole?: "owner" | "contractor";
}

/**
 * Stage definitions with metadata
 */
export const WORKFLOW_STAGES: Record<WorkflowStage, StageDefinition> = {
  project_creation: {
    id: "project_creation",
    order: 1,
    label: "Project Creation",
    labelAr: "إنشاء المشروع",
    description: "Project is being created and configured",
    descriptionAr: "جاري إنشاء المشروع وتكوينه",
    icon: "FileText",
    color: "blue",
    allowedRoles: ["owner"],
    allowedStatuses: ["draft", "review_pending"],
  },
  awaiting_offers: {
    id: "awaiting_offers",
    order: 2,
    label: "Awaiting Offers",
    labelAr: "في انتظار العروض",
    description: "Project published, waiting for contractor offers",
    descriptionAr: "تم نشر المشروع، في انتظار عروض المقاولين",
    icon: "Clock",
    color: "orange",
    allowedRoles: ["owner", "contractor"],
    allowedStatuses: ["published", "receiving_bids"],
  },
  offer_review: {
    id: "offer_review",
    order: 3,
    label: "Reviewing Offers",
    labelAr: "مراجعة العروض",
    description: "Owner is reviewing and evaluating contractor offers",
    descriptionAr: "المالك يراجع ويقيم عروض المقاولين",
    icon: "Search",
    color: "purple",
    allowedRoles: ["owner"],
    allowedStatuses: ["receiving_bids", "offer_accepted"],
  },
  contract_negotiation: {
    id: "contract_negotiation",
    order: 4,
    label: "Contract Negotiation",
    labelAr: "التفاوض على العقد",
    description: "Offer accepted, contract terms being negotiated",
    descriptionAr: "تم قبول العرض، جاري التفاوض على شروط العقد",
    icon: "FileSignature",
    color: "yellow",
    allowedRoles: ["owner", "contractor"],
    allowedStatuses: ["offer_accepted", "awaiting_contract_signature"],
  },
  contract_signing: {
    id: "contract_signing",
    order: 5,
    label: "Contract Signing",
    labelAr: "توقيع العقد",
    description: "Contract finalized, awaiting signatures",
    descriptionAr: "تم الانتهاء من العقد، في انتظار التوقيعات",
    icon: "PenTool",
    color: "indigo",
    allowedRoles: ["owner", "contractor"],
    allowedStatuses: ["awaiting_contract_signature"],
  },
  project_execution: {
    id: "project_execution",
    order: 6,
    label: "Project Execution",
    labelAr: "تنفيذ المشروع",
    description: "Contract signed, project work in progress",
    descriptionAr: "تم توقيع العقد، العمل على المشروع قيد التنفيذ",
    icon: "Hammer",
    color: "green",
    allowedRoles: ["owner", "contractor"],
    allowedStatuses: ["contract_signed", "in_progress"],
  },
  project_completion: {
    id: "project_completion",
    order: 7,
    label: "Project Completion",
    labelAr: "إكمال المشروع",
    description: "Project work completed, final review",
    descriptionAr: "تم إكمال العمل على المشروع، المراجعة النهائية",
    icon: "CheckCircle",
    color: "teal",
    allowedRoles: ["owner", "contractor"],
    allowedStatuses: ["completed"],
  },
  project_closed: {
    id: "project_closed",
    order: 8,
    label: "Project Closed",
    labelAr: "تم إغلاق المشروع",
    description: "Project fully completed and closed",
    descriptionAr: "تم إكمال المشروع وإغلاقه بالكامل",
    icon: "Archive",
    color: "gray",
    allowedRoles: ["owner", "contractor"],
    allowedStatuses: ["closed_completed", "cancelled"],
  },
};

/**
 * Get all stages in order
 */
export const getOrderedStages = (): StageDefinition[] => {
  return Object.values(WORKFLOW_STAGES).sort((a, b) => a.order - b.order);
};

/**
 * Get stage by ID
 */
export const getStageById = (stageId: WorkflowStage): StageDefinition | undefined => {
  return WORKFLOW_STAGES[stageId];
};
