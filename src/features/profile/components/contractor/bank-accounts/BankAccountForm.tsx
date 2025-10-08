// components/contractor/bank-accounts/BankAccountForm.tsx
"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { useBankAccounts } from "@/features/profile/hooks/useBankAccounts";
import type { BankAccount, CreateBankAccountData, UpdateBankAccountData } from "@/features/profile/types/bankAccount";
import {
  validateSaudiIBAN,
  formatSwiftCode,
} from "@/features/profile/utils/bankAccountUtils";

interface BankAccountFormProps {
  open: boolean;
  onClose: () => void;
  editingAccount?: BankAccount | null;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  open,
  onClose,
  editingAccount,
}) => {
  const t = useTranslations();
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const {
    bankTypes,
    createForm,
    updateForm,
    handleCreate,
    handleUpdate,
    isLoading,
  } = useBankAccounts({ autoFetch: false });

  const isEditing = !!editingAccount;
  const form = (isEditing ? updateForm : createForm) as UseFormReturn<any, any, any>;

  // Populate form when editing and reset error
  useEffect(() => {
    if (open) {
      setFormError(null);
      if (isEditing && editingAccount) {
        updateForm.reset({
          bank_type_id: editingAccount.bank_type_id,
          full_name: editingAccount.full_name,
          account_number: editingAccount.account_number,
          iban: editingAccount.iban,
          branch_name: editingAccount.branch_name || "",
          branch_code: editingAccount.branch_code || "",
          swift_bic: editingAccount.swift_bic || "",
          qr_media_ref: editingAccount.qr_media_ref || "",
          external_account_id: editingAccount.external_account_id || "",
          is_primary: editingAccount.is_primary,
        });
      } else if (!isEditing) {
        createForm.reset();
      }
    }
  }, [open, isEditing, editingAccount, updateForm, createForm]);

  const handleSubmit = async (data: CreateBankAccountData | UpdateBankAccountData) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      let result;
      if (isEditing && editingAccount) {
        result = await handleUpdate(editingAccount.id, data as UpdateBankAccountData);
      } else {
        result = await handleCreate(data as CreateBankAccountData);
      }

      // Only close dialog if operation was successful
      if (result.success) {
        onClose();
      } else {
        // Show error in dialog
        setFormError(result.message || t(isEditing ? "bankAccount.updateError" : "bankAccount.createError"));
      }
    } catch (error) {
      // Handle any unexpected errors
      setFormError(t("common.error") || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format IBAN as user types
  const handleIBANChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    form.setValue("iban" as any, cleaned);
  };

  // Format SWIFT code as user types
  const handleSwiftCodeChange = (value: string) => {
    const formatted = formatSwiftCode(value);
    form.setValue("swift_bic" as any, formatted);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!isSubmitting) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] flex flex-col gap-0 p-0 rounded-md">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>
            {isEditing
              ? t("bankAccount.editTitle") || "Edit Bank Account"
              : t("bankAccount.addTitle") || "Add Bank Account"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("bankAccount.editDescription") ||
                "Update your bank account information"
              : t("bankAccount.addDescription") ||
                "Enter your bank account details to receive payments"}
          </DialogDescription>
        </DialogHeader>

        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 space-y-4" >
            
            {/* Error Message */}
            {formError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </div>
            )}
            {/* Bank Type */}
            <FormField
              control={form.control}
              name="bank_type_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("bankAccount.bankType") || "Bank"} *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            t("bankAccount.selectBank") || "Select a bank"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {bankTypes.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id.toString()}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Holder Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("bankAccount.accountHolderName") ||
                      "Account Holder Name"}{" "}
                    *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        t("bankAccount.accountHolderNamePlaceholder") ||
                        "Enter the account holder name"
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {t("bankAccount.accountHolderNameDescription") ||
                      "Name as it appears on the bank account"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("bankAccount.accountNumber") || "Account Number"} *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        t("bankAccount.accountNumberPlaceholder") ||
                        "Enter account number"
                      }
                      maxLength={20}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("bankAccount.accountNumberDescription") ||
                      "10-20 digit account number"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* IBAN */}
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("bankAccount.iban") || "IBAN"} *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleIBANChange(e.target.value)}
                      placeholder="SA0000000000000000000000"
                      maxLength={24}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    {t("bankAccount.ibanDescription") ||
                      "24-character Saudi IBAN starting with SA"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Branch Name (Optional) */}
            <FormField
              control={form.control}
              name="branch_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("bankAccount.branchName") || "Branch Name"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        t("bankAccount.branchNamePlaceholder") ||
                        "Enter branch name (optional)"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Branch Code (Optional) */}
            <FormField
              control={form.control}
              name="branch_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("bankAccount.branchCode") || "Branch Code"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={
                        t("bankAccount.branchCodePlaceholder") ||
                        "Enter branch code (optional)"
                      }
                      maxLength={20}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SWIFT Code (Optional) */}
            <FormField
              control={form.control}
              name="swift_bic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("bankAccount.swiftCode") || "SWIFT/BIC Code"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handleSwiftCodeChange(e.target.value)}
                      placeholder="AAAABBCC123"
                      maxLength={11}
                      className="font-mono uppercase"
                    />
                  </FormControl>
                  <FormDescription>
                    {t("bankAccount.swiftCodeDescription") ||
                      "8 or 11 character SWIFT/BIC code (optional)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

            <DialogFooter className="w-full px-6 py-4 mt-2 border-t bg-muted/10 flex flex-row gap-2 items-center justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {t("common.actions.cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing
                      ? t("common.actions.updating") || "Updating..."
                      : t("common.actions.adding") || "Adding..."}
                  </>
                ) : (
                  <>
                    {isEditing
                      ? t("common.actions.update") || "Update"
                      : t("common.actions.add") || "Add"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BankAccountForm;
