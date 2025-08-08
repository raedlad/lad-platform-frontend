import React, { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // For now, we'll just render children directly
  // In the future, this can include context providers, initialization logic, etc.
  return <>{children}</>;
};

export default AuthProvider;
