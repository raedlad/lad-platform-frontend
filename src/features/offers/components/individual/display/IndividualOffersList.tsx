"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIndividualOffers } from "../../../hooks";
import { OwnerOffersAllQueryParams } from "../../../services";
import { OfferList } from "../../common/OfferList";
import { toast } from "sonner";
// import { useOfferWorkflow } from "@/features/workflow";
import { useAuthStore } from "@/features/auth/store/authStore";

interface IndividualOffersListProps {
  projectId?: string | number;
}

export const IndividualOffersList: React.FC<IndividualOffersListProps> = ({
  projectId,
}) => {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<OwnerOffersAllQueryParams>({});
  const user = useAuthStore((state) => state.user);
  
  const {
    offers,
    isLoading,
    isSubmitting,
    error,
    pagination,
    fetchAllOffers,
    fetchProjectOffers,
    acceptOffer,
    rejectOffer,
    markAsViewed,
    requestCounterOffer,
  } = useIndividualOffers(projectId, false, true);

  // // Workflow integration for offer acceptance
  // const { acceptOfferWithWorkflow, isAccepting } = useOfferWorkflow({
  //   onSuccess: () => {
  //     // Refresh offers list after successful acceptance
  //     if (projectId) {
  //       fetchProjectOffers(projectId);
  //     } else {
  //       fetchAllOffers(queryParams);
  //     }
  //   },
  //   onError: (error) => {
  //     console.error('Workflow error:', error);
  //   },
  // });

  // Initial fetch on mount
  useEffect(() => {
    if (projectId) {
      fetchProjectOffers(projectId);
    } else {
      fetchAllOffers(queryParams);
    }
  }, []);

  const handleAccept = async (offer: any) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    if (!offer.projectId) {
      toast.error("Project ID is missing");
      return;
    }

    try {
      // Use workflow adapter for offer acceptance
      // This will handle both the offer acceptance and workflow transition
      // await acceptOfferWithWorkflow(
      //   offer.projectId.toString(), 
      //   offer.id.toString(), 
      //   user.id.toString()
      // );
      // Success toast and refresh handled by useOfferWorkflow hook
    } catch (error: any) {
      // Error already handled by hook, but log for debugging
      console.error('Failed to accept offer:', error);
    }
  };

  const handleReject = async (offer: any) => {
    try {
      // You can prompt for a reason here if needed
      await rejectOffer(offer.id, "Not suitable for requirements");
      toast.success("Offer rejected successfully");
      // Refresh the list
      if (projectId) {
        fetchProjectOffers(projectId);
      } else {
        fetchAllOffers(queryParams);
      }
    } catch (error) {
      toast.error("Failed to reject offer");
    }
  };

  const handleView = async (offer: any) => {
    // Mark as viewed
    await markAsViewed(offer.id);
    // Navigate to offer details
    router.push(`/dashboard/individual/offers/${offer.id}`);
  };

  const handleEdit = (offer: any) => {
    // Owner cannot edit offers from contractors
    toast.info("You cannot edit contractor offers");
  };

  const handleWithdraw = (offer: any) => {
    // Owner cannot withdraw contractor offers
    toast.info("You cannot withdraw contractor offers");
  };

  const handleCounterOffer = async (offer: any) => {
    // Navigate to counter offer page or open dialog
    router.push(`/dashboard/individual/offers/${offer.id}/counter`);
  };

  const handleRefresh = () => {
    if (projectId) {
      fetchProjectOffers(projectId);
    } else {
      fetchAllOffers(queryParams);
    }
  };

  const handleFilterChange = useCallback(
    (filters: any) => {
      setQueryParams((prevParams) => {
        const params: OwnerOffersAllQueryParams = {
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
        const params: OwnerOffersAllQueryParams = {
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
        const params: OwnerOffersAllQueryParams = {
          ...prevParams,
          page,
        };
        fetchAllOffers(params);
        return params;
      });
    },
    [fetchAllOffers]
  );

  return (
    <OfferList
      offers={offers}
      variant="individual"
      isLoading={isLoading || isSubmitting}
      error={error}
      pagination={pagination}
      onAccept={handleAccept}
      onReject={handleReject}
      onView={handleView}
      onEdit={handleEdit}
      onWithdraw={handleWithdraw}
      onCounterOffer={handleCounterOffer}
      onRefresh={handleRefresh}
      onFilterChange={handleFilterChange}
      onSearchChange={handleSearchChange}
      onPageChange={handlePageChange}
      showStats={!projectId} // Show stats only on all offers page
      showFilters={true}
    />
  );
};
