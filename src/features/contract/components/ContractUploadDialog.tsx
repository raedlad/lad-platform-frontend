"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  XIcon,
} from "lucide-react";
import { useContractStore } from "../store/useContractStore";
import { OTPInput } from "@/features/auth/components/common/OTPInput";

interface ContractUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContractUploadDialog: React.FC<ContractUploadDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const t = useTranslations('contract');
  const tCommon = useTranslations('common.actions');
  const { issueOtpForSigning, verifyOtpAndUploadSignedFile } = useContractStore();
  
  const [step, setStep] = useState<"upload" | "otp" | "success">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError(t('messages.pdf_file_only'));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(t('messages.file_size_limit'));
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSendOtp = async () => {
    if (!selectedFile) {
      setError(t('messages.select_file_first'));
      return;
    }
    console.log("🚀 otp :", otpCode);
    setIsLoading(true);
    try {
      await issueOtpForSigning();
      setStep("otp");
      toast.success(t('messages.otp_sent'));
    } catch (err) {
      setError(t('messages.failed_send_otp'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndUpload = async () => {
    if (!selectedFile || !otpCode.trim()) {
      setError(t('messages.enter_otp_code'));
      return;
    }
    console.log("🚀 otp :", otpCode)
    setIsLoading(true);
    try {
      await verifyOtpAndUploadSignedFile(selectedFile, otpCode.trim());
      setStep("success");
      toast.success(t('messages.contract_signed_success'));
      
      setTimeout(() => {
        onOpenChange(false);
        resetDialog();
      }, 2000);
    } catch (err) {
      setError(t('messages.invalid_otp'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setStep("upload");
    setSelectedFile(null);
    setOtpCode("");
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetDialog();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-design-main" />
            {t('upload.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('upload.step_of', { step: step === "upload" ? 1 : step === "otp" ? 2 : 3 })}</span>
              <span>
                {step === "upload" && t('upload.select_file')}
                {step === "otp" && t('upload.verify_otp')}
                {step === "success" && t('upload.complete')}
              </span>
            </div>
            <div className="w-full bg-design-main/30 rounded-full h-2">
              <div 
                className="bg-design-main h-2 rounded-full transition-all duration-300"
                style={{ width: `${step === "upload" ? 33 : step === "otp" ? 66 : 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: File Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-design-main rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-design-main" />
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm font-medium text-center w-full">
                      {t('upload.click_to_upload')}
                    </span>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('upload.pdf_only')}
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between gap-2 p-3 bg-design-main/5 border border-design-main/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-design-main " />
                    <span className="text-sm font-medium text-design-main">
                      {selectedFile.name}
                    </span>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedFile(null)} className="text-design-main hover:bg-transparent hover:text-design-main">
                    <XIcon className="w-4 h-4 " />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <div className="space-y-4">
          
              <div className="space-y-2">
                <Label htmlFor="otp">{t('upload.enter_otp')}</Label>
                <div className="w-full flex items-center justify-center">

                <OTPInput
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                />
                </div>
              </div>
              <div className="flex items-center justify-center">
              <p>{t('upload.resend_otp_description')}</p>
              <Button
                variant="link"
                size="sm"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="text-design-main hover:text-design-main underline"
                
                >
                {t('upload.resend_otp_link')}
              </Button>
                </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  {t('upload.success_title')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('upload.success_description')}
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {step === "upload" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                {tCommon('cancel')}
              </Button>
              <Button 
                onClick={handleSendOtp} 
                disabled={!selectedFile || isLoading}
                className="gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('upload.send_otp')}
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")}>
                {tCommon('back')}
              </Button>
              <Button 
                onClick={handleVerifyAndUpload} 
                disabled={!otpCode.trim() || otpCode.length !== 6 || isLoading}
                className="gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('upload.verify_upload')}
              </Button>
            </>
          )}

          {step === "success" && (
            <Button onClick={handleClose} className="w-full">
              {tCommon('close')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
