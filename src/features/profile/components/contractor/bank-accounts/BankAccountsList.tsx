// components/contractor/bank-accounts/BankAccountsList.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBankAccounts } from "@/features/profile/hooks/useBankAccounts";
import { sortBankAccounts } from "@/features/profile/utils/bankAccountUtils";
import BankAccountCard from "./BankAccountCard";
import BankAccountForm from "./BankAccountForm";

interface BankAccountsListProps {
  className?: string;
  showHeader?: boolean;
  maxAccounts?: number;
}

const BankAccountsList: React.FC<BankAccountsListProps> = ({
  className = "",
  showHeader = true,
  maxAccounts = 5,
}) => {
  const t = useTranslations();
  
  const {
    accounts,
    isLoading,
    error,
    isFormOpen,
    editingAccount,
    openCreateForm,
    openEditForm,
    closeForm,
    clearError,
    handleDelete,
    handleSetPrimary,
  } = useBankAccounts({
    autoFetch: true,
    fetchBankTypes: true, // Don't fetch on mount - only fetch when form opens
  });

  const sortedAccounts = sortBankAccounts(accounts);
  const canAddMore = accounts.length < maxAccounts;

  if (isLoading && accounts.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        {showHeader && (
          <CardHeader className="flex flex-row items-center justify-end space-y-0 pb-4">
            {canAddMore && (
              <Button onClick={openCreateForm} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("bankAccount.addAccount") || "Add Account"}
              </Button>
            )}
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          {sortedAccounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t("bankAccount.noAccounts") || "No bank accounts added yet"}
              </p>
              {canAddMore && (
                <Button onClick={openCreateForm} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("bankAccount.addFirstAccount") || "Add Your First Bank Account"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAccounts.map((account) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  totalAccounts={accounts.length}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                  onSetPrimary={handleSetPrimary}
                />
              ))}
              
              {!canAddMore && (
                <Alert>
                  <AlertDescription>
                    {t("bankAccount.maxAccountsReached") || `You have reached the maximum of ${maxAccounts} bank accounts.`}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bank Account Form Modal */}
      <BankAccountForm 
        open={isFormOpen}
        onClose={closeForm}
        editingAccount={editingAccount}
      />
    </>
  );
};

export default BankAccountsList;
