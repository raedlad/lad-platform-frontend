"use client";

import { Button } from "@shared/components/ui/button";
import { Phone, MailIcon } from "lucide-react";
import GoogleAuthButton from "@auth/components/common/GoogleAuthButton";
import AppleAuthButton from "@auth/components/common/AppleAuthButton";
import { useTranslations } from "next-intl";
import { useGoogleAuth } from "@/features/auth/hooks";

interface AuthMethodSelectionProps {
  onAuthMethodSelect: (method: "email" | "phone" | "thirdParty") => void;
}

export default function AuthMethodSelection({
  onAuthMethodSelect,
}: AuthMethodSelectionProps) {
  const t = useTranslations("auth");
  const { signInWithGoogle } = useGoogleAuth();

  const handleGoogleSignUp = () => {
    signInWithGoogle();
    onAuthMethodSelect("thirdParty");
  };

  const handleAppleSignUp = () => {
    // In a real app, this would initiate Apple OAuth
    console.log("Apple OAuth would be initiated here");
    onAuthMethodSelect("thirdParty");
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full  flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-n-7">{t("subtitle")}</p>
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
                {t("roleSelection.or")}
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
            {t("authMethod.phone")}
          </Button>
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("roleSelection.or")}
              </span>
            </div>
          </div>

          <Button
            variant={"outline"}
            className="w-full !py-6"
            onClick={() => onAuthMethodSelect("email")}
          >
            <MailIcon className="w-6 h-6 text-i-8" />
            {t("authMethod.email")}
          </Button>

          {/* Terms and Privacy */}
          <p className="text-xs text-center text-n-6">
            {t("terms.text")}{" "}
            <a href="#" className="underline text-p-7 hover:text-p-5">
              {t("terms.termsLink")}
            </a>{" "}
            {t("terms.and")}{" "}
            <a href="#" className="underline text-p-7 hover:text-p-5">
              {t("terms.privacyLink")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
