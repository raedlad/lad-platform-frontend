import { create } from "zustand";
import {
  ContractorOffer,
  ContractorOfferStats,
  ContractorOfferFilters,
  ContractorOffersAllQueryParams,
  CreateOfferRequest,
  CreateCompleteOfferRequest,
  UpdateOfferRequest,
  UpdateCompleteOfferRequest,
  AvailableProject,
  AvailableProjectsResponse,
} from "../types";
import { contractorOffersApi } from "../services/contractorOffersApi";

interface ContractorOffersState {
  // Data
  offers: ContractorOffer[];
  currentOffer: ContractorOffer | null;
  stats: ContractorOfferStats | null;
  availableProjects: AvailableProject[];

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Filters and Pagination
  filters: ContractorOfferFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  setOffers: (offers: ContractorOffer[]) => void;
  setCurrentOffer: (offer: ContractorOffer | null) => void;
  setStats: (stats: ContractorOfferStats) => void;
  setAvailableProjects: (projects: AvailableProject[]) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ContractorOfferFilters) => void;
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
  fetchAllOffers: (params?: ContractorOffersAllQueryParams) => Promise<void>;
  fetchOffer: (id: string) => Promise<void>;
  fetchOfferDetails: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchAvailableProjects: (params?: {
    q?: string;
    project_type_id?: number;
    per_page?: number;
  }) => Promise<void>;
  submitOffer: (data: CreateOfferRequest) => Promise<void>;
  submitCompleteOffer: (
    projectId: string,
    data: CreateCompleteOfferRequest
  ) => Promise<void>;
  updateOffer: (id: string, data: UpdateOfferRequest) => Promise<void>;
  updateCompleteOffer: (
    id: string,
    data: UpdateCompleteOfferRequest,
    projectId?: string
  ) => Promise<void>;
  withdrawOffer: (id: string) => Promise<void>;

  // Reset
  reset: () => void;
}

const initialState = {
  offers: [],
  currentOffer: null,
  stats: null,
  availableProjects: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 4,
    total: 0,
    totalPages: 0,
  },
};

