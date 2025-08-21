"use client";

import React, { ReactNode } from "react";
import { useIndividualRegistrationStore } from "@auth/store/individualRegistrationStore";

interface IndividualRegistrationProviderProps {
  children: ReactNode;
}

const IndividualRegistrationProvider: React.FC<
  IndividualRegistrationProviderProps
> = ({ children }) => {
  // Initialize the store when the provider mounts
  const store = useIndividualRegistrationStore();

  // You can add any initialization logic here
  // For example, checking for existing registration data, etc.

  return <>{children}</>;
};

export default IndividualRegistrationProvider;
