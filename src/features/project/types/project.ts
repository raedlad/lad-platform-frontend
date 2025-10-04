export interface ProjectStatus {
  status:
    | "draft"
    | "review_pending"
    | "published"
    | "receiving_bids"
    | "offer_accepted"
    | "awaiting_contract_signature"
    | "contract_signed"
    | "in_progress"
    | "cancelled"
    | "rejected"
    | "completed"
    | "closed_completed";
}

export interface Project {
  id: string;
  essential_info: ProjectEssentialInfo;
  classification: ProjectClassification;
  documents: DocumentsState;
  status: ProjectStatus;
  publish_settings: PublishSettings;
  boq: BOQData;
}

export interface UserProject {
  project: Project;
  created_at: string;
  updated_at: string;
}

export interface ProjectEssentialInfo {
  title: string;
  project_type_id: number; // Just the ID, not the full object
  city_id: string;
  district: string;
  address_line: string;
  latitude?: number;
  longitude?: number;
  budget_min: number;
  budget_max: number;
  budget_unit: string;
  duration_value: number;
  duration_unit: string;
  area_sqm: number;
  description: string;
  project_type_name?: string;
  city_name?: string;
  full_address?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  client_id?: string;
}

export interface ProjectClassificationJob {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}
export interface WorkType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface Level {
  id: number;
  level: number;
  label: string;
  sort_order: number;
}
export interface ProjectClassification {
  id: number;
  jobId: number; // Just the ID, not the full object
  workTypeId: number; // Just the ID, not the full object
  levelId: number; // Just the ID, not the full object
  notes: string;
}

export interface ProjectType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentFile {
  id: string;
  file: File | null; // Can be null when loaded from backend
  name: string;
  size: number;
  type: string;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadProgress: number;
  url?: string;
  error?: string;
}

export interface DocumentsState {
  architectural_plans: DocumentFile[];
  licenses: DocumentFile[];
  specifications: DocumentFile[];
  site_photos: DocumentFile[];
}

export interface BOQItem {
  id?: string;
  name: string;
  description: string;
  unit_id: number;
  quantity: number;
  unit_price: number;
  sort_order: number;
  is_required: boolean;
}

// API Response types for BOQ Template
export interface BOQTemplateItem {
  id: number;
  template_id: string;
  name: string;
  description: string;
  unit_id: string;
  default_qty: number;
  default_price: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BOQTemplateBase {
  id: number;
  name: string;
  project_type_id: string;
  classification_job_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Template with items merged
export interface BOQTemplate extends BOQTemplateBase {
  items: BOQTemplateItem[];
}

export interface BOQTemplatesApiResponse {
  success: boolean;
  message: string;
  response: BOQTemplateBase[];
}

export interface BOQTemplateItemsApiResponse {
  success: boolean;
  message: string;
  response: BOQTemplateItem[];
}

export interface Unit {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UnitsApiResponse {
  success: boolean;
  message: string;
  response: Unit[];
}

export interface BOQData {
  id?: number; // BOQ ID for updates
  items: BOQItem[];
  total_amount: number;
  template_id?: number;
}

// Form data type for BOQ item creation/editing
export type BOQItemFormData = Omit<BOQItem, "id">;

export interface PublishSettings {
  notify_matching_contractors: boolean;
  notify_client_on_offer: boolean;
  offers_window_days: number;
}

// Client and Contractor Types
export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface Contractor {
  id: number;
  name: string;
  email: string;
}

// Media Stats Type
export interface MediaStats {
  documents: number;
  images: number;
  attachments: number;
  drawings: number;
  specifications: number;
  licenses: number;
  architectural_plans: number;
  technical_specs: number;
  site_photos: number;
  total: number;
}

// API Response Types
export interface ProjectResponse {
  id: number;
  client_id: string;
  contractor_id: string | null;
  title: string;
  project_type_id: string;
  description: string;
  area_sqm: number;
  duration_value: string;
  duration_unit: string;
  budget_min: number | null;
  budget_max: number | null;
  status: string;
  publish_at: string | null;
  offers_deadline_at: string | null;
  settings_json: any | null;
  is_active: boolean;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
  client: Client;
  contractor: Contractor | null;
  type: ProjectType;
  location: any | null;
  publishing_setting: any | null;
  review_requests: any[];
  required_classifications: any[];
  boqs: any[];
  excel_imports: any[];
  execution_summary: any | null;
  offers: any[];
  contracts: any[];
  media_stats: MediaStats;
  documents: any[];
  images: any[];
  attachments: any[];
  boq_files: any[];
  technical_drawings: any[];
  specifications: any[];
  architectural_plans: any[];
  licenses: any[];
  site_photos: any[];
}

export interface GetProjectApiResponse {
  success: boolean;
  message: string;
  response: ProjectResponse | null;
}

export interface CreateProjectApiResponse {
  success: boolean;
  message: string;
  response: ProjectResponse | null;
}

export interface UpdateProjectApiResponse {
  success: boolean;
  message: string;
  data: ProjectResponse | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  response?: T;
  data?: T;
}

export interface PaginatedApiResponse<T = unknown> {
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
    links: any[];
  };
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  data: {
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    collection: string;
    url: string;
  } | null;
}

export interface RemoveFileResponse {
  success: boolean;
  message: string;
}
