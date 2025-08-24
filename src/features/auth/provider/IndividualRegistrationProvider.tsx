"use client";

import React, { ReactNode } from "react";
import { useAuthStore } from "@auth/store/authStore";

interface IndividualRegistrationProviderProps {
  children: ReactNode;
}

const IndividualRegistrationProvider: React.FC<
  IndividualRegistrationProviderProps
> = ({ children }) => {
  const store = useAuthStore();

  // Set the role to individual if not already set
  React.useEffect(() => {
    if (!store.currentRole) {
      store.setRole("individual");
    }
  }, [store]);

  return <>{children}</>;
};

export default IndividualRegistrationProvider;
