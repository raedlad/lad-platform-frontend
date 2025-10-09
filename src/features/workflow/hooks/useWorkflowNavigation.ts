/**
 * useWorkflowNavigation Hook
 * Provides workflow-aware navigation functionality
 */

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useMemo } from "react";
import { getWorkflowRoute, getStageActionText, NavigationParams } from "../utils/workflowNavigation";
import { useWorkflowStage } from "./useWorkflowStage";

export interface UseWorkflowNavigationParams {
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

export interface UseWorkflowNavigationReturn {
  navigateToCurrentStage: () => void;
  stageRoute: {
    path: string;
    action: string;
  };
  actionButtonText: string;
  canNavigate: boolean;
}

/**
 * Hook for workflow-aware navigation
 * @param params - Navigation parameters including project data and user role
 * @returns Navigation functions and route information
 */
export const useWorkflowNavigation = (
  params: UseWorkflowNavigationParams
): UseWorkflowNavigationReturn => {
  const router = useRouter();
  const locale = useLocale() as "en" | "ar";

  // Get current stage information
  const { currentStage } = useWorkflowStage({
    projectStatus: params.projectStatus,
    hasOffers: params.hasOffers,
    offerAccepted: params.offerAccepted,
    hasContract: params.hasContract,
    contractStatus: params.contractStatus,
    userRole: params.userRole,
  });

  // Get the appropriate route for the current stage
  const stageRoute = useMemo(() => {
    return getWorkflowRoute(params);
  }, [
    params.projectId,
    params.projectStatus,
    params.hasOffers,
    params.offerAccepted,
    params.hasContract,
    params.contractStatus,
    params.userRole,
    params.offerId,
    params.contractId,
  ]);

  // Get localized action button text
  const actionButtonText = useMemo(() => {
    return getStageActionText(currentStage, locale);
  }, [currentStage, locale]);

  // Navigation function
  const navigateToCurrentStage = useCallback(() => {
    router.push(stageRoute.path);
  }, [router, stageRoute.path]);

  // Check if navigation is available
  const canNavigate = useMemo(() => {
    return !!stageRoute.path;
  }, [stageRoute.path]);

  return {
    navigateToCurrentStage,
    stageRoute,
    actionButtonText,
    canNavigate,
  };
};
