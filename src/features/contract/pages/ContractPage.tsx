"use client";

import React from "react";
import { ContractStatusBar } from "../components/ContractStatusBar";
import { ContractViewer } from "../components/ContractViewer";
import { AdditionalClausesEditor } from "../components/AdditionalClausesEditor";
import { ContractActions } from "../components/ContractActions";
import { RoleSwitcher } from "../components/RoleSwitcher";
import { useContractStore } from "../store/useContractStore";

export default function ContractPage() {
  const { contract, currentRole } = useContractStore();

  // Determine if additional clauses are editable
  const isClausesEditable =
    currentRole === "client" &&
    (contract.status === "Awaiting Client Review" ||
      contract.status === "Awaiting Client Modification");

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl min-h-screen">
      <RoleSwitcher />

      {/* Contract Status Bar */}
      <ContractStatusBar currentStatus={contract.status} />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column - Contract Details & Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Viewer */}
          <ContractViewer contract={contract} isEditable={isClausesEditable} />

          {/* Additional Clauses Editor */}
          
          <AdditionalClausesEditor isEditable={isClausesEditable} />

          {/* Contract Actions */}
          <ContractActions />
        </div>
      </div>
    </div>
  );
}
