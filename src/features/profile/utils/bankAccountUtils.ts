// utils/bankAccountUtils.ts

import type { BankAccount } from "../types/bankAccount";

/**
 * Format IBAN for display (adds spaces every 4 characters)
 */
export const formatIBAN = (iban: string): string => {
  if (!iban) return "";
  // Remove any existing spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, "").toUpperCase();
  // Add space every 4 characters
  return cleanIban.match(/.{1,4}/g)?.join(" ") || cleanIban;
};

/**
 * Mask account number for display (shows only last 4 digits)
 */
export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  const lastFour = accountNumber.slice(-4);
  const maskedPart = "*".repeat(Math.max(0, accountNumber.length - 4));
  return `${maskedPart}${lastFour}`;
};

/**
 * Validate Saudi IBAN format
 */
export const validateSaudiIBAN = (iban: string): boolean => {
  const cleanIban = iban.replace(/\s/g, "").toUpperCase();
  return /^SA[0-9]{22}$/.test(cleanIban);
};

/**
 * Get bank logo URL by bank code
 */
export const getBankLogoUrl = (bankCode: string): string => {
  // This would typically map to actual bank logo URLs
  // For now, returning a placeholder
  const bankLogos: Record<string, string> = {
    "NCBK": "/images/banks/ncb.png",
    "RIBL": "/images/banks/riyad.png",
    "RJHI": "/images/banks/rajhi.png",
    "SABB": "/images/banks/sabb.png",
    "AAAL": "/images/banks/alinma.png",
    "BJAZ": "/images/banks/aljazira.png",
    "BSFR": "/images/banks/banque-saudi-fransi.png",
    "SIBC": "/images/banks/sib.png",
    "ARNB": "/images/banks/anb.png",
    "SAMBSARI": "/images/banks/samba.png",
  };
  
  return bankLogos[bankCode] || "/images/banks/default-bank.png";
};

/**
 * Format bank account for display in a select/dropdown
 */
export const formatBankAccountOption = (account: BankAccount): string => {
  const bankName = account.bank_type?.name || "Unknown Bank";
  const maskedAccount = maskAccountNumber(account.account_number);
  const primaryTag = account.is_primary ? " (Primary)" : "";
  return `${bankName} - ${maskedAccount}${primaryTag}`;
};

/**
 * Sort bank accounts (primary first, then by creation date)
 */
export const sortBankAccounts = (accounts: BankAccount[]): BankAccount[] => {
  return [...accounts].sort((a, b) => {
    // Primary accounts first
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    
    // Then sort by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};


/**
 * Get status badge color based on verification status
 */
export const getStatusBadgeVariant = (status: string): "success" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'verified':
      return 'success';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

/**
 * Generate a display name for the bank account
 */
export const generateAccountDisplayName = (account: BankAccount): string => {
  const bankName = account.bank_type?.name || "Bank Account";
  const lastFour = account.account_number.slice(-4);
  return `${bankName} ****${lastFour}`;
};

/**
 * Check if user can delete a bank account
 * (Cannot delete if it's the only account or if it's primary and there are other accounts)
 */
export const canDeleteAccount = (account: BankAccount, totalAccounts: number): boolean => {
  // Cannot delete if it's the only account
  if (totalAccounts <= 1) return false;
  
  // Can delete if it's not primary
  if (!account.is_primary) return true;
  
  // Cannot delete primary if there are other accounts (must set another as primary first)
  return false;
};

/**
 * Validate account number format
 */
export const validateAccountNumber = (accountNumber: string): boolean => {
  return /^[0-9]{10,20}$/.test(accountNumber);
};

/**
 * Format SWIFT/BIC code
 */
export const formatSwiftCode = (code: string): string => {
  if (!code) return "";
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
};

/**
 * Get account age in days
 */
export const getAccountAge = (account: BankAccount): number => {
  const created = new Date(account.created_at);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
/**
 * Check if account is new (created within last 7 days)
 */
export const isNewAccount = (account: BankAccount): boolean => {
  return getAccountAge(account) <= 7;
};
