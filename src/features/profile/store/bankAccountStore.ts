// store/bankAccountStore.ts
import { create } from "zustand";
import { bankAccountApi } from "../services/bankAccountApi";
import type {
  BankAccount,
  BankType,
  CreateBankAccountData,
  UpdateBankAccountData,
  BankAccountsState,
} from "../types/bankAccount";

interface BankAccountStore extends BankAccountsState {
  // Fetch tracking
  hasFetchedAccounts: boolean;
  hasFetchedBankTypes: boolean;
  isLoadingBankTypes: boolean;
  
  // Actions
  setAccounts: (accounts: BankAccount[]) => void;
  setPrimaryAccount: (account: BankAccount | null) => void;
  setBankTypes: (types: BankType[]) => void;
  setSelectedAccount: (account: BankAccount | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingBankTypes: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // API Actions
  fetchAllAccounts: () => Promise<void>;
  fetchAccountDetails: (id: number) => Promise<void>;
  fetchBankTypes: () => Promise<void>;
  fetchPrimaryAccount: () => Promise<void>;
  createAccount: (data: CreateBankAccountData) => Promise<{ success: boolean; message?: string }>;
  updateAccount: (id: number, data: UpdateBankAccountData) => Promise<{ success: boolean; message?: string }>;
  deleteAccount: (id: number) => Promise<{ success: boolean; message?: string }>;
  setPrimaryAccountById: (id: number) => Promise<{ success: boolean; message?: string }>;
  verifyAccount: (id: number, verificationData?: any) => Promise<{ success: boolean; message?: string }>;
  rejectAccount: (id: number, reason: string) => Promise<{ success: boolean; message?: string }>;
  
  // Utilities
  getAccountById: (id: number) => BankAccount | undefined;
  getBankTypeById: (id: number) => BankType | undefined;
  refreshData: () => Promise<void>;
}

export const useBankAccountStore = create<BankAccountStore>((set, get) => ({
  // Initial state
  accounts: [],
  primaryAccount: null,
  bankTypes: [],
  selectedAccount: null,
  isLoading: false,
  isLoadingBankTypes: false,
  error: null,
  hasFetchedAccounts: false,
  hasFetchedBankTypes: false,
  
  // Basic actions
  setAccounts: (accounts) => set({ accounts }),
  setPrimaryAccount: (primaryAccount) => set({ primaryAccount }),
  setBankTypes: (bankTypes) => set({ bankTypes }),
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingBankTypes: (isLoadingBankTypes) => set({ isLoadingBankTypes }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Fetch all accounts
  fetchAllAccounts: async () => {
    const { hasFetchedAccounts, isLoading } = get();
    if (hasFetchedAccounts || isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.getAllAccounts();
      
      if (response.success && response.data) {
        const accounts = response.data;
        const primaryAccount = accounts.find(acc => acc.is_primary) || null;
        set({ 
          accounts,
          primaryAccount,
          isLoading: false,
          hasFetchedAccounts: true 
        });
      } else {
        set({ 
          error: response.message || "Failed to fetch bank accounts",
          isLoading: false,
          hasFetchedAccounts: true 
        });
      }
    } catch (error) {
      set({ 
        error: "An error occurred while fetching bank accounts",
        isLoading: false,
        hasFetchedAccounts: true 
      });
    }
  },
  
  // Fetch account details
  fetchAccountDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.getAccountDetails(id);
      
      if (response.success && response.data) {
        set({ 
          selectedAccount: response.data,
          isLoading: false 
        });
      } else {
        set({ 
          error: response.message || "Failed to fetch account details",
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        error: "An error occurred while fetching account details",
        isLoading: false 
      });
    }
  },
  
  // Fetch bank types
  fetchBankTypes: async () => {
    const { hasFetchedBankTypes, isLoadingBankTypes } = get();
    if (hasFetchedBankTypes || isLoadingBankTypes) return;
    
    set({ isLoadingBankTypes: true });
    try {
      const response = await bankAccountApi.getBankTypes();
      
      if (response.success && response.data) {
        set({ 
          bankTypes: response.data,
          isLoadingBankTypes: false,
          hasFetchedBankTypes: true 
        });
      } else {
        set({ 
          error: response.message || "Failed to fetch bank types",
          isLoadingBankTypes: false,
          hasFetchedBankTypes: true 
        });
      }
    } catch (error) {
      set({ 
        error: "An error occurred while fetching bank types",
        isLoadingBankTypes: false,
        hasFetchedBankTypes: true 
      });
    }
  },
  
  // Fetch primary account
  fetchPrimaryAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.getPrimaryAccount();
      
      if (response.success && response.data) {
        set({ 
          primaryAccount: response.data,
          isLoading: false 
        });
      } else {
        // It's okay to not have a primary account
        set({ 
          primaryAccount: null,
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        primaryAccount: null,
        isLoading: false 
      });
    }
  },
  
  // Create account
  createAccount: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.createAccount(data);
      
      if (response.success && response.data) {
        const { accounts } = get();
        const newAccounts = [...accounts, response.data];
        
        // If this is the first account or marked as primary, set it as primary
        const primaryAccount = response.data.is_primary 
          ? response.data 
          : (newAccounts.length === 1 ? response.data : get().primaryAccount);
        
        set({ 
          accounts: newAccounts,
          primaryAccount,
          isLoading: false 
        });
        
        return { success: true, message: response.message };
      } else {
        set({ 
          error: response.message || "Failed to create bank account",
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = "An error occurred while creating bank account";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },
  
  // Update account
  updateAccount: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.updateAccount(id, data);
      
      if (response.success && response.data) {
        const { accounts } = get();
        const updatedAccount = response.data;
        const updatedAccounts = accounts.map(acc => 
          acc.id === id ? updatedAccount : acc
        );
        
        // Update primary account if needed
        const primaryAccount = updatedAccount.is_primary 
          ? updatedAccount 
          : (get().primaryAccount?.id === id ? updatedAccount : get().primaryAccount);
        
        set({ 
          accounts: updatedAccounts,
          primaryAccount,
          selectedAccount: response.data,
          isLoading: false 
        });
        
        return { success: true, message: response.message };
      } else {
        set({ 
          error: response.message || "Failed to update bank account",
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = "An error occurred while updating bank account";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },
  
  // Delete account
  deleteAccount: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.deleteAccount(id);
      
      if (response.success) {
        const { accounts, primaryAccount, selectedAccount } = get();
        const filteredAccounts = accounts.filter(acc => acc.id !== id);
        
        // Update primary account if deleted
        const newPrimaryAccount = primaryAccount?.id === id 
          ? filteredAccounts.find(acc => acc.is_primary) || null
          : primaryAccount;
        
        // Clear selected account if deleted
        const newSelectedAccount = selectedAccount?.id === id ? null : selectedAccount;
        
        set({ 
          accounts: filteredAccounts,
          primaryAccount: newPrimaryAccount,
          selectedAccount: newSelectedAccount,
          isLoading: false 
        });
        
        return { success: true, message: response.message };
      } else {
        set({ 
          error: response.message || "Failed to delete bank account",
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = "An error occurred while deleting bank account";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },
  
  // Set primary account
  setPrimaryAccountById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.setPrimary(id);
      
      if (response.success && response.data) {
        const { accounts } = get();
        const updatedAccounts = accounts.map(acc => ({
          ...acc,
          is_primary: acc.id === id
        }));
        
        set({ 
          accounts: updatedAccounts,
          primaryAccount: response.data,
          isLoading: false 
        });
        
        return { success: true, message: response.message };
      } else {
        set({ 
          error: response.message || "Failed to set primary bank account",
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = "An error occurred while setting primary bank account";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },
  
  // Verify account
  verifyAccount: async (id, verificationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.verifyAccount(id, verificationData);
      
      if (response.success && response.data) {
        const { accounts } = get();
        const verifiedAccount = response.data;
        const updatedAccounts = accounts.map(acc => 
          acc.id === id ? verifiedAccount : acc
        );
        
        set({ 
          accounts: updatedAccounts,
          selectedAccount: verifiedAccount,
          isLoading: false 
        });
        
        return { success: true, message: response.message };
      } else {
        set({ 
          error: response.message || "Failed to verify bank account",
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = "An error occurred while verifying bank account";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },
  
  // Reject account
  rejectAccount: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bankAccountApi.rejectAccount(id, reason);
      
      if (response.success && response.data) {
        const { accounts } = get();
        const rejectedAccount = response.data;
        const updatedAccounts = accounts.map(acc => 
          acc.id === id ? rejectedAccount : acc
        );
        
        set({ 
          accounts: updatedAccounts,
          selectedAccount: rejectedAccount,
          isLoading: false 
        });
        
        return { success: true, message: response.message };
      } else {
        set({ 
          error: response.message || "Failed to reject bank account",
          isLoading: false 
        });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = "An error occurred while rejecting bank account";
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },
  
  // Utilities
  getAccountById: (id) => {
    const { accounts } = get();
    return accounts.find(acc => acc.id === id);
  },
  
  getBankTypeById: (id) => {
    const { bankTypes } = get();
    return bankTypes.find(type => type.id === id);
  },
  
  refreshData: async () => {
    await Promise.all([
      get().fetchAllAccounts(),
      get().fetchBankTypes(),
    ]);
  },
}));
