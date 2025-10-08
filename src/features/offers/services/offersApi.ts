import { api } from "@/lib/api";
import {
  Offer,
  CreateOfferRequest,
  UpdateOfferRequest,
  OfferFilters,
  OfferSortOptions,
  OfferSummary,
} from "../types";

export const offersApi = {
  // Get offers with filters and pagination
  getOffers: async (params: {
    filters?: OfferFilters;
    sort?: OfferSortOptions;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/offers", { params });
    return response.data;
  },

  // Get single offer by ID
  getOffer: async (id: string): Promise<Offer> => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  // Create new offer
  createOffer: async (data: CreateOfferRequest): Promise<Offer> => {
    const formData = new FormData();

    formData.append("projectId", data.projectId);
    formData.append("amount", data.amount.toString());
    formData.append("currency", data.currency);
    formData.append("timeline", JSON.stringify(data.timeline));
    formData.append("description", data.description);

    if (data.notes) formData.append("notes", data.notes);
    if (data.terms) formData.append("terms", data.terms);

    if (data.attachments) {
      data.attachments.forEach((file: any, index: any) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await api.post("/offers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateOffer: async (id: string, data: UpdateOfferRequest): Promise<Offer> => {
    const response = await api.put(`/offers/${id}`, data);
    return response.data;
  },

  // Withdraw offer
  withdrawOffer: async (id: string): Promise<Offer> => {
    const response = await api.post(`/contractor/offers/${id}/withdraw`);
    return response.data;
  },

  // Accept offer (for project owners)
  acceptOffer: async (id: string): Promise<Offer> => {
    const response = await api.patch(`/offers/${id}/accept`);
    return response.data;
  },

  // Reject offer (for project owners)
  rejectOffer: async (id: string, reason?: string): Promise<Offer> => {
    const response = await api.patch(`/offers/${id}/reject`, { reason });
    return response.data;
  },

  // Get offer summary/statistics
  getOfferSummary: async (filters?: OfferFilters): Promise<OfferSummary> => {
    const response = await api.get("/offers/summary", {
      params: filters,
    });
    return response.data;
  },

  // Mark offer as viewed
  markAsViewed: async (id: string): Promise<void> => {
    await api.patch(`/offers/${id}/viewed`);
  },
};
