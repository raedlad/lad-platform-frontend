import { useState, useCallback, useEffect } from "react";
import { useContractStore } from "../store/useContractStore";
import { contractService } from "../services/contractApi";
import { AdditionalClause } from "../types/contract";
import { toast } from "sonner";

export const useContractManagement = (contractId?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  const {
    contract,
    currentRole,
    updateAdditionalClauses,
    sendToOtherParty,
    requestChanges,
    approveContract,
    signContract,
  } = useContractStore();

  // Load contract on mount
  useEffect(() => {
    if (contractId) {
      loadContract(contractId);
    }
  }, [contractId]);

  const loadContract = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const data = await contractService.getContract(id);
      // In real app, we would update the store with fetched data
      toast.success("Contract loaded successfully");
    } catch (error) {
      toast.error("Failed to load contract");
      console.error("Error loading contract:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveAdditionalClauses = useCallback(async (clauses: AdditionalClause[]) => {
    setIsLoading(true);
    try {
      await contractService.updateAdditionalClauses(contract.id, clauses);
      updateAdditionalClauses(clauses);
      toast.success("Additional clauses updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update clauses");
      console.error("Error updating clauses:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract.id, updateAdditionalClauses]);

  const sendToContractor = useCallback(async () => {
    setIsLoading(true);
    try {
      await contractService.sendContract(contract.id);
      sendToOtherParty();
      toast.success("Contract sent to contractor successfully");
      return true;
    } catch (error) {
      toast.error("Failed to send contract");
      console.error("Error sending contract:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract.id, sendToOtherParty]);

  const submitChangeRequest = useCallback(async (comment: string) => {
    setIsLoading(true);
    try {
      await contractService.requestChanges(contract.id, comment);
      requestChanges(comment);
      toast.success("Change request submitted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to submit change request");
      console.error("Error requesting changes:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract.id, requestChanges]);

  const approveContractAction = useCallback(async () => {
    setIsLoading(true);
    try {
      await contractService.approveContract(contract.id);
      approveContract();
      toast.success("Contract approved successfully");
      return true;
    } catch (error) {
      toast.error("Failed to approve contract");
      console.error("Error approving contract:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract.id, approveContract]);

  const signContractAction = useCallback(async () => {
    setIsLoading(true);
    try {
      await contractService.signContract(contract.id, currentRole);
      signContract();
      toast.success(`Contract signed successfully by ${currentRole}`);
      return true;
    } catch (error) {
      toast.error("Failed to sign contract");
      console.error("Error signing contract:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [contract.id, currentRole, signContract]);

  const generatePDFPreview = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = await contractService.generatePDFPreview(contract.id);
      setPdfUrl(url);
      toast.success("PDF preview generated");
      return url;
    } catch (error) {
      toast.error("Failed to generate PDF preview");
      console.error("Error generating PDF:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [contract.id]);

  // Check if user can perform actions
  const canEdit = currentRole === "client" && 
    (contract.status === "Awaiting Client Review" || 
     contract.status === "Awaiting Client Modification");

  const canSend = currentRole === "client" && 
    (contract.status === "Awaiting Client Review" || 
     contract.status === "Awaiting Client Modification");

  const canRequestChanges = currentRole === "contractor" && 
    contract.status === "Awaiting Contractor Review";

  const canApprove = currentRole === "contractor" && 
    contract.status === "Awaiting Contractor Review";

  const canSign = 
    (currentRole === "client" && contract.status === "Approved - Awaiting Signatures") ||
    (currentRole === "contractor" && contract.status === "Awaiting Contractor Signature");

  return {
    contract,
    currentRole,
    isLoading,
    pdfUrl,
    
    // Actions
    loadContract,
    saveAdditionalClauses,
    sendToContractor,
    submitChangeRequest,
    approveContractAction,
    signContractAction,
    generatePDFPreview,
    
    // Permissions
    canEdit,
    canSend,
    canRequestChanges,
    canApprove,
    canSign,
  };
};
