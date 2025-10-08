// hooks/useBankAccounts.ts
"use client";

import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { useBankAccountStore } from "../store/bankAccountStore";
import type { BankAccount, CreateBankAccountData, UpdateBankAccountData } from "../types/bankAccount";
import  {createProfileValidationSchemas}  from "@/features/profile/utils/validation";

interface UseBankAccountsOptions {
  autoFetch?: boolean;
  fetchBankTypes?: boolean;
  fetchPrimary?: boolean;
}

export function useBankAccounts(options: UseBankAccountsOptions = {}) {
  const { 
    autoFetch = true, 
    fetchBankTypes = true,
    fetchPrimary = false 
  } = options;

  const t = useTranslations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    accounts,
    primaryAccount,
    bankTypes,
    selectedAccount,
    isLoading,
    error,
    clearError,
    fetchAllAccounts,
    fetchAccountDetails,
    fetchBankTypes: fetchTypes,
    fetchPrimaryAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    setPrimaryAccountById,
    verifyAccount,
    rejectAccount,
    setSelectedAccount,
    getAccountById,
    getBankTypeById,
    refreshData,
  } = useBankAccountStore();

  // Form for creating bank account
  const schema = createProfileValidationSchemas(t);
  const createForm = useForm<CreateBankAccountData>({
    resolver: zodResolver(schema.BankAccountCreateSchema),
    defaultValues: {
      bank_type_id: 0,
      full_name: "",
      account_number: "",
      iban: "",
      branch_name: "",
      branch_code: "",
      swift_bic: "",
      qr_media_ref: "",
      external_account_id: "",
      is_primary: false,
    },
  });

  // Form for updating bank account
  const updateForm = useForm<UpdateBankAccountData>({
    resolver: zodResolver(schema.BankAccountUpdateSchema),
  });

  // Initialize data on mount
  useEffect(() => {
    if (autoFetch && accounts.length === 0) {
      fetchAllAccounts();
    }
    if (fetchBankTypes && bankTypes.length === 0) {
      fetchTypes();
    }
    if (fetchPrimary && !primaryAccount) {
      fetchPrimaryAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle create account
  const handleCreate = useCallback(async (data: CreateBankAccountData) => {
    const result = await createAccount(data as CreateBankAccountData);
    
    if (result.success) {
      toast.success(result.message || t("bankAccount.createSuccess") || "Bank account created successfully");
      createForm.reset();
    } else {
      toast.error(result.message || t("bankAccount.createError") || "Failed to create bank account");
    }
    
    return result;
  }, [createAccount, createForm, t]);

  // Handle update account
  const handleUpdate = useCallback(async (id: number, data: UpdateBankAccountData) => {
    const result = await updateAccount(id, data as UpdateBankAccountData);
    
    if (result.success) {
      toast.success(result.message || t("bankAccount.updateSuccess") || "Bank account updated successfully");
      updateForm.reset();
      setEditingAccount(null);
    } else {
      toast.error(result.message || t("bankAccount.updateError") || "Failed to update bank account");
    }
    
    return result;
  }, [updateAccount, updateForm, t]);

  // Handle delete account
  const handleDelete = useCallback(async (id: number) => {
    setIsDeleting(true);
    const result = await deleteAccount(id);
    
    if (result.success) {
      toast.success(result.message || t("bankAccount.deleteSuccess") || "Bank account deleted successfully");
    } else {
      toast.error(result.message || t("bankAccount.deleteError") || "Failed to delete bank account");
    }
    
    setIsDeleting(false);
    return result;
  }, [deleteAccount, t]);

  // Handle set primary
  const handleSetPrimary = useCallback(async (id: number) => {
    const result = await setPrimaryAccountById(id);
    
    if (result.success) {
      toast.success(result.message || t("bankAccount.setPrimarySuccess") || "Bank account set as primary");
    } else {
      toast.error(result.message || t("bankAccount.setPrimaryError") || "Failed to set primary bank account");
    }
    
    return result;
  }, [setPrimaryAccountById, t]);

  // Handle verify account
  const handleVerify = useCallback(async (id: number, verificationData?: any) => {
    const result = await verifyAccount(id, verificationData);
    
    if (result.success) {
      toast.success(result.message || t("bankAccount.verifySuccess") || "Bank account verified successfully");
    } else {
      toast.error(result.message || t("bankAccount.verifyError") || "Failed to verify bank account");
    }
    
    return result;
  }, [verifyAccount, t]);

  // Handle reject account
  const handleReject = useCallback(async (id: number, reason: string) => {
    const result = await rejectAccount(id, reason);
    
    if (result.success) {
      toast.success(result.message || t("bankAccount.rejectSuccess") || "Bank account rejected");
    } else {
      toast.error(result.message || t("bankAccount.rejectError") || "Failed to reject bank account");
    }
    
    return result;
  }, [rejectAccount, t]);

  // Open create form
  const openCreateForm = useCallback(async () => {
    // Ensure bank types are loaded before opening form
    if (bankTypes.length === 0) {
      await fetchTypes();
    }
    
    setEditingAccount(null);
    createForm.reset();
    setIsFormOpen(true);
  }, [createForm, bankTypes.length, fetchTypes]);

  // Open edit form
  const openEditForm = useCallback(async (account: BankAccount) => {
    // Ensure bank types are loaded before opening form
    if (bankTypes.length === 0) {
      await fetchTypes();
    }
    
    setEditingAccount(account);
    updateForm.reset({
      bank_type_id: account.bank_type_id,
      full_name: account.full_name,
      account_number: account.account_number,
      iban: account.iban,
      branch_name: account.branch_name || "",
      branch_code: account.branch_code || "",
      swift_bic: account.swift_bic || "",
      qr_media_ref: account.qr_media_ref || "",
      external_account_id: account.external_account_id || "",
      is_primary: account.is_primary,
    });
    setIsFormOpen(true);
  }, [updateForm, bankTypes.length, fetchTypes]);

  // Close form
  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingAccount(null);
    createForm.reset();
    updateForm.reset();
  }, [createForm, updateForm]);

  // Get verification status label
  const getVerificationStatusLabel = useCallback((status: string) => {
    switch (status) {
      case 'verified':
        return t("bankAccount.status.verified") || "Verified";
      case 'pending':
        return t("bankAccount.status.pending") || "Pending";
      case 'rejected':
        return t("bankAccount.status.rejected") || "Rejected";
      default:
        return status;
    }
  }, [t]);

  // Get verification status color
  const getVerificationStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  }, []);

  return {
    // Data
    accounts,
    primaryAccount,
    bankTypes,
    selectedAccount,
    isLoading,
    error,
    
    // Forms
    createForm,
    updateForm,
    isFormOpen,
    editingAccount,
    isDeleting,
    
    // Actions
    clearError,
    fetchAllAccounts,
    fetchAccountDetails,
    fetchBankTypes: fetchTypes,
    fetchPrimaryAccount,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSetPrimary,
    handleVerify,
    handleReject,
    setSelectedAccount,
    refreshData,
    
    // Form actions
    openCreateForm,
    openEditForm,
    closeForm,
    
    // Utilities
    getAccountById,
    getBankTypeById,
    getVerificationStatusLabel,
    getVerificationStatusColor,
  };
}
