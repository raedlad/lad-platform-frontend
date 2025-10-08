// components/contractor/bank-accounts/BankAccountActions.tsx
"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Shield,
  XCircle,
  CheckCircle,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import { Textarea } from "@shared/components/ui/textarea";
import { Label } from "@shared/components/ui/label";
import { useBankAccounts } from "@/features/profile/hooks/useBankAccounts";
import type { BankAccount } from "@/features/profile/types/bankAccount";
import { toast } from "sonner";

interface BankAccountActionsProps {
  account: BankAccount;
  className?: string;
  size?: "sm" | "default" | "lg";
  showLabels?: boolean;
}

const BankAccountActions: React.FC<BankAccountActionsProps> = ({
  account,
  className = "",
  size = "default",
  showLabels = true,
}) => {
  const t = useTranslations();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    handleSetPrimary,
    handleVerify,
    handleReject,
  } = useBankAccounts({ autoFetch: false });

  const handleVerifyClick = async () => {
    setIsProcessing(true);
    try {
      const result = await handleVerify(account.id);
      if (result.success) {
        toast.success(t("bankAccount.verifySuccess") || "Bank account verified successfully");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetPrimaryClick = async () => {
    setIsProcessing(true);
    try {
      const result = await handleSetPrimary(account.id);
      if (result.success) {
        toast.success(t("bankAccount.setPrimarySuccess") || "Bank account set as primary");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      toast.error(t("bankAccount.rejectReasonRequired") || "Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await handleReject(account.id, rejectionReason);
      if (result.success) {
        toast.success(t("bankAccount.rejectSuccess") || "Bank account rejected");
        setShowRejectDialog(false);
        setRejectionReason("");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const canVerify = account.status === "pending" || !account.is_verified;
  const canReject = account.status === "pending";
  const canSetPrimary = !account.is_primary;

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Verify Action */}
        {canVerify && (
          <Button
            size={size}
            variant="outline"
            onClick={handleVerifyClick}
            disabled={isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {showLabels && (t("bankAccount.verify") || "Verify")}
          </Button>
        )}

        {/* Reject Action */}
        {canReject && (
          <Button
            size={size}
            variant="outline"
            onClick={() => setShowRejectDialog(true)}
            disabled={isProcessing}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
            {showLabels && (t("bankAccount.reject") || "Reject")}
          </Button>
        )}

        {/* Set Primary Action */}
        {canSetPrimary && (
          <Button
            size={size}
            variant="outline"
            onClick={handleSetPrimaryClick}
            disabled={isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Star className="h-4 w-4" />
            )}
            {showLabels && (t("bankAccount.setPrimary") || "Set Primary")}
          </Button>
        )}

        {/* Request Verification (for pending accounts) */}
        {account.status === "rejected" && (
          <Button
            size={size}
            variant="outline"
            onClick={handleVerifyClick}
            disabled={isProcessing}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            {showLabels && (t("bankAccount.requestReVerification") || "Request Re-verification")}
          </Button>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("bankAccount.rejectTitle") || "Reject Bank Account"}
            </DialogTitle>
            <DialogDescription>
              {t("bankAccount.rejectDescription") || 
                "Please provide a reason for rejecting this bank account. This will be sent to the account holder."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">
                {t("bankAccount.rejectionReason") || "Rejection Reason"} *
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={t("bankAccount.rejectionReasonPlaceholder") || 
                  "Enter the reason for rejection..."}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
              }}
              disabled={isProcessing}
            >
              {t("common.actions.cancel") || "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.actions.processing") || "Processing..."}
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("bankAccount.confirmReject") || "Reject Account"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BankAccountActions;
