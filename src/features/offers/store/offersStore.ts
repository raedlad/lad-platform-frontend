import { create } from "zustand";
import { Offer, OfferFilters, OfferSortOptions, OfferSummary } from "../types";
import { offersApi } from "../services";

interface OffersState {
  // Data
  offers: Offer[];
  currentOffer: Offer | null;
  summary: OfferSummary | null;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Filters and Pagination
  filters: OfferFilters;
  sort: OfferSortOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setOffers: (offers: Offer[]) => void;
  setCurrentOffer: (offer: Offer | null) => void;
  setSummary: (summary: OfferSummary) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: OfferFilters) => void;
  setSort: (sort: OfferSortOptions) => void;
  setPagination: (
    pagination: Partial<{
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>
  ) => void;

  // API Actions
  fetchOffers: () => Promise<void>;
  fetchOffer: (id: string) => Promise<void>;
  fetchSummary: () => Promise<void>;
  createOffer: (data: any) => Promise<void>;
  updateOffer: (id: string, data: any) => Promise<void>;
  withdrawOffer: (id: string) => Promise<void>;
  acceptOffer: (id: string) => Promise<void>;
  rejectOffer: (id: string, reason?: string) => Promise<void>;
  markAsViewed: (id: string) => Promise<void>;

  // Reset
  reset: () => void;
}

const initialState = {
  offers: [],
  currentOffer: null,
  summary: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},
  sort: { field: "submittedAt", direction: "desc" } as OfferSortOptions,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

export const useOffersStore = create<OffersState>((set, get) => ({
  ...initialState,

  // Setters
  setOffers: (offers) => set({ offers }),
  setCurrentOffer: (currentOffer) => set({ currentOffer }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setSort: (sort) => set({ sort }),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),

  // API Actions
  fetchOffers: async () => {
    const { filters, sort, pagination } = get();
    set({ isLoading: true, error: null });

    try {
      const response = await offersApi.getOffers({
        filters,
        sort,
        page: pagination.page,
        limit: pagination.limit,
      });

      set({
        offers: response.data,
        pagination: {
          ...pagination,
          total: response.total,
          totalPages: response.totalPages,
        },
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch offers" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOffer: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const offer = await offersApi.getOffer(id);
      set({ currentOffer: offer });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch offer" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    const { filters } = get();

    try {
      const summary = await offersApi.getOfferSummary(filters);
      set({ summary });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch summary" });
    }
  },

  createOffer: async (data: any) => {
    set({ isSubmitting: true, error: null });

    try {
      const newOffer = await offersApi.createOffer(data);
      set((state) => ({
        offers: [newOffer, ...state.offers],
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to create offer" });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateOffer: async (id: string, data: any) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedOffer = await offersApi.updateOffer(id, data);
      set((state) => ({
        offers: state.offers.map((offer) =>
          offer.id === id ? updatedOffer : offer
        ),
        currentOffer:
          state.currentOffer?.id === id ? updatedOffer : state.currentOffer,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to update offer" });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  withdrawOffer: async (id: string) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedOffer = await offersApi.withdrawOffer(id);
      set((state) => ({
        offers: state.offers.map((offer) =>
          offer.id === id ? updatedOffer : offer
        ),
        currentOffer:
          state.currentOffer?.id === id ? updatedOffer : state.currentOffer,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to withdraw offer" });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  acceptOffer: async (id: string) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedOffer = await offersApi.acceptOffer(id);
      set((state) => ({
        offers: state.offers.map((offer) =>
          offer.id === id ? updatedOffer : offer
        ),
        currentOffer:
          state.currentOffer?.id === id ? updatedOffer : state.currentOffer,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to accept offer" });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  rejectOffer: async (id: string, reason?: string) => {
    set({ isSubmitting: true, error: null });

    try {
      const updatedOffer = await offersApi.rejectOffer(id, reason);
      set((state) => ({
        offers: state.offers.map((offer) =>
          offer.id === id ? updatedOffer : offer
        ),
        currentOffer:
          state.currentOffer?.id === id ? updatedOffer : state.currentOffer,
      }));
    } catch (error: any) {
      set({ error: error.message || "Failed to reject offer" });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  markAsViewed: async (id: string) => {
    try {
      await offersApi.markAsViewed(id);
    } catch (error: any) {
      set({ error: error.message || "Failed to mark offer as viewed" });
    }
  },

  reset: () => set(initialState),
}));