export const useContractorOffersStore = create<ContractorOffersState>(
  (set, get) => ({
    ...initialState,

    // Setters
    setOffers: (offers) => set({ offers }),
    setCurrentOffer: (currentOffer) => set({ currentOffer }),
    setStats: (stats) => set({ stats }),
    setAvailableProjects: (availableProjects) => set({ availableProjects }),
    setLoading: (isLoading) => set({ isLoading }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setError: (error) => set({ error }),
    setFilters: (filters) => set({ filters }),
    setPagination: (pagination) =>
      set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      })),

    // API Actions
    fetchOffers: async () => {
      const { filters, pagination } = get();
      set({ isLoading: true, error: null });

      try {
        const response = await contractorOffersApi.getContractorOffers({
          filters,
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

    fetchAllOffers: async (params?: ContractorOffersAllQueryParams) => {
      const { pagination } = get();
      set({ isLoading: true, error: null });

      try {
        const response = await contractorOffersApi.getAllContractorOffers({
          per_page: pagination.limit,
          ...params,
        });
        const rawOffers = response.data || response.response?.data || [];

        // Debug: Log the response structure
        console.log("API Response:", response);
        console.log("Total offers:", rawOffers.length);
        console.log("Response keys:", Object.keys(response));

        // Transform API response to ContractorOffer format
        const transformedOffers: ContractorOffer[] = rawOffers.map(
          (apiData: any) => ({
            id: apiData.id?.toString() || "",
            projectId: apiData.project_id?.toString() || "",
            projectTitle: apiData.project?.title || "",
            contractorId: apiData.contractor_id?.toString() || "",
            contractorName: apiData.contractor?.name || "",
            contractorRating: apiData.contractor?.rating || 0,
            status: apiData.status || "draft",
            amount: parseFloat(apiData.offer_amount || "0"),
            currency: "SAR",
            timeline: {
              estimatedDuration: apiData.execution_duration_value || 0,
              proposedStartDate: apiData.expected_start_date || "",
              proposedEndDate: apiData.expected_end_date || "",
            },
            description: apiData.details || "",
            submittedAt: apiData.submitted_at || apiData.created_at || "",
            updatedAt: apiData.updated_at || "",
            hasWarranty: apiData.has_warranty || false,
            offerValidity: {
              value: apiData.offer_validity_value || 0,
              unit: apiData.offer_validity_unit || "days",
            },
            executionDuration: {
              value: apiData.execution_duration_value || 0,
              unit: apiData.execution_duration_unit || "days",
            },
            projectOwner: {
              id: apiData.project?.client_id?.toString() || "",
              name: apiData.project?.client?.name || "",
              rating: apiData.project?.client?.rating || 0,
            },
            projectLocation: apiData.project?.location?.city_name || "",
            projectType: apiData.project?.type?.name || "",
            canWithdraw: apiData.can_be_withdrawn || false,
            canModify: apiData.status === "draft",
          })
        );

        set({
          offers: transformedOffers,
          pagination: {
            page:
              response.current_page ||
              response.response?.current_page ||
              response.page ||
              1,
            limit:
              response.per_page ||
              response.response?.per_page ||
              response.limit ||
              10,
            total: response.total || response.response?.total || 0,
            totalPages: Math.ceil(
              (response.total || response.response?.total || 0) /
                (response.per_page ||
                  response.response?.per_page ||
                  response.limit ||
                  10)
            ),
          },
        });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch all offers" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchOffer: async (id: string) => {
      set({ isLoading: true, error: null });

      try {
        const offer = await contractorOffersApi.getContractorOffer(id);
        set({ currentOffer: offer });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch offer" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchOfferDetails: async (id: string) => {
      set({ isLoading: true, error: null });

      try {
        const offer = await contractorOffersApi.getContractorOfferDetails(id);
        set({ currentOffer: offer });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch offer details" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchStats: async () => {
      try {
        const stats = await contractorOffersApi.getContractorOfferStats();
        set({ stats });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch stats" });
      }
    },

    fetchAvailableProjects: async (params?: {
      q?: string;
      project_type_id?: number;
      per_page?: number;
    }) => {
      set({ isLoading: true, error: null });

      try {
        const response: AvailableProjectsResponse =
          await contractorOffersApi.getAvailableProjects({
            q: params?.q,
            project_type_id: params?.project_type_id,
            per_page: params?.per_page || 15,
          });
        set({ availableProjects: response.response?.data || [] });
      } catch (error: any) {
        set({ error: error.message || "Failed to fetch available projects" });
      } finally {
        set({ isLoading: false });
      }
    },

    submitOffer: async (data: CreateOfferRequest) => {
      set({ isSubmitting: true, error: null });

      try {
        const newOffer = await contractorOffersApi.submitOffer(data);
        set((state) => ({
          offers: [newOffer, ...state.offers],
        }));
      } catch (error: any) {
        set({ error: error.message || "Failed to submit offer" });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    submitCompleteOffer: async (
      projectId: string,
      data: CreateCompleteOfferRequest
    ) => {
      set({ isSubmitting: true, error: null });

      try {
        const newOffer = await contractorOffersApi.submitCompleteOffer(
          projectId,
          data
        );
        set((state) => ({
          offers: [newOffer, ...state.offers],
        }));
      } catch (error: any) {
        set({ error: error.message || "Failed to submit complete offer" });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    updateOffer: async (id: string, data: UpdateOfferRequest) => {
      set({ isSubmitting: true, error: null });

      try {
        const updatedOffer = await contractorOffersApi.updateContractorOffer(
          id,
          data
        );
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

    updateCompleteOffer: async (
      id: string,
      data: UpdateCompleteOfferRequest,
      projectId?: string
    ) => {
      set({ isSubmitting: true, error: null });

      try {
        const updatedOffer = await contractorOffersApi.updateCompleteOffer(
          id,
          data,
          projectId
        );
        set((state) => ({
          offers: state.offers.map((offer) =>
            offer.id === id ? updatedOffer : offer
          ),
          currentOffer:
            state.currentOffer?.id === id ? updatedOffer : state.currentOffer,
        }));
      } catch (error: any) {
        set({ error: error.message || "Failed to update complete offer" });
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    withdrawOffer: async (id: string) => {
      set({ isSubmitting: true, error: null });

      try {
        const updatedOffer = await contractorOffersApi.withdrawContractorOffer(
          id
        );
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

    reset: () => set(initialState),
  })
);
