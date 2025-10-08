"use client";

import { BankAccountsList } from "@/features/profile/components/contractor/bank-accounts";

const BankAccountPage = () => {
  return (
    <div className="space-y-6">
      <BankAccountsList showHeader={true} maxAccounts={5} className="shadow-none border-none"/>
    </div>
  );
};

export default BankAccountPage;
