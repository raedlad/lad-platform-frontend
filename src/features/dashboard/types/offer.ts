export interface Offer {
  id: string;
  projectId: string;
  projectTitle: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  status: OfferStatus;
  amount: number;
  currency: string;
  timeline: {
    estimatedDuration: number;
    proposedStartDate: string;
    proposedEndDate: string;
  };
  description: string;
  attachments?: OfferAttachment[];
  submittedAt: string;
  updatedAt: string;
  isCounterOffer?: boolean;
  originalOfferId?: string;
}

export type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "counter_offer";

export interface OfferAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface OfferSummary {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  rejectedOffers: number;
  averageOfferValue: number;
}
