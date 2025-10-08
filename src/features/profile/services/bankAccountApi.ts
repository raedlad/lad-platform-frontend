// services/bankAccountApi.ts
import api from "@/lib/api";
import type {
  BankAccount,
  BankType,
  CreateBankAccountData,
  UpdateBankAccountData,
  BankAccountApiResponse,
} from "@/features/profile/types/bankAccount";
import {
  transformBankAccountFromApi,
  transformBankTypeFromApi,
} from "@/features/profile/types/bankAccount";

export const bankAccountApi = {
  // Get all bank accounts for the user
  async getAllAccounts(): Promise<BankAccountApiResponse<BankAccount[]>> {
    try {
      const response = await api.get("/bank/accounts");

      if (response.data.success) {
        const accounts = (
          response.data.response ||
          response.data.data ||
          []
        ).map(transformBankAccountFromApi);
        return {
          success: true,
          data: accounts,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to fetch bank accounts",
      };
    } catch (error: any) {
      console.error("Error fetching bank accounts:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while fetching bank accounts",
      };
    }
  },

  // Create a new bank account
  async createAccount(
    data: CreateBankAccountData
  ): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.post("/bank/accounts", data);

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message: response.data.message || "Bank account created successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to create bank account",
      };
    } catch (error: any) {
      console.error("Error creating bank account:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while creating bank account",
      };
    }
  },

  // Get bank account details
  async getAccountDetails(
    id: number
  ): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.get(`/bank/accounts/${id}`);

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message:
          response.data.message || "Failed to fetch bank account details",
      };
    } catch (error: any) {
      console.error("Error fetching bank account details:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while fetching bank account details",
      };
    }
  },

  // Delete a bank account
  async deleteAccount(id: number): Promise<BankAccountApiResponse<void>> {
    try {
      const response = await api.delete(`/bank/accounts/${id}`);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || "Bank account deleted successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to delete bank account",
      };
    } catch (error: any) {
      console.error("Error deleting bank account:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while deleting bank account",
      };
    }
  },

  // Update bank account info
  async updateAccount(
    id: number,
    data: UpdateBankAccountData
  ): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.patch(`/bank/accounts/${id}`, data);

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message: response.data.message || "Bank account updated successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to update bank account",
      };
    } catch (error: any) {
      console.error("Error updating bank account:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while updating bank account",
      };
    }
  },

  // Set account as primary
  async setPrimary(id: number): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.post(`/bank/accounts/${id}/primary`);

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message:
            response.data.message || "Bank account set as primary successfully",
        };
      }

      return {
        success: false,
        message:
          response.data.message || "Failed to set bank account as primary",
      };
    } catch (error: any) {
      console.error("Error setting bank account as primary:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while setting bank account as primary",
      };
    }
  },

  // Verify a bank account
  async verifyAccount(
    id: number,
    verificationData?: any
  ): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.post(
        `/bank/accounts/${id}/verify`,
        verificationData || {}
      );

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message:
            response.data.message || "Bank account verified successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to verify bank account",
      };
    } catch (error: any) {
      console.error("Error verifying bank account:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while verifying bank account",
      };
    }
  },

  // Reject a bank account
  async rejectAccount(
    id: number,
    reason: string
  ): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.post(`/bank/accounts/${id}/reject`, {
        reason,
      });

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message:
            response.data.message || "Bank account rejected successfully",
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to reject bank account",
      };
    } catch (error: any) {
      console.error("Error rejecting bank account:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while rejecting bank account",
      };
    }
  },

  // Get available bank types
  async getBankTypes(): Promise<BankAccountApiResponse<BankType[]>> {
    try {
      const response = await api.get("/bank/bank-types");

      if (response.data.success) {
        const bankTypes = (
          response.data.response ||
          response.data.data ||
          []
        ).map(transformBankTypeFromApi);
        return {
          success: true,
          data: bankTypes,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message: response.data.message || "Failed to fetch bank types",
      };
    } catch (error: any) {
      console.error("Error fetching bank types:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while fetching bank types",
      };
    }
  },

  // Get primary bank account
  async getPrimaryAccount(): Promise<BankAccountApiResponse<BankAccount>> {
    try {
      const response = await api.get("/bank/accounts/primary");

      if (response.data.success) {
        const account = transformBankAccountFromApi(
          response.data.response || response.data.data
        );
        return {
          success: true,
          data: account,
          message: response.data.message,
        };
      }

      return {
        success: false,
        message: response.data.message || "No primary bank account found",
      };
    } catch (error: any) {
      console.error("Error fetching primary bank account:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "An error occurred while fetching primary bank account",
      };
    }
  },
};
