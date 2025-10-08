// import {
//   mockContractorOffers,
//   mockIndividualOffers,
//   mockContractorStats,
//   mockIndividualStats,
//   mockAvailableProjects,
// } from "./data";
// import {
//   ContractorOffer,
//   IndividualOffer,
//   CreateCompleteOfferRequest,
//   AvailableProjectsResponse,
// } from "../types";

// // Simulate API delay
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export const mockContractorOffersService = {
//   // Get contractor's submitted offers
//   getContractorOffers: async (params: {
//     filters?: any;
//     page?: number;
//     limit?: number;
//   }) => {
//     await delay(500);

//     let filteredOffers = [...mockContractorOffers];

//     // Apply filters
//     if (params.filters?.status) {
//       filteredOffers = filteredOffers.filter((offer) =>
//         params.filters.status.includes(offer.status)
//       );
//     }

//     if (params.filters?.projectType) {
//       filteredOffers = filteredOffers.filter((offer) =>
//         params.filters.projectType.includes(offer.projectType)
//       );
//     }

//     if (params.filters?.minAmount) {
//       filteredOffers = filteredOffers.filter(
//         (offer) => offer.amount >= params.filters.minAmount
//       );
//     }

//     if (params.filters?.maxAmount) {
//       filteredOffers = filteredOffers.filter(
//         (offer) => offer.amount <= params.filters.maxAmount
//       );
//     }

//     // Apply pagination
//     const page = params.page || 1;
//     const limit = params.limit || 10;
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;

//     const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

//     return {
//       data: paginatedOffers,
//       total: filteredOffers.length,
//       totalPages: Math.ceil(filteredOffers.length / limit),
//       page,
//       limit,
//     };
//   },

//   // Get contractor offer statistics
//   getContractorOfferStats: async () => {
//     await delay(300);
//     return mockContractorStats;
//   },

//   // Submit offer to project
//   submitOffer: async (data: any) => {
//     await delay(1000);

//     const newOffer: ContractorOffer = {
//       id: `co-${Date.now()}`,
//       projectId: data.projectId,
//       projectTitle: "New Project",
//       contractorId: "contractor-1",
//       contractorName: "Ahmed Construction Co.",
//       contractorRating: 4.8,
//       status: "pending",
//       amount: data.amount,
//       currency: data.currency,
//       timeline: data.timeline,
//       description: data.description,
//       submittedAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       projectOwner: {
//         id: "owner-1",
//         name: "Project Owner",
//         rating: 4.5,
//       },
//       projectLocation: "Riyadh, Saudi Arabia",
//       projectType: "General",
//       canWithdraw: true,
//       canModify: true,
//     };

//     mockContractorOffers.unshift(newOffer);
//     return newOffer;
//   },

//   // Submit complete offer with phases and payment plans
//   submitCompleteOffer: async (
//     projectId: string,
//     data: CreateCompleteOfferRequest
//   ) => {
//     await delay(1500);

//     const newOffer: ContractorOffer = {
//       id: `co-${Date.now()}`,
//       projectId,
//       projectTitle: "Complete Project Offer",
//       contractorId: "contractor-1",
//       contractorName: "Ahmed Construction Co.",
//       contractorRating: 4.8,
//       status: "pending",
//       amount: data.offerAmount,
//       currency: "SAR",
//       timeline: {
//         estimatedDuration: 90,
//         proposedStartDate: data.expectedStartDate,
//         proposedEndDate: data.expectedEndDate,
//       },
//       description: data.details,
//       submittedAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       projectOwner: {
//         id: "owner-1",
//         name: "Project Owner",
//         rating: 4.5,
//       },
//       projectLocation: "Riyadh, Saudi Arabia",
//       projectType: "General",
//       canWithdraw: true,
//       canModify: true,
//       phases: data.phases,
//       paymentPlans: data.globalPaymentPlans,
//       hasWarranty: data.hasWarranty,
//       qualityCertificate: data.qualityCertificate,
//       offerValidity: {
//         value: data.offerValidityValue,
//         unit: data.offerValidityUnit,
//       },
//       executionDuration: {
//         value: data.executionDurationValue,
//         unit: data.executionDurationUnit,
//       },
//     };

//     mockContractorOffers.unshift(newOffer);
//     return newOffer;
//   },

//   // Update contractor's offer
//   updateContractorOffer: async (id: string, data: any) => {
//     await delay(800);

//     const offerIndex = mockContractorOffers.findIndex(
//       (offer) => offer.id === id
//     );
//     if (offerIndex === -1) {
//       throw new Error("Offer not found");
//     }

//     const updatedOffer = {
//       ...mockContractorOffers[offerIndex],
//       ...data,
//       updatedAt: new Date().toISOString(),
//     };

//     mockContractorOffers[offerIndex] = updatedOffer;
//     return updatedOffer;
//   },

//   // Withdraw contractor's offer
//   withdrawContractorOffer: async (id: string) => {
//     await delay(600);

//     const offerIndex = mockContractorOffers.findIndex(
//       (offer) => offer.id === id
//     );
//     if (offerIndex === -1) {
//       throw new Error("Offer not found");
//     }

//     const updatedOffer = {
//       ...mockContractorOffers[offerIndex],
//       status: "withdrawn" as const,
//       updatedAt: new Date().toISOString(),
//     };

//     mockContractorOffers[offerIndex] = updatedOffer;
//     return updatedOffer;
//   },

//   // Get contractor's offer by ID
//   getContractorOffer: async (id: string) => {
//     await delay(400);

//     const offer = mockContractorOffers.find((offer) => offer.id === id);
//     if (!offer) {
//       throw new Error("Offer not found");
//     }

//     return offer;
//   },

//   // Get available projects for bidding
//   getAvailableProjects: async (params: {
//     q?: string;
//     project_type_id?: number;
//     per_page?: number;
//   }): Promise<AvailableProjectsResponse> => {
//     await delay(600);

//     let filteredProjects = [...mockAvailableProjects];

//     // Apply search query
//     if (params.q) {
//       const searchTerm = params.q.toLowerCase();
//       filteredProjects = filteredProjects.filter(
//         (project) =>
//           project.title.toLowerCase().includes(searchTerm) ||
//           project.description.toLowerCase().includes(searchTerm) ||
//           project.location.toLowerCase().includes(searchTerm)
//       );
//     }

//     // Apply project type filter
//     if (params.project_type_id) {
//       // Map project type IDs to project types (this is just for mock data)
//       const typeMap: { [key: number]: string } = {
//         1: "Residential Construction",
//         2: "Commercial Construction",
//         3: "Industrial Construction",
//         4: "Infrastructure",
//       };
//       const projectType = typeMap[params.project_type_id];
//       if (projectType) {
//         filteredProjects = filteredProjects.filter(
//           (project) => project.type === projectType
//         );
//       }
//     }

//     // Apply pagination
//     const per_page = params.per_page || 15;
//     const startIndex = 0;
//     const endIndex = startIndex + per_page;

//     const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

//     return {
//       success: true,
//       message: "Data fetched successfully",
//       response: {
//         data: paginatedProjects,
//         total: filteredProjects.length,
//         per_page: per_page,
//         current_page: 1,
//         last_page: Math.ceil(filteredProjects.length / per_page),
//         from: 1,
//         to: paginatedProjects.length,
//         links: [],
//       },
//     } as AvailableProjectsResponse;
//   },
// };

// export const mockIndividualOffersService = {
//   // Get individual's received offers
//   getIndividualOffers: async (params: {
//     filters?: any;
//     page?: number;
//     limit?: number;
//   }) => {
//     await delay(500);

//     let filteredOffers = [...mockIndividualOffers];

//     // Apply filters
//     if (params.filters?.status) {
//       filteredOffers = filteredOffers.filter((offer) =>
//         params.filters.status.includes(offer.status)
//       );
//     }

//     if (params.filters?.minAmount) {
//       filteredOffers = filteredOffers.filter(
//         (offer) => offer.amount >= params.filters.minAmount
//       );
//     }

//     if (params.filters?.maxAmount) {
//       filteredOffers = filteredOffers.filter(
//         (offer) => offer.amount <= params.filters.maxAmount
//       );
//     }

//     if (params.filters?.contractorRating) {
//       filteredOffers = filteredOffers.filter(
//         (offer) =>
//           offer.contractorDetails.rating >= params.filters.contractorRating
//       );
//     }

//     // Apply pagination
//     const page = params.page || 1;
//     const limit = params.limit || 10;
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;

//     const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

//     return {
//       data: paginatedOffers,
//       total: filteredOffers.length,
//       totalPages: Math.ceil(filteredOffers.length / limit),
//       page,
//       limit,
//     };
//   },

//   // Get individual offer statistics
//   getIndividualOfferStats: async () => {
//     await delay(300);
//     return mockIndividualStats;
//   },

//   // Accept offer
//   acceptOffer: async (id: string) => {
//     await delay(800);

//     const offerIndex = mockIndividualOffers.findIndex(
//       (offer) => offer.id === id
//     );
//     if (offerIndex === -1) {
//       throw new Error("Offer not found");
//     }

//     const updatedOffer = {
//       ...mockIndividualOffers[offerIndex],
//       status: "accepted" as const,
//       updatedAt: new Date().toISOString(),
//     };

//     mockIndividualOffers[offerIndex] = updatedOffer;
//     return updatedOffer;
//   },

//   // Reject offer
//   rejectOffer: async (id: string, reason?: string) => {
//     await delay(600);

//     const offerIndex = mockIndividualOffers.findIndex(
//       (offer) => offer.id === id
//     );
//     if (offerIndex === -1) {
//       throw new Error("Offer not found");
//     }

//     const updatedOffer = {
//       ...mockIndividualOffers[offerIndex],
//       status: "rejected" as const,
//       updatedAt: new Date().toISOString(),
//     };

//     mockIndividualOffers[offerIndex] = updatedOffer;
//     return updatedOffer;
//   },

//   // Mark offer as viewed
//   markAsViewed: async (id: string) => {
//     await delay(300);

//     const offerIndex = mockIndividualOffers.findIndex(
//       (offer) => offer.id === id
//     );
//     if (offerIndex === -1) {
//       throw new Error("Offer not found");
//     }

//     const updatedOffer = {
//       ...mockIndividualOffers[offerIndex],
//       lastViewedAt: new Date().toISOString(),
//     };

//     mockIndividualOffers[offerIndex] = updatedOffer;
//     return updatedOffer;
//   },

//   // Request counter offer
//   requestCounterOffer: async (id: string, message: string) => {
//     await delay(800);

//     const offerIndex = mockIndividualOffers.findIndex(
//       (offer) => offer.id === id
//     );
//     if (offerIndex === -1) {
//       throw new Error("Offer not found");
//     }

//     const updatedOffer = {
//       ...mockIndividualOffers[offerIndex],
//       status: "counter_offer" as const,
//       updatedAt: new Date().toISOString(),
//     };

//     mockIndividualOffers[offerIndex] = updatedOffer;
//     return updatedOffer;
//   },

//   // Get individual's offer by ID
//   getIndividualOffer: async (id: string) => {
//     await delay(400);

//     const offer = mockIndividualOffers.find((offer) => offer.id === id);
//     if (!offer) {
//       throw new Error("Offer not found");
//     }

//     return offer;
//   },
// };
