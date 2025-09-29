"use client";

import React, { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import useAuth from "@/features/auth/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

// Internal component that uses useAuth hook inside the GoogleOAuthProvider context
const AuthProviderContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize auth effects (token refresh scheduler)
  useAuth();
  return <>{children}</>;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  if (!clientId) {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set. Google OAuth will be disabled."
      );
    }
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </GoogleOAuthProvider>
  );
};

export default AuthProvider;
