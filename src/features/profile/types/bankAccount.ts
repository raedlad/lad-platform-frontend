// Bank Account Types
export interface BankType {
  id: number;
  name: string;
  name_ar?: string;
  code: string;
  swift_code?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  bank_type_id: number;
  bank_type?: BankType;
  full_name: string;
  account_number: string;
  iban: string;
  branch_name?: string;
  branch_code?: string;
  swift_bic?: string;
  qr_media_ref?: string;
  external_account_id?: string;
  is_primary: boolean;
  is_verified: boolean;
  status: 'pending' | 'verified' | 'rejected';
  verification_notes?: string;
  verified_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateBankAccountData {
  bank_type_id: number;
  full_name: string;
  account_number: string;
  iban: string;
  branch_name?: string;
  branch_code?: string;
  swift_bic?: string;
  qr_media_ref?: string;
  external_account_id?: string;
  is_primary?: boolean;
  status?: 'pending' | 'verified' | 'rejected';
}

export interface UpdateBankAccountData extends Partial<CreateBankAccountData> {
  is_primary?: boolean;
}

export interface BankAccountsState {
  accounts: BankAccount[];
  primaryAccount: BankAccount | null;
  bankTypes: BankType[];
  selectedAccount: BankAccount | null;
  isLoading: boolean;
  error: string | null;
}

export interface BankAccountApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
}

// Transform functions for API data
export const transformBankAccountFromApi = (data: any): BankAccount => {
  return {
    id: data.id,
    user_id: data.user_id,
    bank_type_id: data.bank_type_id,
    bank_type: data.bank_type,
    full_name: data.full_name || data.account_holder_name,
    account_number: data.account_number,
    iban: data.iban,
    branch_name: data.branch_name,
    branch_code: data.branch_code,
    swift_bic: data.swift_bic || data.swift_code,
    qr_media_ref: data.qr_media_ref,
    external_account_id: data.external_account_id,
    is_primary: data.is_primary,
    is_verified: data.is_verified,
    status: data.status || data.verification_status,
    verification_notes: data.verification_notes,
    verified_at: data.verified_at,
    rejected_at: data.rejected_at,
    rejection_reason: data.rejection_reason,
    metadata: data.metadata,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const transformBankTypeFromApi = (data: any): BankType => {
  return {
    id: data.id,
    name: data.name,
    name_ar: data.name_ar,
    code: data.code,
    swift_code: data.swift_code,
    is_active: data.is_active,
    sort_order: data.sort_order,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};
