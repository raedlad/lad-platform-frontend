/**
 * useOfferWorkflow Hook
 * Specialized hook for accepting offers with workflow integration
 */

import { useState, useCallback } from "react";
import { offersWorkflowAdapter } from "../adapters/offersWorkflowAdapter";
import { toast } from "sonner";

interface UseOfferWorkflowOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useOfferWorkflow = (options: UseOfferWorkflowOptions = {}) => {
  const { onSuccess, onError } = options;
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Accept offer with automatic workflow transition
   */
  const acceptOfferWithWorkflow = useCallback(
    async (projectId: string, offerId: string, userId: string) => {
      setIsAccepting(true);
      setError(null);

      try {
        const result = await offersWorkflowAdapter.acceptOfferWithWorkflow(
          projectId,
          offerId,
          userId
        );

        if (result.offerAccepted && result.workflowTransition.success) {
          toast.success(
            result.workflowTransition.message ||
              "Offer accepted and workflow updated"
          );
          onSuccess?.();
          return result;
        } else {
          throw new Error("Failed to complete workflow transition");
        }
      } catch (err: any) {
        const errorMsg = err.message || "Failed to accept offer";
        setError(errorMsg);
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw err;
      } finally {
        setIsAccepting(false);
      }
    },
    [onSuccess, onError]
  );

  /**
   * Check if offer can be accepted
   */
  const canAcceptOffer = useCallback(
    async (projectId: string, offerId: string) => {
      try {
        return await offersWorkflowAdapter.canAcceptOffer(projectId, offerId);
      } catch (err: any) {
        console.error("Error checking if offer can be accepted:", err);
        return false;
      }
    },
    []
  );

  /**
   * Get validation for offer acceptance
   */
  const getAcceptanceValidation = useCallback(async (projectId: string) => {
    try {
      return await offersWorkflowAdapter.getOfferAcceptanceValidation(
        projectId
      );
    } catch (err: any) {
      return {
        canAccept: false,
        errors: [err.message || "Validation failed"],
      };
    }
  }, []);

  return {
    acceptOfferWithWorkflow,
    canAcceptOffer,
    getAcceptanceValidation,
    isAccepting,
    error,
    setError,
  };
};
