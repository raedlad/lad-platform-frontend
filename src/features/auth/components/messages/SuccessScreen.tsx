'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { useSignUpStore } from "@auth/store/signupStore";
import { useRouter } from "next/navigation";
import { CheckCircle, Sparkles } from "lucide-react";

export default function SuccessScreen() {
  const { 
    authMethod, 
    emailSignUpData, 
    phoneSignUpData, 
    thirdPartySignUpData,
    isVerified 
  } = useSignUpStore();
  
  const router = useRouter();

  useEffect(() => {
    if (!isVerified) {
      router.push('/');
    }
  }, [isVerified, router]);

  const getUserData = () => {
    if (authMethod === 'email') return emailSignUpData;
    if (authMethod === 'phone') return phoneSignUpData;
    if (authMethod === 'thirdParty') return thirdPartySignUpData;
    return null;
  };

  const userData = getUserData();
  const firstName = userData?.firstName || 'there';

  const handleContinue = () => {
    // In a real app, this would redirect to the main application
    console.log('Redirecting to main application...');
    // For demo, we'll just go back to home
    router.push('/');
  };

  const getAuthMethodText = () => {
    switch (authMethod) {
      case 'email':
        return 'email address';
      case 'phone':
        return 'phone number';
      case 'thirdParty':
        return 'Google account';
      default:
        return 'account';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            Welcome, {firstName}! 
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </CardTitle>
          <CardDescription className="text-base">
            Your account has been successfully created with your {getAuthMethodText()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Details */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Account created successfully</span>
            </div>
            {authMethod !== 'thirdParty' && (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>
                  {authMethod === 'email' ? 'Email' : 'Phone number'} verified
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Profile setup complete</span>
            </div>
          </div>

          {/* User Info Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="font-medium">Account Summary:</div>
            <div>Name: {userData?.firstName} {userData?.lastName}</div>
            {authMethod === 'email' && (
              <div>Email: {userData?.email}</div>
            )}
            {authMethod === 'phone' && (
              <div>Phone: {userData?.phoneNumber}</div>
            )}
            {authMethod === 'thirdParty' && (
              <div>Email: {userData?.email} (via Google)</div>
            )}
            {userData?.employeeId && (
              <div>Employee ID: {userData.employeeId}</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleContinue} className="w-full">
              Continue to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground">
            You can now access all features of our platform. 
            Check your {authMethod === 'email' ? 'email' : 'phone'} for a welcome message!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

