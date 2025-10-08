import { create } from "zustand";
import {
  IndividualOffer,
  IndividualOfferStats,
  IndividualOfferFilters,
} from "../types";
import { individualOffersApi, OwnerOffersAllQueryParams } from "../services";

interface IndividualOffersState {
  // Data
  offers: IndividualOffer[];
  projectOffers: IndividualOffer[]; // Offers for a specific project
  currentOffer: IndividualOffer | null;
  stats: IndividualOfferStats | null;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Filters and Pagination
  filters: IndividualOfferFilters;
  queryParams: OwnerOffersAllQueryParams;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setOffers: (offers: IndividualOffer[]) => void;
  setProjectOffers: (offers: IndividualOffer[]) => void;
  setCurrentOffer: (offer: IndividualOffer | null) => void;
  setStats: (stats: IndividualOfferStats) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: IndividualOfferFilters) => void;
  setQueryParams: (params: OwnerOffersAllQueryParams) => void;
  setPagination: (
    pagination: Partial<{
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  ) => void;

  // API Actions - Owner endpoints
  fetchAllOffers: (params?: OwnerOffersAllQueryParams) => Promise<void>;
  fetchProjectOffers: (projectId: string | number) => Promise<void>;
  fetchOfferDetails: (offerId: string | number) => Promise<void>;
  fetchOffer: (offerId: string | number) => Promise<void>;
  fetchStats: () => Promise<void>;
  acceptOffer: (offerId: string | number) => Promise<IndividualOffer>;
  rejectOffer: (offerId: string | number, reason?: string) => Promise<void>;
  markAsViewed: (offerId: string | number) => Promise<void>;
  requestCounterOffer: (offerId: string | number, message: string) => Promise<void>;

  // Reset
  reset: () => void;
}

const initialState = {
  offers: [],
  projectOffers: [],
  currentOffer: null,
  stats: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},
  queryParams: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const useIndividualOffersStore = create<IndividualOffersState>(
  (set, get) => ({
    ...initialState,

    // Setters
    setOffers: (offers) => set({ offers }),
    setProjectOffers: (projectOffers) => set({ projectOffers }),
    setCurrentOffer: (currentOffer) => set({ currentOffer }),
    setStats: (stats) => set({ stats }),
    setLoading: (isLoading) => set({ isLoading }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ error }),
    setFilters: (filters) => set({ filters }),
    setQueryParams: (queryParams) => set({ queryParams }),
    setPagination: (pagination) =>
      set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      })),

    // API Actions - Owner endpoints
    fetchAllOffers: async (params?: OwnerOffersAllQueryParams) => {
      const { pagination } = get();
      set({ isLoading: true, error: null });

      try {
        const response = await individualOffersApi.getAllOwnerOffers({
          ...params,
          page: params?.page || pagination.page,
          per_page: params?.per_page || pagination.limit,
        });

        set({
          offers: response.response.data,
          pagination: {
            page: response.response.current_page,
            limit: response.response.per_page,
            total: response.response.total,
            totalPages: response.response.last_page,
          },
        });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch offers" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchProjectOffers: async (projectId: string | number) => {
      set({ isLoading: true, error: null });

      try {
        const response = await individualOffersApi.getProjectOffers(projectId);
        set({
          projectOffers: response.response.data,
          pagination: {
            page: response.response.current_page,
            limit: response.response.per_page,
            total: response.response.total,
            totalPages: response.response.last_page,
          },
        });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch project offers" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchOfferDetails: async (offerId: string | number) => {
      set({ isLoading: true, error: null });

      try {
        const offer = await individualOffersApi.getOwnerOfferDetails(offerId);
        set({ currentOffer: offer });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch offer details" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchOffer: async (offerId: string | number) => {
      set({ isLoading: true, error: null });

      try {
        const offer = await individualOffersApi.getOwnerOffer(offerId);
        set({ currentOffer: offer });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch offer" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchStats: async () => {
      try {
        const stats = await individualOffersApi.getOwnerOfferStats();
        set({ stats });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch stats" });
      }
    },

    acceptOffer: async (offerId: string | number) => {
      set({ isSubmitting: true, error: null });

      try {
        const updatedOffer = await individualOffersApi.acceptOffer(offerId);
        const offerIdStr = offerId.toString();
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerIdStr ? updatedOffer : offer
          ),
          projectOffers: state.projectOffers.map((offer) =>
            offer.id === offerIdStr ? updatedOffer : offer
          ),
          currentOffer:
            state.currentOffer?.id === offerIdStr ? updatedOffer : state.currentOffer,
        }));

        // Trigger workflow transition after successful offer acceptance
        // The workflow will be handled by the component using useProjectWorkflow
        return updatedOffer;
      } catch (error: any) {
        set({ error: error.message || "Failed to accept offer" });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    rejectOffer: async (offerId: string | number, reason?: string) => {
      set({ isSubmitting: true, error: null });

      try {
        const updatedOffer = await individualOffersApi.rejectOffer(offerId, reason);
        const offerIdStr = offerId.toString();
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerIdStr ? updatedOffer : offer
          ),
          projectOffers: state.projectOffers.map((offer) =>
            offer.id === offerIdStr ? updatedOffer : offer
          ),
          currentOffer:
            state.currentOffer?.id === offerIdStr ? updatedOffer : state.currentOffer,
        }));
      } catch (error: any) {
        set({ error: error.message || "Failed to reject offer" });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    markAsViewed: async (offerId: string | number) => {
      try {
        await individualOffersApi.markOfferAsViewed(offerId);
        const nowIso = new Date().toISOString();
        const offerIdStr = offerId.toString();
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerIdStr ? { ...offer, lastViewedAt: nowIso } : offer
          ),
          projectOffers: state.projectOffers.map((offer) =>
            offer.id === offerIdStr ? { ...offer, lastViewedAt: nowIso } : offer
          ),
          currentOffer:
            state.currentOffer?.id === offerIdStr
              ? { ...state.currentOffer, lastViewedAt: nowIso }
              : state.currentOffer,
        }));
      } catch (error: any) {
        set({ error: error.message || "Failed to mark offer as viewed" });
        throw error;
      }
    },
    requestCounterOffer: async (offerId: string | number, message: string) => {
      set({ isSubmitting: true, error: null });
      try {
        const updatedOffer = await individualOffersApi.requestCounterOffer(
          offerId,
          message
        );
        const offerIdStr = offerId.toString();
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === offerIdStr ? updatedOffer : offer
          ),
          projectOffers: state.projectOffers.map((offer) =>
            offer.id === offerIdStr ? updatedOffer : offer
          ),
          currentOffer:
            state.currentOffer?.id === offerIdStr ? updatedOffer : state.currentOffer,
        }));
      } catch (error: any) {
        set({ error: error.message || "Failed to request counter offer" });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    reset: () => set(initialState),
  })
);
