import { create } from "zustand";
import {
  Contract,
  ContractStatus,
  UserRole,
  ContractVersion,
  AdditionalClause,
} from "../types/contract";
import { generateMockPDF, mockContract } from "../mock/contract.mock";
import { generateContractPDF as generatePDF } from "../utils/pdfGenerator";

interface ContractStore {
  // State
  contract: Contract;
  currentRole: UserRole;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  lastOtpTime: number | null;

  // Actions
  setRole: (role: UserRole) => void;
  updateAdditionalClauses: (clauses: AdditionalClause[]) => void;
  addAdditionalClause: (text: string) => void;
  removeAdditionalClause: (id: string | number) => void;
  sendToOtherParty: () => void;
  requestChanges: (comment: string) => void;
  approveContract: () => void;
  rejectContract: () => void;
  signContract: () => void;
  issueOtpForSigning: () => Promise<void>;
  verifyOtpAndUploadSignedFile: (file: File, otpCode: string) => Promise<void>;
  generateContractPDF: () => Promise<Blob>;
  resetContract: () => void;
}

const getNextStatus = (
  currentStatus: ContractStatus,
  action: string,
  role: UserRole
): ContractStatus => {
  switch (currentStatus) {
    case "Waiting for Contract Draft":
      if (action === "draft_created") return "Awaiting Client Review";
      break;

    case "Awaiting Client Review":
      if (action === "send" && role === "client")
        return "Awaiting Contractor Review";
      break;

    case "Awaiting Contractor Review":
      if (action === "request_changes" && role === "contractor")
        return "Awaiting Client Modification";
      if (action === "approve" && role === "contractor")
        return "Approved - Awaiting Signatures";
      break;

    case "Awaiting Client Modification":
      if (action === "send" && role === "client")
        return "Awaiting Contractor Review";
      break;

    case "Approved - Awaiting Signatures":
      if (action === "sign" && role === "client")
        return "Awaiting Contractor Signature";
      break;

    case "Awaiting Contractor Signature":
      if (action === "sign" && role === "contractor") return "Signed - Active";
      break;
  }
  return currentStatus;
};

const addVersionHistory = (
  contract: Contract,
  role: UserRole,
  comment?: string
): ContractVersion => {
  return {
    versionNumber: contract.versionNumber + 1,
    modifiedBy: role,
    modifiedAt: new Date().toISOString(),
    comment,
  };
};

