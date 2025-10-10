// Project Execution Types

export type PhaseStatus = 
  | 'pending'           // Initial state
  | 'payment_sent'      // Client sent payment
  | 'payment_verified'  // Admin verified payment
  | 'funds_requested'   // Contractor requested funds
  | 'funds_released'    // Admin released funds
  | 'in_progress'       // Phase work in progress
  | 'completion_requested' // Contractor requested completion
  | 'completed';        // Client approved completion

export type ReportType = 'progress' | 'milestone' | 'issue' | 'additional';

export interface WorkReport {
  id: string;
  phaseId: string;
  type: ReportType;
  title: string;
  description: string;
  files: string[];
  uploadedBy: 'contractor' | 'client';
  uploadedAt: Date;
  requestedBy?: string; // If client requested additional report
}

export interface ReportRequest {
  id: string;
  phaseId: string;
  message: string;
  requestedBy: string;
  requestedAt: Date;
  fulfilledAt?: Date;
  status: 'pending' | 'fulfilled';
}

export interface ProjectPhase {
  id: string;
  number: number;
  name: string;
  description: string;
  budget: number;
  duration: number; // in days
  status: PhaseStatus;
  startDate?: Date;
  endDate?: Date;
  paymentDate?: Date;
  paymentVerifiedDate?: Date;
  fundsRequestedDate?: Date;
  fundsReleasedDate?: Date;
  completionRequestedDate?: Date;
  completedDate?: Date;
  reports: WorkReport[];
  reportRequests?: ReportRequest[]; // Track client report requests
}

export interface ProjectExecution {
  id: string;
  projectId: string;
  contractId: string;
  projectName: string;
  clientName: string;
  contractorName: string;
  totalBudget: number;
  phases: ProjectPhase[];
  currentPhaseIndex: number;
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

export interface ExecutionAction {
  type: 
    | 'send_payment'
    | 'verify_payment'
    | 'request_funds'
    | 'release_funds'
    | 'upload_report'
    | 'request_report'
    | 'request_completion'
    | 'approve_completion';
  phaseId: string;
  timestamp: Date;
  performedBy: string;
  details?: any;
}

export interface PaymentInfo {
  phaseId: string;
  amount: number;
  transactionId?: string;
  paymentMethod?: string;
  status: 'pending' | 'sent' | 'verified' | 'failed';
}
