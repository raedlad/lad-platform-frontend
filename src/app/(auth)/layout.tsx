import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen">
    <h1 className="p-4 font-bold text-2xl">Lad</h1>
    {children}
    </div>;
};

export default AuthLayout;
