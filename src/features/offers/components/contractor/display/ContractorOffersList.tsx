"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContractorOffers } from "../../../hooks";
import { ContractorOffersAllQueryParams } from "../../../types";
import { OfferList } from "../../common/OfferList";

export const ContractorOffersList = () => {
  const router = useRouter();
  const [queryParams, setQueryParams] =
    useState<ContractorOffersAllQueryParams>({});
  const {
    offers,
    isLoading,
    error,
    pagination,
    fetchAllOffers,
    fetchOfferDetails,
  } = useContractorOffers(undefined, false, false);

  // Initial fetch on mount
  useEffect(() => {
    fetchAllOffers(queryParams);
  }, []);

  const handleAccept = (offer: any) => {
    // TODO: Implement accept offer logic
  };

  const handleReject = (offer: any) => {
    // TODO: Implement reject offer logic
  };

  const handleView = async (offer: any) => {
    router.push(`/dashboard/contractor/offers/${offer.id}`);
  };

  const handleEdit = (offer: any) => {
    router.push(`/dashboard/contractor/offers/${offer.id}/edit`);
  };

  const handleWithdraw = (offer: any) => {
    // TODO: Implement withdraw offer logic
  };

  const handleCounterOffer = (offer: any) => {
    // TODO: Implement counter offer logic
  };

  const handleRefresh = () => {
    fetchAllOffers(queryParams);
  };

  const handleFilterChange = useCallback(
    (filters: any) => {
      setQueryParams((prevParams) => {
        const params: ContractorOffersAllQueryParams = {
          ...prevParams,
          status: filters.status,
          offer_amount_min: filters.minAmount,
          offer_amount_max: filters.maxAmount,
          created_from: filters.dateFrom,
          created_to: filters.dateTo,
        };
        fetchAllOffers(params);
        return params;
      });
    },
    [fetchAllOffers]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setQueryParams((prevParams) => {
        const params: ContractorOffersAllQueryParams = {
          ...prevParams,
          search: search || undefined,
          page: 1, // Reset to first page on search
        };
        fetchAllOffers(params);
        return params;
      });
    },
    [fetchAllOffers]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setQueryParams((prevParams) => {
        const params: ContractorOffersAllQueryParams = {
          ...prevParams,
          page,
        };
        fetchAllOffers(params);
        return params;
      });
    },
    [fetchAllOffers]
  );

  const handleCreateNew = () => {
    router.push("/dashboard/contractor/browse-projects");
  };

  return (
    <OfferList
      offers={offers}
      variant="contractor"
      isLoading={isLoading}
      error={error}
      pagination={pagination}
      onAccept={handleAccept}
      onReject={handleReject}
      onView={handleView}
      onEdit={handleEdit}
      onWithdraw={handleWithdraw}
      onCounterOffer={handleCounterOffer}
      onRefresh={handleRefresh}
      onCreateNew={handleCreateNew}
      onFilterChange={handleFilterChange}
      onSearchChange={handleSearchChange}
      onPageChange={handlePageChange}
      showStats={false}
      showFilters={true}
    />
  );
};
