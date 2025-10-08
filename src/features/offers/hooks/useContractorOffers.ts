import { useContractorOffersStore } from "../store/contractorOffersStore";
import { useEffect } from "react";
import { ContractorOffersAllQueryParams } from "../types";

export const useContractorOffers = (
  queryParams?: ContractorOffersAllQueryParams,
  fetchStats: boolean = false,
  autoFetch: boolean = true
) => {
  // Select slices individually to avoid returning a new object each render
  const offers = useContractorOffersStore((s) => s.offers);
  const isLoading = useContractorOffersStore((s) => s.isLoading);
  const isSubmitting = useContractorOffersStore((s) => s.isSubmitting);
  const error = useContractorOffersStore((s) => s.error);
  const stats = useContractorOffersStore((s) => s.stats);
  const pagination = useContractorOffersStore((s) => s.pagination);

  // Get stable action references
  const fetchOffers = useContractorOffersStore((s) => s.fetchOffers);
  const fetchAllOffers = useContractorOffersStore((s) => s.fetchAllOffers);
  const fetchOfferDetails = useContractorOffersStore((s) => s.fetchOfferDetails);
  const fetchStatsAction = useContractorOffersStore((s) => s.fetchStats);
  const setFilters = useContractorOffersStore((s) => s.setFilters);
  const setPagination = useContractorOffersStore((s) => s.setPagination);
  const submitCompleteOffer = useContractorOffersStore(
    (s) => s.submitCompleteOffer
  );
  const updateCompleteOffer = useContractorOffersStore(
    (s) => s.updateCompleteOffer
  );
  const withdrawOffer = useContractorOffersStore((s) => s.withdrawOffer);
  const currentOffer = useContractorOffersStore((s) => s.currentOffer);

  useEffect(() => {
    if (autoFetch) {
      fetchAllOffers(queryParams);
    }
    if (fetchStats) {
      fetchStatsAction();
    }
  }, [fetchAllOffers, fetchStatsAction, queryParams, fetchStats, autoFetch]);

  return {
    offers,
    currentOffer,
    isLoading,
    isSubmitting,
    error,
    stats,
    pagination,
    fetchOffers,
    fetchAllOffers,
    fetchOfferDetails,
    fetchStats: fetchStatsAction,
    setFilters,
    setPagination,
    submitCompleteOffer,
    updateCompleteOffer,
    withdrawOffer,
  };
};
