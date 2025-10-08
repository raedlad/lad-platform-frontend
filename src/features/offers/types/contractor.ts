import { Offer, OfferStatus } from "./offer";

export interface ContractorOffer extends Offer {
  projectOwner: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
  };
  projectLocation: string;
  projectType: string;
  canWithdraw: boolean;
  canModify: boolean;
  lastViewedAt?: string;
}

export interface ContractorOfferStats {
  totalSubmitted: number;
  pending: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  successRate: number;
  averageResponseTime: number; // in hours
  totalEarnings: number;
}

export interface ContractorOfferFilters {
  status?: OfferStatus[];
  projectType?: string[];
  location?: string[];
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  hasResponse?: boolean;
}

export interface ContractorOffersAllQueryParams {
  status?: string[];
  statuses?: string;
  project_id?: number;
  project_ids?: number[];
  project_title?: string;
  project_type_id?: number;
  project_status?: string;
  project_client_id?: number;
  country_id?: number;
  city_id?: number;
  has_warranty?: boolean;
  has_quality_certificate?: boolean;
  quality_certificate?: string;
  offer_amount_min?: number;
  offer_amount_max?: number;
  execution_duration_unit?: 'days' | 'weeks' | 'months';
  execution_duration_value_min?: number;
  execution_duration_value_max?: number;
  offer_validity_unit?: 'days' | 'weeks' | 'months';
  offer_validity_value_min?: number;
  offer_validity_value_max?: number;
  submitted_from?: string;
  submitted_to?: string;
  created_from?: string;
  created_to?: string;
  expected_start_from?: string;
  expected_start_to?: string;
  expected_end_from?: string;
  expected_end_to?: string;
  has_negotiations?: boolean;
  negotiations_count_min?: number;
  negotiations_count_max?: number;
  has_files?: boolean;
  is_locked?: boolean;
  is_rejected?: boolean;
  is_accepted?: boolean;
  search?: string;
  include?: string;
  sort_by?: 'created_at' | 'updated_at' | 'submitted_at' | 'offer_amount' | 'execution_duration_value' | 'offer_validity_value' | 'expected_start_date' | 'expected_end_date' | 'negotiations_count';
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface AvailableProject {
  id: number;
  title: string;
  project_type_id: number;
  description: string;
  area_sqm: number;
  duration_value: number;
  duration_unit: string;
  budget_min: number;
  budget_max: number;
  status: string;
  publish_at: string;
  offers_deadline_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  type: {
    id: number;
    name: string;
    description: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  location: {
    id: number;
    project_id: number;
    country_id: number;
    country_name: string | null;
    city_id: number;
    city_name: string;
    district: string;
    address_line: string;
    latitude: number;
    longitude: number;
    map_snapshot_url: string | null;
    created_at: string | null;
    updated_at: string | null;
    coordinates: {
      lat: number;
      lng: number;
    };
    full_address: string;
  };
  status_info: {
    current_status: string;
    is_published: boolean;
    is_accepting_offers: boolean;
    days_until_deadline: number;
  };
  budget_display: string;
}

export interface AvailableProjectsResponse {
  success: boolean;
  message: string;
  response: {
    data: AvailableProject[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    links: any[];
  };
}
