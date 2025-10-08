import { Contract } from "../types/contract";
import { mockContract } from "../mock/contract.mock";

// Mock service functions that would normally call APIs
export const contractService = {
  // Fetch contract by ID
  getContract: async (contractId: number): Promise<Contract> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would be:
    // const { data } = await api.get(`/contracts/${contractId}`);
    // return data;

    return { ...mockContract, id: contractId };
  },

  // Update contract clauses
  updateAdditionalClauses: async (
    contractId: number,
    clauses: Contract["additionalClauses"]
  ): Promise<Contract> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // In real implementation, this would be:
    // const { data } = await api.put(`/contracts/${contractId}/clauses`, { clauses });
    // return data;

    return {
      ...mockContract,
      additionalClauses: clauses,
      updatedAt: new Date().toISOString(),
    };
  },

  // Send contract to other party
  sendContract: async (contractId: number): Promise<Contract> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would be:
    // const { data } = await api.post(`/contracts/${contractId}/send`);
    // return data;

    return {
      ...mockContract,
      status: "Awaiting Contractor Review",
      versionNumber: mockContract.versionNumber + 1,
    };
  },

  // Request changes
  requestChanges: async (
    contractId: number,
    comment: string
  ): Promise<Contract> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would be:
    // const { data } = await api.post(`/contracts/${contractId}/request-changes`, { comment });
    // return data;

    return {
      ...mockContract,
      status: "Awaiting Client Modification",
      lastNegotiationComment: comment,
      versionNumber: mockContract.versionNumber + 1,
    };
  },

  // Approve contract
  approveContract: async (contractId: number): Promise<Contract> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would be:
    // const { data } = await api.post(`/contracts/${contractId}/approve`);
    // return data;

    return {
      ...mockContract,
      status: "Approved - Awaiting Signatures",
      versionNumber: mockContract.versionNumber + 1,
    };
  },

  // Sign contract
  signContract: async (
    contractId: number,
    role: "client" | "contractor"
  ): Promise<Contract> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    // In real implementation, this would be:
    // const { data } = await api.post(`/contracts/${contractId}/sign`, { role });
    // return data;

    const updates: Partial<Contract> = {
      versionNumber: mockContract.versionNumber + 1,
    };

    if (role === "client") {
      updates.status = "Awaiting Contractor Signature";
      updates.clientSignedPDF_URL = `/mock-pdf/client-signed-${Date.now()}.pdf`;
    } else {
      updates.status = "Signed - Active";
      updates.contractorSignedPDF_URL = `/mock-pdf/contractor-signed-${Date.now()}.pdf`;
    }

    return {
      ...mockContract,
      ...updates,
    };
  },

  // Generate PDF preview
  generatePDFPreview: async (contractId: number): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real implementation, this would be:
    // const { data } = await api.get(`/contracts/${contractId}/pdf-preview`);
    // return data.url;

    return `/mock-pdf/contract-preview-${contractId}-${Date.now()}.pdf`;
  },
};
