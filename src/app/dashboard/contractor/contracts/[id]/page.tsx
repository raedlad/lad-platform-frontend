"use client";

import { ContractPage } from "@/features/contract";
import { useEffect } from "react";
import { useContractStore } from "@/features/contract";

export default function ContractorContractPage() {
  const setRole = useContractStore((state) => state.setRole);
  
  useEffect(() => {
    // Set role to contractor when contractor accesses this page
    setRole("contractor");
  }, [setRole]);
  
  return <ContractPage />;
}
