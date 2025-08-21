"use client";

import { Button } from "@shared/components/ui/button";
import { Phone, MailIcon } from "lucide-react";
import GoogleAuthButton from "@auth/components/common/GoogleAuthButton";
import AppleAuthButton from "@auth/components/common/AppleAuthButton";

interface AuthMethodSelectionProps {
  onAuthMethodSelect: (method: "email" | "phone" | "thirdParty") => void;
}

export default function AuthMethodSelection({
  onAuthMethodSelect,
}: AuthMethodSelectionProps) {
  const handleGoogleSignUp = () => {
    // In a real app, this would initiate Google OAuth
    console.log("Google OAuth would be initiated here");
    onAuthMethodSelect("thirdParty");
  };

  const handleAppleSignUp = () => {
    // In a real app, this would initiate Apple OAuth
    console.log("Apple OAuth would be initiated here");
    onAuthMethodSelect("thirdParty");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">مرحبا بك في منصة لاد</h1>
          <p className="text-n-7">انشئ حسابك الآن</p>
        </div>
        <div className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-3 flex flex-col items-center justify-center ">
            <GoogleAuthButton handleGoogleSignUp={handleGoogleSignUp} />

            <AppleAuthButton handleAppleSignUp={handleAppleSignUp} />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                أو
              </span>
            </div>
          </div>

          {/* Email and Phone Options */}
          <Button
            variant={"outline"}
            className="w-full !py-6"
            onClick={() => onAuthMethodSelect("phone")}
          >
            <Phone className="w-6 h-6 text-i-8" />
            الإستمرار باستخدام رقم الهاتف
          </Button>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                أو
              </span>
            </div>
          </div>

          <Button
            variant={"outline"}
            className="w-full !py-6"
            onClick={() => onAuthMethodSelect("email")}
          >
            <MailIcon className="w-6 h-6 text-i-8" />
            الاستمرار باستخدام البريد الألكتروني
          </Button>

          {/* Terms and Privacy */}
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to the{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
