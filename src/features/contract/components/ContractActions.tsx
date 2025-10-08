"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@shared/components/ui/button";
import { Textarea } from "@shared/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useContractWorkflow } from "@/features/workflow";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Send,
  MessageSquare,
  CheckCircle,
  PenTool,
  AlertCircle,
  FileSignature,
  Download,
  Upload,
} from "lucide-react";
import { useContractStore } from "../store/useContractStore";
import { ContractUploadDialog } from "./ContractUploadDialog";

interface ContractActionsProps {
  projectId?: string;
}

export const ContractActions: React.FC<ContractActionsProps> = ({ projectId }) => {
  const t = useTranslations('contract');
  const tCommon = useTranslations('common.actions');
  const user = useAuthStore((state) => state.user);
  const {
    contract,
    currentRole,
    error,
    sendToOtherParty,
    requestChanges,
    approveContract,
    signContract: originalSignContract,
    generateContractPDF,
  } = useContractStore();

  // Workflow integration for contract signing
  const { signContractWithWorkflow, isSigning } = useContractWorkflow({
    onSuccess: () => {
      toast.success('Contract signed successfully. Workflow updated.');
    },
    onError: (error) => {
      console.error('Workflow error:', error);
    },
  });

  const [showRequestChangesDialog, setShowRequestChangesDialog] =
    useState(false);
  const [changeRequestComment, setChangeRequestComment] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleSendToContractor = () => {
    sendToOtherParty();
    if (!error) {
      toast.success(t('messages.contract_sent'));
    } else {
      toast.error(error);
    }
  };

  const handleRequestChanges = () => {
    if (changeRequestComment.trim()) {
      requestChanges(changeRequestComment.trim());
      setShowRequestChangesDialog(false);
      setChangeRequestComment("");
      if (!error) {
        toast.success(t('messages.change_request_sent'));
      } else {
        toast.error(error);
      }
    }
  };

  const handleApprove = () => {
    approveContract();
    if (!error) {
      toast.success(t('messages.contract_approved'));
    } else {
      toast.error(error);
    }
  };

  const handleSign = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    // Use workflow integration if projectId is provided
    if (projectId) {
      try {
        await signContractWithWorkflow(
          projectId,
          contract.id,
          currentRole as 'client' | 'contractor',
          user.id.toString()
        );
        // Success handled by workflow hook
      } catch (error) {
        // Error already handled by hook
        console.error('Failed to sign contract with workflow:', error);
      }
    } else {
      // Fallback to original sign method without workflow
      originalSignContract();
      if (!error) {
        toast.success(t('messages.contract_signed', { role: currentRole }));
      } else {
        toast.error(error);
      }
    }
  };

  const handleDownloadPDF = async () => {
    console.log("🚀 PDF Download button clicked!");
    console.log("📋 Contract data:", contract);
    
    try {
      console.log("⏳ Calling generateContractPDF...");
      const blob = await generateContractPDF();
      console.log("✅ PDF blob received:", blob);
      console.log("📊 Blob size:", blob.size, "bytes");
      console.log("📊 Blob type:", blob.type);
      
      const url = URL.createObjectURL(blob);
      console.log("🔗 Object URL created:", url);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `contract-${contract.id}-v${contract.versionNumber}.pdf`;
      console.log("📁 Download filename:", link.download);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log("✅ PDF download initiated successfully!");
      toast.success(t('messages.pdf_downloaded'));
    } catch (error) {
      console.error("❌ PDF download failed:", error);
      toast.error(t('messages.failed_generate_pdf'));
    }
  };

  // Determine available actions based on status and role
  const getAvailableActions = () => {
    const actions = [];
    const { status } = contract;

    if (currentRole === "client") {
      if (
        status === "Awaiting Client Review" ||
        status === "Awaiting Client Modification"
      ) {
        actions.push(
          <Button key="send" onClick={handleSendToContractor} className="gap-2">
            <Send className="w-4 h-4" />
            {t('actions.send_to_contractor')}
          </Button>
        );
      }
      if (status === "Approved - Awaiting Signatures") {
        actions.push(
          <Button key="download" onClick={handleDownloadPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('actions.download_pdf')}
          </Button>
        );
        actions.push(
          <Button key="upload-sign" onClick={() => setShowUploadDialog(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            {t('actions.upload_signed_pdf')}
          </Button>
        );
      }
    }

    if (currentRole === "contractor") {
      if (status === "Awaiting Contractor Review") {
        actions.push(
          <Button
            key="request-changes"
            onClick={() => setShowRequestChangesDialog(true)}
            variant="outline"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {t('actions.request_changes')}
          </Button>
        );
        actions.push(
          <Button key="approve" onClick={handleApprove} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            {t('actions.approve_contract')}
          </Button>
        );
      }
      if (status === "Awaiting Contractor Signature") {
        actions.push(
          <Button key="download" onClick={handleDownloadPDF} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            {t('actions.download_pdf')}
          </Button>
        );
        actions.push(
          <Button key="upload-sign" onClick={() => setShowUploadDialog(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            {t('actions.upload_signed_pdf')}
          </Button>
        );
      }
    }

    if (status === "Signed - Active") {
      actions.push(
        <Alert key="completed" className="border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {t('messages.contract_signed_success')} Both parties have signed the agreement.
          </AlertDescription>
        </Alert>
      );
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  return (
    <>
      <div className="">
        <div>
          {availableActions.length > 0 ? (
            <div className="flex flex-wrap gap-3">{availableActions}</div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('actions.no_actions')}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Request Changes Dialog */}
      <Dialog
        open={showRequestChangesDialog}
        onOpenChange={setShowRequestChangesDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="comment">{t('dialogs.request_changes.comment_label')}</Label>
              <Textarea
                id="comment"
                value={changeRequestComment}
                onChange={(e) => setChangeRequestComment(e.target.value)}
                placeholder={t('dialogs.request_changes.comment_placeholder')}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRequestChangesDialog(false)}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              onClick={handleRequestChanges}
              disabled={!changeRequestComment.trim()}
            >
              {t('dialogs.request_changes.send_button')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contract Upload Dialog */}
      <ContractUploadDialog 
        open={showUploadDialog} 
        onOpenChange={setShowUploadDialog} 
      />
    </>
  );
};
