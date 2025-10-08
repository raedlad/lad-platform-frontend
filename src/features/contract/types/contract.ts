export type ContractStatus =
  | "Waiting for Contract Draft"
  | "Awaiting Client Review"
  | "Awaiting Contractor Review"
  | "Awaiting Client Modification"
  | "Approved - Awaiting Signatures"
  | "Awaiting Contractor Signature"
  | "Signed - Active";

export type UserRole = "client" | "contractor";

export interface Project {
  id: number;
  title: string;
  status: string;
}

export interface Offer {
  id: number;
  contractor_name: string;
  offer_amount: number;
  duration: string;
}

export interface StandardClause {
  id: number;
  title: string;
  text: string;
}

export interface AdditionalClause {
  id: number | string;
  text: string;
}

export interface ContractVersion {
  versionNumber: number;
  modifiedBy: UserRole;
  modifiedAt: string;
  comment?: string;
}

export interface Contract {
  id: number;
  project: Project;
  offer: Offer;
  versionNumber: number;
  lastNegotiationComment: string | null;
  status: ContractStatus;
  standardClauses: StandardClause[];
  additionalClauses: AdditionalClause[];
  clientSignedPDF_URL: string | null;
  contractorSignedPDF_URL: string | null;
  versionHistory?: ContractVersion[];
  createdAt?: string;
  updatedAt?: string;
}
