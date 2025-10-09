"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!tokenStorage.isAuthenticated()) {
      router.push("/login");
      return;
    }
    // Get user data
    const userData = tokenStorage.getUser();
    if (userData) {
      setUser(userData);
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    tokenStorage.clearAll();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="w-full">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Welcome!
              </h2>
              <p className="text-blue-700">
                Hello <span className="font-medium">{user.name}</span>, welcome
                to your dashboard.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Account Status
              </h2>
              <div className="space-y-2 text-green-700">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong>User Type:</strong> {user.user_type}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{user.status}</span>
                </p>
              </div>
            </div>
          </div>

          {user.account_overview?.verification_status
            ?.verification_required && (
            <div className="mt-6 bg-yellow-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                Verification Required
              </h2>
              <p className="text-yellow-700 mb-4">
                Your account requires verification before you can access all
                features.
              </p>
              <button
                onClick={() => router.push("/verify-otp")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Complete Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// export default function DashboardPage() {
//   return <div>dashboard page</div>;
// }
