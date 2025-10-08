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
  notes?: string;
  terms?: string;
  phases?: OfferPhase[];
  paymentPlans?: OfferPaymentPlan[];
  hasWarranty?: boolean;
  offerValidity?: {
    value: number;
    unit: string;
  };
  executionDuration?: {
    value: number;
    unit: string;
  };
  files?: string[];
}

export type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "counter_offer"
  | "expired";

export interface OfferAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface OfferPaymentPlan {
  id?: string;
  name: string;
  amount: number;
  percentageOfContract: number;
  dueOn: string;
  sortOrder: number;
  userBankAccountId: number;
  referenceNote?: string;
}

export interface OfferPhase {
  id?: string;
  title: string;
  description: string;
  order: number;
  paymentPlans: OfferPaymentPlan[];
}

export interface OfferSummary {
  totalOffers: number;
  pendingOffers: number;
  acceptedOffers: number;
  rejectedOffers: number;
  withdrawnOffers: number;
  averageOfferValue: number;
  totalValue: number;
}

export interface CreateOfferRequest {
  projectId: string;
  amount: number;
  currency: string;
  timeline: {
    estimatedDuration: number;
    proposedStartDate: string;
    proposedEndDate: string;
  };
  description: string;
  attachments?: File[];
  notes?: string;
  terms?: string;
}

// New complete offer request for the API
export interface CreateCompleteOfferRequest {
  projectId: string;
  offerAmount: number;
  offerValidityValue: number;
  offerValidityUnit: string;
  executionDurationValue: number;
  executionDurationUnit: string;
  expectedStartDate: string;
  expectedEndDate: string;
  details: string;
  hasWarranty?: boolean;
  files?: File[];
  phases: OfferPhase[];
}

export interface OfferPhaseFormData {
  title: string;
  description: string;
  order: number;
  paymentPlans: OfferPaymentPlan[];
}

export interface OfferPaymentPlanFormData {
  name: string;
  amount: number;
  percentageOfContract: number;
  dueOn: string;
  sortOrder: number;
  userBankAccountId: number;
  referenceNote?: string;
}

export interface UpdateOfferRequest {
  amount?: number;
  timeline?: {
    estimatedDuration: number;
    proposedStartDate: string;
    proposedEndDate: string;
  };
  description?: string;
  notes?: string;
  terms?: string;
}

export interface UpdateCompleteOfferRequest {
  offerAmount?: number;
  offerValidityValue?: number;
  offerValidityUnit?: string;
  executionDurationValue?: number;
  executionDurationUnit?: string;
  expectedStartDate?: string;
  expectedEndDate?: string;
  details?: string;
  hasWarranty?: boolean;
  files?: File[];
  phases?: OfferPhase[];
}

export interface OfferFilters {
  status?: OfferStatus[];
  projectId?: string;
  contractorId?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface OfferSortOptions {
  field: "submittedAt" | "amount" | "status" | "projectTitle";
  direction: "asc" | "desc";
}
