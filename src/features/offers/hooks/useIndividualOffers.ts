import { useIndividualOffersStore } from "../store/individualOffersStore";
import { useEffect, useCallback } from "react";
import { OwnerOffersAllQueryParams } from "../services";

export const useIndividualOffers = (
  projectId?: string | number,
  autoFetch = true,
  fetchStats = false
) => {
  const store = useIndividualOffersStore();
  const {
    offers,
    projectOffers,
    currentOffer,
    stats,
    isLoading,
    isSubmitting,
    error,
    pagination,
    queryParams,
    fetchAllOffers,
    fetchProjectOffers,
    fetchOfferDetails,
    fetchOffer,
    fetchStats: fetchStatsAction,
    acceptOffer,
    rejectOffer,
    markAsViewed,
    requestCounterOffer,
    setQueryParams,
    reset,
  } = store;

  // Auto-fetch offers when component mounts
  useEffect(() => {
    if (autoFetch) {
      if (projectId) {
        fetchProjectOffers(projectId);
      } else {
        fetchAllOffers();
      }
      
      if (fetchStats) {
        fetchStatsAction();
      }
    }
    
    return () => {
      // Reset on unmount if needed
    };
  }, []);

  // Wrapper for fetching all offers with query params
  const fetchWithParams = useCallback(
    (params?: OwnerOffersAllQueryParams) => {
      setQueryParams(params || {});
      return fetchAllOffers(params);
    },
    [setQueryParams, fetchAllOffers]
  );

  return {
    // Data
    offers: projectId ? projectOffers : offers,
    currentOffer,
    stats,
    
    // UI State
    isLoading,
    isSubmitting,
    error,
    
    // Pagination
    pagination,
    
    // Actions
    fetchAllOffers: fetchWithParams,
    fetchProjectOffers,
    fetchOfferDetails,
    fetchOffer,
    fetchStats: fetchStatsAction,
    acceptOffer,
    rejectOffer,
    markAsViewed,
    requestCounterOffer,
    reset,
  };
};
