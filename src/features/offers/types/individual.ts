import { Offer, OfferStatus, OfferAttachment } from "./offer";

export interface IndividualOffer extends Offer {
  projectDetails: {
    id: string;
    title: string;
    type: string;
    location: string;
    timeline: {
      startDate: string;
      endDate: string;
    };
  };
  negotiationHistory?: NegotiationEvent[];
  contractorDetails: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
    completedProjects: number;
    specialties: string[];
    location: string;
  };
  canAccept: boolean;
  canReject: boolean;
  canCounterOffer: boolean;
  lastViewedAt?: string;
}

export interface NegotiationEvent {
  id: string;
  type: 'offer' | 'counter_offer' | 'message' | 'acceptance' | 'rejection';
  timestamp: string;
  actor: 'owner' | 'contractor';
  message?: string;
  amount?: number;
  details?: any;
}

export interface IndividualOfferStats {
  totalReceived: number;
  pending: number;
  accepted: number;
  rejected: number;
  averageOfferValue: number;
  averageResponseTime: number; // in hours
  totalProjectValue: number;
}

export interface IndividualOfferFilters {
  status?: OfferStatus[];
  projectId?: string;
  minAmount?: number;
  maxAmount?: number;
  contractorRating?: number;
  dateFrom?: string;
  dateTo?: string;
  hasViewed?: boolean;
}
