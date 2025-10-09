import { api } from "@/lib/api";
import {
  ContractorOffer,
  ContractorOfferStats,
  ContractorOfferFilters,
  ContractorOffersAllQueryParams,
  CreateOfferRequest,
  CreateCompleteOfferRequest,
  UpdateOfferRequest,
  UpdateCompleteOfferRequest,
  OfferPhase,
  OfferPaymentPlan,
  AvailableProject,
  AvailableProjectsResponse,
} from "../types";

export const contractorOffersApi = {
  // Get contractor's submitted offers
  getContractorOffers: async (params: {
    filters?: ContractorOfferFilters;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/contractor/offers", { params });
    return response.data;
  },

  // Get all contractor offers with comprehensive filtering
  getAllContractorOffers: async (params?: ContractorOffersAllQueryParams) => {
    // Default per_page if not provided
    const queryParams = {
      per_page: 10,
      ...params,
    };

    const response = await api.get("/contractor/offers/all", { params: queryParams });
    return response.data;
  },

  // Get contractor offer statistics
  getContractorOfferStats: async (): Promise<ContractorOfferStats> => {
    const response = await api.get("/contractor/offers/stats");
    return response.data;
  },

  // Submit offer to project
  submitOffer: async (data: CreateOfferRequest): Promise<ContractorOffer> => {
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

    const response = await api.post("/contractor/offers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Submit complete offer with phases and payment plans
  submitCompleteOffer: async (
    projectId: string,
    data: CreateCompleteOfferRequest
  ): Promise<ContractorOffer> => {
    const formData = new FormData();

    formData.append("offer_amount", data.offerAmount.toString());
    formData.append("offer_validity_value", data.offerValidityValue.toString());
    formData.append("offer_validity_unit", data.offerValidityUnit);
    formData.append(
      "execution_duration_value",
      data.executionDurationValue.toString()
    );
    formData.append("execution_duration_unit", data.executionDurationUnit);
    formData.append("expected_start_date", data.expectedStartDate);
    formData.append("expected_end_date", data.expectedEndDate);
    formData.append("details", data.details);

    if (data.hasWarranty !== undefined) {
      formData.append("has_warranty", data.hasWarranty.toString());
    }

    if (data.files && data.files.length > 0) {
      data.files.forEach((file: File, index: number) => {
        formData.append(`files[${index}]`, file, file.name);
      });
    }

    // Phases with embedded payment plans
    if (data.phases && data.phases.length > 0) {
      data.phases.forEach((phase: OfferPhase, index: number) => {
        formData.append(`phases[${index + 1}][title]`, phase.title);
        formData.append(`phases[${index + 1}][description]`, phase.description);
        formData.append(
          `phases[${index + 1}][order]`,
          (phase.order + 1).toString()
        );

        // Add payment plans for each phase
        if (phase.paymentPlans && phase.paymentPlans.length > 0) {
          phase.paymentPlans.forEach((plan: OfferPaymentPlan, planIndex: number) => {
            formData.append(
              `phases[${index + 1}][payment_plans][${planIndex}][name]`,
              plan.name
            );
            formData.append(
              `phases[${index + 1}][payment_plans][${planIndex}][amount]`,
              plan.amount.toString()
            );
            formData.append(
              `phases[${index + 1}][payment_plans][${planIndex}][sort_order]`,
              planIndex.toString()
            );
          });
        }
      });
    }
    const response = await api.post(
      `/contractor/projects/${projectId}/complete-offers`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const apiData = response.data.response || response.data;
    const transformedOffer: ContractorOffer = {
      id: apiData.id?.toString() || "",
      projectId: apiData.project_id?.toString() || "",
      projectTitle: "", // Will be set from project data or empty
      contractorId: apiData.contractor_id?.toString() || "",
      contractorName: "", // Not provided by API, set empty
      contractorRating: 0, // Not provided by API
      status: (apiData.status as any) || "pending",
      amount: parseFloat(apiData.offer_amount || "0"),
      currency: "SAR",
      timeline: {
        estimatedDuration: apiData.execution_duration_value || 0,
        proposedStartDate: apiData.expected_start_date || "",
        proposedEndDate: apiData.expected_end_date || "",
      },
      description: apiData.details || "",
      submittedAt:
        apiData.submitted_at || apiData.created_at || new Date().toISOString(),
      updatedAt: apiData.updated_at || new Date().toISOString(),
      hasWarranty: apiData.has_warranty || false,
      offerValidity: {
        value: apiData.offer_validity_value || 0,
        unit: apiData.offer_validity_unit || "days",
      },
      executionDuration: {
        value: apiData.execution_duration_value || 0,
        unit: apiData.execution_duration_unit || "days",
      },
      // Contractor-specific fields
      projectOwner: {
        id: "",
        name: "",
        rating: 0,
      },
      projectLocation: "",
      projectType: "",
      canWithdraw: apiData.can_be_withdrawn || false,
      canModify: apiData.status === "draft",
    };

    return transformedOffer;
  },

  // Update contractor's offer
  updateContractorOffer: async (
    id: string,
    data: UpdateOfferRequest
  ): Promise<ContractorOffer> => {
    const response = await api.patch(`/contractor/offers/${id}`, data);
    return response.data;
  },

  // Update contractor's complete offer
  updateCompleteOffer: async (
    id: string,
    data: UpdateCompleteOfferRequest,
    projectId?: string
  ): Promise<ContractorOffer> => {
    const formData = new FormData();
    formData.append("_method", "PATCH");

    // Basic offer data
    if (data.offerAmount !== undefined) {
      formData.append("offer_amount", data.offerAmount.toString());
    }
    if (data.offerValidityValue !== undefined) {
      formData.append(
        "offer_validity_value",
        data.offerValidityValue.toString()
      );
    }
    if (data.offerValidityUnit) {
      formData.append("offer_validity_unit", data.offerValidityUnit);
    }
    if (data.executionDurationValue !== undefined) {
      formData.append(
        "execution_duration_value",
        data.executionDurationValue.toString()
      );
    }
    if (data.executionDurationUnit) {
      formData.append("execution_duration_unit", data.executionDurationUnit);
    }
    if (data.expectedStartDate) {
      formData.append("expected_start_date", data.expectedStartDate);
    }
    if (data.expectedEndDate) {
      formData.append("expected_end_date", data.expectedEndDate);
    }
    if (data.details) {
      formData.append("details", data.details);
    }
    if (data.hasWarranty !== undefined) {
      formData.append("has_warranty", data.hasWarranty.toString());
    }

    // Files array (File[])
    if (data.files && data.files.length > 0) {
      data.files.forEach((file: File, index: number) => {
        formData.append(`files[${index}]`, file, file.name);
      });
    }

    // Phases with embedded payment plans
    if (data.phases && data.phases.length > 0) {
      data.phases.forEach((phase: OfferPhase, index: number) => {
        formData.append(`phases[${index + 1}][title]`, phase.title);
        formData.append(`phases[${index + 1}][description]`, phase.description);
        formData.append(
          `phases[${index + 1}][order]`,
          (phase.order + 1).toString()
        );

        // Add payment plans for each phase
        if (phase.paymentPlans && phase.paymentPlans.length > 0) {
          phase.paymentPlans.forEach((plan: OfferPaymentPlan, planIndex: number) => {
            formData.append(
              `phases[${index + 1}][payment_plans][${planIndex}][name]`,
              plan.name
            );
            formData.append(
              `phases[${index + 1}][payment_plans][${planIndex}][amount]`,
              plan.amount.toString()
            );
            formData.append(
              `phases[${index + 1}][payment_plans][${planIndex}][sort_order]`,
              planIndex.toString()
            );          });
        }
      });
    }
    const response = await api.patch(`/contractor/projects/${projectId}/complete-offers/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const apiData = response.data.response || response.data;
    const transformedOffer: ContractorOffer = {
      id: apiData.id?.toString() || "",
      projectId: apiData.project_id?.toString() || "",
      projectTitle: "",
      contractorId: apiData.contractor_id?.toString() || "",
      contractorName: "",
      contractorRating: 0,
      status: (apiData.status as any) || "pending",
      amount: parseFloat(apiData.offer_amount || "0"),
      currency: "SAR",
      timeline: {
        estimatedDuration: apiData.execution_duration_value || 0,
        proposedStartDate: apiData.expected_start_date || "",
        proposedEndDate: apiData.expected_end_date || "",
      },
      description: apiData.details || "",
      submittedAt:
        apiData.submitted_at || apiData.created_at || new Date().toISOString(),
      updatedAt: apiData.updated_at || new Date().toISOString(),
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
        id: "",
        name: "",
        rating: 0,
      },
      projectLocation: "",
      projectType: "",
      canWithdraw: apiData.can_be_withdrawn || false,
      canModify: apiData.status === "draft",
    };

    return transformedOffer;
  },

  // Withdraw contractor's offer
  withdrawContractorOffer: async (id: string): Promise<ContractorOffer> => {
    const response = await api.post(`/contractor/offers/${id}/withdraw`);
    return response.data;
  },

  // Get contractor's offer by ID
  getContractorOffer: async (id: string): Promise<ContractorOffer> => {
    const response = await api.get(`/contractor/offers/${id}`);
    return response.data;
  },

  // Get contractor's offer details
  getContractorOfferDetails: async (
    offerId: string
  ): Promise<ContractorOffer> => {
    const response = await api.get(`/contractor/offers/${offerId}/details`);
    const responseData = response.data.response || response.data;
    const apiData = responseData.offer || responseData;
    const phases = responseData.phases || apiData.phases || [];
    const paymentPlans = responseData.payment_plans || [];

    // Transform the response to match ContractorOffer interface
    const transformedOffer: ContractorOffer = {
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
      submittedAt:
        apiData.submitted_at || apiData.created_at || new Date().toISOString(),
      updatedAt: apiData.updated_at || new Date().toISOString(),
      hasWarranty: apiData.has_warranty || false,
      offerValidity: {
        value: apiData.offer_validity_value || 0,
        unit: apiData.offer_validity_unit || "days",
      },
      executionDuration: {
        value: apiData.execution_duration_value || 0,
        unit: apiData.execution_duration_unit || "days",
      },
      phases: phases.map((phase: any) => {
        // Match payment plans from top-level array by project_phase_id
        const phasePaymentPlans = paymentPlans.filter(
          (plan: any) => plan.project_phase_id === phase.id
        );

        // Use nested payment_plans if available, otherwise use matched plans from top level
        const plans =
          phase.payment_plans && phase.payment_plans.length > 0
            ? phase.payment_plans
            : phasePaymentPlans;

        return {
          id: phase.id?.toString(),
          title: phase.title || "",
          description: phase.description || "",
          order: phase.order || 0,
          paymentPlans: plans.map((plan: any) => ({
            id: plan.id?.toString(),
            name: plan.name || "",
            amount: parseFloat(plan.amount || "0"),
            percentageOfContract: parseFloat(
              plan.percentage_of_contract || "0"
            ),
            dueOn: plan.due_on || "",
            sortOrder: plan.sort_order || 0,
            userBankAccountId: plan.user_bank_account_id || 0,
            referenceNote: plan.reference_note,
          })),
        };
      }),
      paymentPlans: paymentPlans.map((plan: any) => ({
        id: plan.id?.toString(),
        name: plan.name || "",
        amount: parseFloat(plan.amount || "0"),
        percentageOfContract: parseFloat(plan.percentage_of_contract || "0"),
        dueOn: plan.due_on || "",
        sortOrder: plan.sort_order || 0,
        userBankAccountId: plan.user_bank_account_id || 0,
        referenceNote: plan.reference_note,
      })),
      attachments: [
        apiData.documents_url,
        apiData.images_url,
        apiData.attachments_url,
        apiData.drawings_url,
        apiData.specifications_url,
        apiData.licenses_url,
      ]
        .filter(Boolean)
        .map((url, index) => ({
          id: index.toString(),
          name: url?.split("/").pop() || `attachment-${index}`,
          url: url || "",
          type: "application/pdf",
          size: 0,
        })),
      projectOwner: {
        id: apiData.project?.client_id?.toString() || "",
        name: apiData.project?.client?.name || "",
        rating: 0,
      },
      projectLocation: apiData.project?.location?.city_name || "",
      projectType: apiData.project?.type?.name || "",
      canWithdraw:
        apiData.can_be_withdrawn !== undefined
          ? apiData.can_be_withdrawn
          : apiData.status === "draft",
      canModify: apiData.status === "draft",
    };

    return transformedOffer;
  },

  // Get available projects for bidding
  getAvailableProjects: async (params: {
    q?: string;
    project_type_id?: number;
    per_page?: number;
  }): Promise<AvailableProjectsResponse> => {
    const response = await api.get("/projects/public", {
      params: {
        q: params.q,
        project_type_id: params.project_type_id,
        per_page: params.per_page || 15,
      },
    });
    return response.data;
  },
};
