"use client";
import { useTranslations } from "next-intl";
import React from "react";
import Image from "next/image";
import { assets } from "@/constants/assets";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "md", showText = true }) => {
  const t = useTranslations("Header");

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <div className={`flex items-center ${gapClasses[size]}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src={assets.logo}
          alt="LAD Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span
          className={`${textSizeClasses[size]} font-bold text-gray-900 dark:text-white`}
        >
          {t("logo")}
        </span>
      )}
    </div>
  );
};

export default Logo;
