// Components
export { ContractStatusBar } from "./components/ContractStatusBar";
export { ContractViewer } from "./components/ContractViewer";
export { AdditionalClausesEditor } from "./components/AdditionalClausesEditor";
export { ContractActions } from "./components/ContractActions";
export { NegotiationTimeline } from "./components/NegotiationTimeline";
export { RoleSwitcher } from "./components/RoleSwitcher";
export { ContractUploadDialog } from "./components/ContractUploadDialog";

// Pages
export { default as ContractPage } from "./pages/ContractPage";

// Hooks
export { useContractManagement } from "./hooks/useContractManagement";

// Store
export { useContractStore } from "./store/useContractStore";

// Services
export { contractService } from "./services/contractApi";

// Types
export type {
  Contract,
  ContractStatus,
  UserRole,
  Project,
  Offer,
  StandardClause,
  AdditionalClause,
  ContractVersion,
} from "./types/contract";

// Mock
export {
  mockContract,
  mockVersionHistory,
  generateMockPDF,
} from "./mock/contract.mock";

// Utils
export {
  generateContractPDF,
  downloadContractPDF,
  previewContractPDF,
} from "./utils/pdfGenerator";
