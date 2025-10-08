// components/contractor/bank-accounts/BankAccountCard.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  CreditCard,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Copy,
  Building,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { useBankAccounts } from "@/features/profile/hooks/useBankAccounts";
import type { BankAccount } from "@/features/profile/types/bankAccount";
import {
  formatIBAN,
  maskAccountNumber,
  canDeleteAccount,
  getStatusBadgeVariant,
  isNewAccount,
} from "@/features/profile/utils/bankAccountUtils";

interface BankAccountCardProps {
  account: BankAccount;
  totalAccounts: number;
  className?: string;
  showActions?: boolean;
  onEdit?: (account: BankAccount) => void;
  onDelete?: (id: number) => Promise<any>;
  onSetPrimary?: (id: number) => Promise<any>;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  totalAccounts,
  className = "",
  showActions = true,
  onEdit,
  onDelete,
  onSetPrimary,
}) => {
  const t = useTranslations();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { bankTypes } = useBankAccounts({ autoFetch: false });

  const canDelete = canDeleteAccount(account, totalAccounts);
  const isNew = isNewAccount(account);
  
  // Get bank type name from bankTypes array if not populated in account
  const bankTypeName = account.bank_type?.name || 
    bankTypes.find(bt => bt.id === account.bank_type_id)?.name || 
    "Unknown Bank";

  const handleCopyIBAN = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(account.iban);
      toast.success(t("bankAccount.ibanCopied") || "IBAN copied to clipboard");
    } catch {
      toast.error(t("bankAccount.copyFailed") || "Failed to copy IBAN");
    } finally {
      setIsCopying(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      setDeleteError(null);
      
      try {
        const result = await onDelete(account.id);
        
        // Only close dialog if deletion was successful
        if (result.success) {
          setShowDeleteDialog(false);
          toast.success(result.message || t("bankAccount.deleteSuccess") || "Bank account deleted successfully");
        } else {
          // Show error in dialog
          setDeleteError(result.message || t("bankAccount.deleteError") || "Failed to delete bank account");
        }
      } catch (error) {
        setDeleteError(t("common.error") || "An unexpected error occurred");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getVerificationIcon = () => {
    switch (account.status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Card className={`relative ${className}`}>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Bank Icon */}
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>

              {/* Account Details */}
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                {/* Header with Bank Name and Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h4 className="font-semibold text-base sm:text-lg truncate">
                    {bankTypeName}
                  </h4>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {account.is_primary && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        {t("bankAccount.badges.primary") || "Primary"}
                      </Badge>
                    )}
                    {isNew && (
                      <Badge variant="secondary" className="text-xs">
                        {t("bankAccount.new") || "New"}
                      </Badge>
                    )}
                    <Badge
                      variant={getStatusBadgeVariant(account.status)}
                      className="gap-1 text-xs"
                    >
                      {getVerificationIcon()}
                      {t(`bankAccount.status.${account.status}`) ||
                        account.status}
                    </Badge>
                  </div>
                </div>

                {/* Account Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {t("bankAccount.accountHolder") || "Account Holder"}:
                    </span>
                    <span className="font-medium text-foreground truncate">
                      {account.full_name}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {t("bankAccount.accountNumber") || "Account"}:
                    </span>
                    <span className="font-mono text-foreground text-xs sm:text-sm">
                      {maskAccountNumber(account.account_number)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 sm:col-span-2">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {t("bankAccount.iban") || "IBAN"}:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-foreground text-xs sm:text-sm break-all">
                        {formatIBAN(account.iban)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={handleCopyIBAN}
                        disabled={isCopying}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {account.branch_name && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        {t("bankAccount.branch") || "Branch"}:
                      </span>
                      <span className="font-medium text-foreground truncate">
                        {account.branch_name}
                      </span>
                    </div>
                  )}

                  {account.swift_bic && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        {t("bankAccount.swiftCode") || "SWIFT"}:
                      </span>
                      <span className="font-mono text-foreground text-xs sm:text-sm">
                        {account.swift_bic}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rejection Reason */}
                {account.rejection_reason && (
                  <div className="mt-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    <span className="font-medium">
                      {t("bankAccount.rejectionReason") || "Rejection Reason"}:
                    </span>{" "}
                    {account.rejection_reason}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit?.(account)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("common.actions.edit") || "Edit"}
                  </DropdownMenuItem>

                  {!account.is_primary && onSetPrimary && (
                    <DropdownMenuItem onClick={async () => {
                      const result = await onSetPrimary(account.id);
                      // Error toast already shown in handleSetPrimary
                    }}>
                      <Star className="mr-2 h-4 w-4" />
                      {t("bankAccount.actions.setPrimary") || "Set as Primary"}
                    </DropdownMenuItem>
                  )}

                  {account.status === "pending" && (
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      {t("bankAccount.requestVerification") ||
                        "Request Verification"}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={isDeleting || !canDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("common.actions.delete") || "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
        if (!isDeleting) {
          setShowDeleteDialog(open);
          if (!open) setDeleteError(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("bankAccount.deleteTitle") || "Delete Bank Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("bankAccount.deleteDescription") ||
                "Are you sure you want to delete this bank account? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {deleteError}
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.actions.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.deleting") || "Deleting..."}
                </span>
              ) : (
                t("common.actions.delete") || "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BankAccountCard;