export const useContractStore = create<ContractStore>((set, get) => ({
  // Initial State
  contract: mockContract,
  currentRole: "client",
  loading: false,
  error: null,
  otpSent: false,
  lastOtpTime: null,

  // Actions
  setRole: (role: UserRole) => {
    set({ currentRole: role });
  },

  updateAdditionalClauses: (clauses: AdditionalClause[]) => {
    set((state) => ({
      contract: {
        ...state.contract,
        additionalClauses: clauses,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  addAdditionalClause: (text: string) => {
    set((state) => {
      const newClause: AdditionalClause = {
        id: `add-${Date.now()}`,
        text,
      };
      return {
        contract: {
          ...state.contract,
          additionalClauses: [...state.contract.additionalClauses, newClause],
          updatedAt: new Date().toISOString(),
        },
      };
    });
  },

  removeAdditionalClause: (id: string | number) => {
    set((state) => ({
      contract: {
        ...state.contract,
        additionalClauses: state.contract.additionalClauses.filter(
          (clause) => clause.id !== id
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  sendToOtherParty: () => {
    const { contract, currentRole } = get();

    // Only client can send in certain states
    if (currentRole !== "client") {
      set({ error: "Only client can send the contract to contractor" });
      return;
    }

    const allowedStates: ContractStatus[] = [
      "Awaiting Client Review",
      "Awaiting Client Modification",
    ];

    if (!allowedStates.includes(contract.status)) {
      set({ error: "Cannot send contract in current state" });
      return;
    }

    const newStatus = getNextStatus(contract.status, "send", currentRole);
    const newVersion = addVersionHistory(
      contract,
      currentRole,
      "Contract sent to contractor for review"
    );

    set((state) => ({
      contract: {
        ...state.contract,
        status: newStatus,
        versionNumber: state.contract.versionNumber + 1,
        versionHistory: [...(state.contract.versionHistory || []), newVersion],
        lastNegotiationComment: null,
        updatedAt: new Date().toISOString(),
      },
      error: null,
    }));
  },

  requestChanges: (comment: string) => {
    const { contract, currentRole } = get();

    if (currentRole !== "contractor") {
      set({ error: "Only contractor can request changes" });
      return;
    }

    if (contract.status !== "Awaiting Contractor Review") {
      set({ error: "Cannot request changes in current state" });
      return;
    }

    const newStatus = getNextStatus(
      contract.status,
      "request_changes",
      currentRole
    );
    const newVersion = addVersionHistory(contract, currentRole, comment);

    set((state) => ({
      contract: {
        ...state.contract,
        status: newStatus,
        versionNumber: state.contract.versionNumber + 1,
        versionHistory: [...(state.contract.versionHistory || []), newVersion],
        lastNegotiationComment: comment,
        updatedAt: new Date().toISOString(),
      },
      error: null,
    }));
  },

  approveContract: () => {
    const { contract, currentRole } = get();

    if (currentRole !== "contractor") {
      set({ error: "Only contractor can approve the contract" });
      return;
    }

    if (contract.status !== "Awaiting Contractor Review") {
      set({ error: "Cannot approve contract in current state" });
      return;
    }

    const newStatus = getNextStatus(contract.status, "approve", currentRole);
    const newVersion = addVersionHistory(
      contract,
      currentRole,
      "Contract approved by contractor"
    );

    set((state) => ({
      contract: {
        ...state.contract,
        status: newStatus,
        versionNumber: state.contract.versionNumber + 1,
        versionHistory: [...(state.contract.versionHistory || []), newVersion],
        updatedAt: new Date().toISOString(),
      },
      error: null,
    }));
  },

  signContract: () => {
    const { contract, currentRole } = get();

    // Check if client can sign
    if (
      currentRole === "client" &&
      contract.status === "Approved - Awaiting Signatures"
    ) {
      const newStatus = getNextStatus(contract.status, "sign", currentRole);
      const pdfUrl = generateMockPDF("client");
      const newVersion = addVersionHistory(
        contract,
        currentRole,
        "Contract signed by client"
      );

      set((state) => ({
        contract: {
          ...state.contract,
          status: newStatus,
          clientSignedPDF_URL: pdfUrl,
          versionNumber: state.contract.versionNumber + 1,
          versionHistory: [
            ...(state.contract.versionHistory || []),
            newVersion,
          ],
          updatedAt: new Date().toISOString(),
        },
        error: null,
      }));
      return;
    }

    // Check if contractor can sign
    if (
      currentRole === "contractor" &&
      contract.status === "Awaiting Contractor Signature"
    ) {
      const newStatus = getNextStatus(contract.status, "sign", currentRole);
      const pdfUrl = generateMockPDF("contractor");
      const newVersion = addVersionHistory(
        contract,
        currentRole,
        "Contract signed by contractor - Contract is now active"
      );

      set((state) => ({
        contract: {
          ...state.contract,
          status: newStatus,
          contractorSignedPDF_URL: pdfUrl,
          versionNumber: state.contract.versionNumber + 1,
          versionHistory: [
            ...(state.contract.versionHistory || []),
            newVersion,
          ],
          updatedAt: new Date().toISOString(),
        },
        error: null,
      }));
      return;
    }

    set({ error: "Cannot sign contract in current state or role" });
  },

  rejectContract: () => {
    const { contract, currentRole } = get();

    const newVersion = addVersionHistory(
      contract,
      currentRole,
      `Contract rejected by ${currentRole}`
    );

    set((state) => ({
      contract: {
        ...state.contract,
        status: "Awaiting Client Modification",
        versionNumber: state.contract.versionNumber + 1,
        versionHistory: [...(state.contract.versionHistory || []), newVersion],
        updatedAt: new Date().toISOString(),
      },
      error: null,
    }));
  },

  issueOtpForSigning: async () => {
    set({ loading: true, error: null });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock OTP generation (in real app, this would call the backend)
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Mock OTP generated:", mockOtp); // For testing purposes

      set({
        otpSent: true,
        lastOtpTime: Date.now(),
        loading: false,
      });
    } catch (error) {
      set({
        error: "Failed to send OTP",
        loading: false,
      });
      throw error;
    }
  },

  verifyOtpAndUploadSignedFile: async (file: File, otpCode: string) => {
    set({ loading: true, error: null });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock OTP verification (in real app, this would verify with backend)
      if (otpCode !== "123456") {
        console.log("Invalid OTP");
        // Mock OTP for testing
        throw new Error("Invalid OTP");
      }

      const { contract, currentRole } = get();
      const pdfUrl = generateMockPDF(currentRole);
      const newVersion = addVersionHistory(
        contract,
        currentRole,
        `Contract signed by ${currentRole} with uploaded PDF`
      );

      let newStatus: ContractStatus;
      let updates: Partial<Contract> = {};

      if (currentRole === "client") {
        newStatus = "Awaiting Contractor Signature";
        updates.clientSignedPDF_URL = pdfUrl;
      } else {
        newStatus = "Signed - Active";
        updates.contractorSignedPDF_URL = pdfUrl;
      }

      set((state) => ({
        contract: {
          ...state.contract,
          ...updates,
          status: newStatus,
          versionNumber: state.contract.versionNumber + 1,
          versionHistory: [
            ...(state.contract.versionHistory || []),
            newVersion,
          ],
          updatedAt: new Date().toISOString(),
        },
        loading: false,
        otpSent: false,
        lastOtpTime: null,
      }));
    } catch (error) {
      set({
        error: "OTP verification failed",
        loading: false,
      });
      throw error;
    }
  },

  generateContractPDF: async () => {
    const { contract } = get();
    console.log("🏪 STORE: generateContractPDF called, delegating to utils...");

    // Use the real PDF generator from utils
    try {
      const pdfBlob = await generatePDF(contract);
      console.log("🏪 STORE: Real PDF generated successfully!");
      return pdfBlob;
    } catch (error) {
      console.error(
        "🏪 STORE: Real PDF generation failed, using fallback:",
        error
      );

      // Fallback to simple text-based "PDF" if real generation fails
      const pdfContent = `
CONTRACT AGREEMENT - عقد اتفاقية

Project: ${contract.project.title}
المشروع: ${contract.project.title}

Contractor: ${contract.offer.contractor_name}
المقاول: ${contract.offer.contractor_name}

Amount: ${contract.offer.offer_amount} SAR
المبلغ: ${contract.offer.offer_amount} ريال سعودي

Duration: ${contract.offer.duration}
المدة: ${contract.offer.duration}

Version: ${contract.versionNumber}
الإصدار: ${contract.versionNumber}

Status: ${contract.status}
الحالة: ${contract.status}

STANDARD CLAUSES - البنود القياسية:
${contract.standardClauses
  .map((c, i) => `${i + 1}. ${c.title}: ${c.text}`)
  .join("\n")}

ADDITIONAL CLAUSES - البنود الإضافية:
${contract.additionalClauses.map((c, i) => `${i + 1}. ${c.text}`).join("\n")}

Generated on: ${new Date().toLocaleString("ar-SA")}
تم الإنشاء في: ${new Date().toLocaleString("ar-SA")}
      `;

      return new Blob([pdfContent], { type: "application/pdf" });
    }
  },

  resetContract: () => {
    set({
      contract: mockContract,
      currentRole: "client",
      loading: false,
      error: null,
      otpSent: false,
      lastOtpTime: null,
    });
  },
}));
