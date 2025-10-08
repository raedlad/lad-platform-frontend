import { api } from "@/lib/api";
import {
  IndividualOffer,
  IndividualOfferStats,
  IndividualOfferFilters,
  OfferPhase,
  OfferPaymentPlan,
  OfferAttachment,
} from "../types";

// Query parameters for fetching all offers
export interface OwnerOffersAllQueryParams {
  status?: string[];
  statuses?: string;
  project_id?: number;
  project_ids?: number[];
  contractor_id?: number;
  contractor_ids?: number[];
  offer_amount_min?: number;
  offer_amount_max?: number;
  execution_duration_value_min?: number;
  execution_duration_value_max?: number;
  created_from?: string;
  created_to?: string;
  submitted_from?: string;
  submitted_to?: string;
  has_warranty?: boolean;
  has_negotiations?: boolean;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'submitted_at' | 'offer_amount' | 'execution_duration_value';
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// Response interface for paginated data
interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  response: {
    data: T[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export const individualOffersApi = {
  // Transform API response to IndividualOffer interface
  transformApiResponseToOffer: (apiData: any): IndividualOffer => {
    const phases = apiData.phases || [];
    const paymentPlans = apiData.payment_plans || [];
    const contractor = apiData.contractor || {};
    const project = apiData.project || {};

    return {
      id: apiData.id?.toString() || '',
      projectId: apiData.project_id?.toString() || '',
      projectTitle: project.title || '',
      contractorId: apiData.contractor_id?.toString() || '',
      contractorName: contractor.name || contractor.company_name || '',
      contractorRating: contractor.rating || 0,
      status: apiData.status || 'pending',
      amount: parseFloat(apiData.offer_amount || '0'),
      currency: 'SAR',
      timeline: {
        estimatedDuration: apiData.execution_duration_value || 0,
        proposedStartDate: apiData.expected_start_date || '',
        proposedEndDate: apiData.expected_end_date || '',
      },
      description: apiData.details || '',
      submittedAt: apiData.submitted_at || apiData.created_at || new Date().toISOString(),
      updatedAt: apiData.updated_at || new Date().toISOString(),
      hasWarranty: apiData.has_warranty || false,
      offerValidity: {
        value: apiData.offer_validity_value || 0,
        unit: apiData.offer_validity_unit || 'days',
      },
      executionDuration: {
        value: apiData.execution_duration_value || 0,
        unit: apiData.execution_duration_unit || 'days',
      },
      phases: phases.map((phase: any) => ({
        id: phase.id?.toString(),
        title: phase.title || '',
        description: phase.description || '',
        order: phase.order || 0,
        paymentPlans: phase.payment_plans?.map((plan: any) => ({
          id: plan.id?.toString(),
          name: plan.name || '',
          amount: parseFloat(plan.amount || '0'),
          percentageOfContract: parseFloat(plan.percentage_of_contract || '0'),
          dueOn: plan.due_on || '',
          sortOrder: plan.sort_order || 0,
        })) || [],
      })),
      paymentPlans: paymentPlans.map((plan: any) => ({
        id: plan.id?.toString(),
        name: plan.name || '',
        amount: parseFloat(plan.amount || '0'),
        percentageOfContract: parseFloat(plan.percentage_of_contract || '0'),
        dueOn: plan.due_on || '',
        sortOrder: plan.sort_order || 0,
      })),
      attachments: apiData.attachments?.map((att: any) => ({
        id: att.id?.toString(),
        name: att.name || att.file_name || '',
        url: att.url || att.file_url || '',
        type: att.type || att.file_type || 'application/pdf',
        size: att.size || att.file_size || 0,
      })) || [],
      projectDetails: {
        id: project.id?.toString() || '',
        title: project.title || '',
        type: project.type?.name || '',
        location: project.location?.full_address || project.location?.city_name || '',
        timeline: {
          startDate: project.expected_start_date || '',
          endDate: project.expected_end_date || '',
        },
      },
      contractorDetails: {
        id: contractor.id?.toString() || '',
        name: contractor.name || contractor.company_name || '',
        rating: contractor.rating || 0,
        avatar: contractor.avatar || contractor.logo_url || '',
        completedProjects: contractor.completed_projects || 0,
        specialties: contractor.specialties || [],
        location: contractor.location?.city_name || '',
      },
      canAccept: apiData.can_accept !== undefined ? apiData.can_accept : apiData.status === 'pending',
      canReject: apiData.can_reject !== undefined ? apiData.can_reject : apiData.status === 'pending',
      canCounterOffer: apiData.can_counter !== undefined ? apiData.can_counter : apiData.status === 'pending',
      lastViewedAt: apiData.last_viewed_at,
    };
  },

  // Get all offers for the owner's projects
  getAllOwnerOffers: async (params?: OwnerOffersAllQueryParams): Promise<PaginatedResponse<IndividualOffer>> => {
    const queryParams = {
      per_page: 10,
      ...params,
    };

    const response = await api.get("/owner/offers/all", { params: queryParams });
    const apiResponse = response.data;

    // Transform the data array
    const transformedData = apiResponse.response?.data?.map((item: any) => 
      individualOffersApi.transformApiResponseToOffer(item)
    ) || [];

    return {
      success: apiResponse.success,
      message: apiResponse.message,
      response: {
        ...apiResponse.response,
        data: transformedData,
      },
    };
  },

  // Get offers for a specific project
  getProjectOffers: async (projectId: string | number): Promise<PaginatedResponse<IndividualOffer>> => {
    const response = await api.get(`/owner/projects/${projectId}/offers`);
    const apiResponse = response.data;

    // Transform the data array
    const transformedData = apiResponse.response?.data?.map((item: any) => 
      individualOffersApi.transformApiResponseToOffer(item)
    ) || [];

    return {
      success: apiResponse.success,
      message: apiResponse.message,
      response: {
        ...apiResponse.response,
        data: transformedData,
      },
    };
  },

  // Get a specific offer by ID
  getOwnerOffer: async (offerId: string | number): Promise<IndividualOffer> => {
    const response = await api.get(`/owner/offers/${offerId}`);
    const apiData = response.data.response || response.data;
    return individualOffersApi.transformApiResponseToOffer(apiData);
  },

  // Get detailed information about an offer
  getOwnerOfferDetails: async (offerId: string | number): Promise<IndividualOffer> => {
    const response = await api.get(`/owner/offers/${offerId}/details`);
    const responseData = response.data.response || response.data;
    const apiData = responseData.offer || responseData;
    
    return individualOffersApi.transformApiResponseToOffer(apiData);
  },

  // Accept an offer
  acceptOffer: async (offerId: string | number): Promise<IndividualOffer> => {
    const response = await api.post(`/owner/offers/${offerId}/accept`);
    const apiData = response.data.response || response.data;
    return individualOffersApi.transformApiResponseToOffer(apiData);
  },

  // Reject an offer
  rejectOffer: async (
    offerId: string | number,
    reason?: string
  ): Promise<IndividualOffer> => {
    const response = await api.post(`/owner/offers/${offerId}/reject`, {
      reason,
    });
    const apiData = response.data.response || response.data;
    return individualOffersApi.transformApiResponseToOffer(apiData);
  },

  // Get owner offer statistics
  getOwnerOfferStats: async (): Promise<IndividualOfferStats> => {
    try {
      const response = await api.get("/owner/offers/stats");
      const apiData = response.data.response || response.data;
      
      return {
        totalReceived: apiData.total_received || 0,
        pending: apiData.pending || 0,
        accepted: apiData.accepted || 0,
        rejected: apiData.rejected || 0,
        averageOfferValue: apiData.average_offer_value || 0,
        averageResponseTime: apiData.average_response_time || 0,
        totalProjectValue: apiData.total_project_value || 0,
      };
    } catch (error) {
      // Return default stats if endpoint doesn't exist
      console.warn('Stats endpoint not available, using defaults');
      return {
        totalReceived: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        averageOfferValue: 0,
        averageResponseTime: 0,
        totalProjectValue: 0,
      };
    }
  },

  // Mark offer as viewed
  markOfferAsViewed: async (offerId: string | number): Promise<void> => {
    try {
      await api.patch(`/owner/offers/${offerId}/viewed`);
    } catch (error) {
      console.warn('Failed to mark offer as viewed:', error);
    }
  },

  // Request counter offer
  requestCounterOffer: async (
    offerId: string | number,
    message: string
  ): Promise<IndividualOffer> => {
    const response = await api.post(
      `/owner/offers/${offerId}/counter-request`,
      { message }
    );
    const apiData = response.data.response || response.data;
    return individualOffersApi.transformApiResponseToOffer(apiData);
  },
};
