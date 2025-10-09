/**
 * Workflow Navigation Utilities
 * Determines the correct route based on current workflow stage
 */

import { WorkflowStage } from "../types/workflow";
import { determineCurrentStage } from "./workflowUtils";

export interface NavigationParams {
  projectId: string | number;
  projectStatus: string;
  hasOffers?: boolean;
  offerAccepted?: boolean;
  hasContract?: boolean;
  contractStatus?: string;
  userRole: "owner" | "contractor";
  offerId?: string | number;
  contractId?: string | number;
}

export interface StageRoute {
  path: string;
  action: string; // What the user should do at this stage
}

/**
 * Get the appropriate route for a given workflow stage
 */
export const getStageRoute = (
  stage: WorkflowStage,
  params: NavigationParams
): StageRoute => {
  const { projectId, userRole, offerId, contractId } = params;
  const baseOwner = `/dashboard/individual`;
  const baseContractor = `/dashboard/contractor`;
  const base = userRole === "owner" ? baseOwner : baseContractor;

  switch (stage) {
    case "project_creation":
      // Still in draft/creation - go to edit
      return {
        path: `${base}/projects/${projectId}/edit`,
        action: "complete_project_setup",
      };

    case "awaiting_offers":
      // Published, waiting for offers - go to offers list for this project
      return {
        path: `${base}/projects/${projectId}/offers`,
        action: "view_incoming_offers",
      };

    case "offer_review":
      // Has offers to review - go to offers list
      return {
        path: `${base}/projects/${projectId}/offers`,
        action: "review_offers",
      };

    case "contract_negotiation":
      // Offer accepted, negotiating contract
      if (contractId) {
        return {
          path: `${base}/contracts/${contractId}`,
          action: "negotiate_contract",
        };
      }
      // If no contract ID yet, go to offers to see accepted offer
      return {
        path: `${base}/projects/${projectId}/offers`,
        action: "awaiting_contract_draft",
      };

    case "contract_signing":
      // Contract ready for signing
      if (contractId) {
        return {
          path: `${base}/contracts/${contractId}`,
          action: "sign_contract",
        };
      }
      return {
        path: `${base}/projects/${projectId}`,
        action: "view_contract",
      };

    case "project_execution":
      // Project is in progress - go to project execution view
      return {
        path: `${base}/projects/${projectId}/execution`,
        action: "monitor_progress",
      };

    case "project_completion":
      // Project completed - go to completion/review
      return {
        path: `${base}/projects/${projectId}/completion`,
        action: "final_review",
      };

    case "project_closed":
      // Project closed - go to project details (read-only)
      return {
        path: `${base}/projects/${projectId}`,
        action: "view_details",
      };

    default:
      // Fallback to project details
      return {
        path: `${base}/projects/${projectId}`,
        action: "view_details",
      };
  }
};

/**
 * Get the appropriate route based on project data
 * This is the main function to use for navigation
 */
export const getWorkflowRoute = (params: NavigationParams): StageRoute => {
  const currentStage = determineCurrentStage({
    projectStatus: params.projectStatus,
    hasOffers: params.hasOffers,
    offerAccepted: params.offerAccepted,
    hasContract: params.hasContract,
    contractStatus: params.contractStatus,
  });

  return getStageRoute(currentStage, params);
};

/**
 * Get fallback routes if stage-specific route doesn't exist
 */
export const getFallbackRoute = (params: NavigationParams): string => {
  const { projectId, userRole } = params;
  const base = userRole === "owner" ? "/dashboard/individual" : "/dashboard/contractor";
  return `${base}/projects/${projectId}`;
};

/**
 * Check if a route exists (you can implement actual route checking logic)
 */
export const routeExists = (path: string): boolean => {
  // In a real implementation, you might check against your route manifest
  // For now, we'll assume routes exist
  return true;
};

/**
 * Navigate with fallback
 * Use with Next.js router
 */
export const navigateToStage = (
  router: { push: (path: string) => void },
  params: NavigationParams
): void => {
  const stageRoute = getWorkflowRoute(params);
  
  if (routeExists(stageRoute.path)) {
    router.push(stageRoute.path);
  } else {
    // Fallback to basic project view
    router.push(getFallbackRoute(params));
  }
};

/**
 * Get action button text based on stage
 */
export const getStageActionText = (
  stage: WorkflowStage,
  locale: "en" | "ar" = "en"
): string => {
  const texts: Record<WorkflowStage, { en: string; ar: string }> = {
    project_creation: {
      en: "Complete Setup",
      ar: "إكمال الإعداد",
    },
    awaiting_offers: {
      en: "View Offers",
      ar: "عرض العروض",
    },
    offer_review: {
      en: "Review Offers",
      ar: "مراجعة العروض",
    },
    contract_negotiation: {
      en: "View Contract",
      ar: "عرض العقد",
    },
    contract_signing: {
      en: "Sign Contract",
      ar: "توقيع العقد",
    },
    project_execution: {
      en: "Monitor Progress",
      ar: "متابعة التقدم",
    },
    project_completion: {
      en: "Final Review",
      ar: "المراجعة النهائية",
    },
    project_closed: {
      en: "View Details",
      ar: "عرض التفاصيل",
    },
  };

  return texts[stage][locale];
};
