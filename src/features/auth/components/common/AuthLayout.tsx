import React from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  showBackground?: boolean;
}

/**
 * AuthLayout provides consistent styling and structure for authentication pages
 */
export default function AuthLayout({
  children,
  className,
  centered = true,
  showBackground = true,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        showBackground && "bg-gray-50",
        centered &&
          "flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8",
        !centered && "py-12 px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className={cn("w-full", centered && "max-w-md")}>{children}</div>
    </div>
  );
}

/**
 * AuthCard provides consistent card styling for auth forms
 */
interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export function AuthCard({
  children,
  className,
  elevated = true,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border p-6 sm:p-8",
        elevated &&
          "shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50",
        !elevated && "border-gray-200 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * AuthHeader provides consistent header styling for auth forms
 */
interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export function AuthHeader({
  title,
  subtitle,
  icon,
  centered = true,
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn("mb-6", centered && "text-center", className)}>
      {icon && (
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4",
            "bg-primary/10",
            centered && "mx-auto"
          )}
        >
          {icon}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-base text-gray-600">{subtitle}</p>}
    </div>
  );
}

/**
 * AuthFooter provides consistent footer styling for auth forms
 */
interface AuthFooterProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function AuthFooter({
  children,
  className,
  centered = true,
}: AuthFooterProps) {
  return (
    <div className={cn("mt-6", centered && "text-center", className)}>
      {children}
    </div>
  );
}

/**
 * AuthDivider provides consistent divider styling for auth forms
 */
interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({ text = "or", className }: AuthDividerProps) {
  return (
    <div className={cn("relative my-6", className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}

/**
 * AuthErrorMessage provides consistent error message styling
 */
interface AuthErrorMessageProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AuthErrorMessage({
  message,
  icon,
  className,
}: AuthErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg",
        className
      )}
    >
      {icon && <div className="flex-shrink-0 text-red-600 mt-0.5">{icon}</div>}
      <div className="text-sm text-red-800">{message}</div>
    </div>
  );
}

/**
 * AuthSuccessMessage provides consistent success message styling
 */
interface AuthSuccessMessageProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export function AuthSuccessMessage({
  message,
  icon,
  className,
}: AuthSuccessMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 border border-green-200 bg-green-50 rounded-lg",
        className
      )}
    >
      {icon && (
        <div className="flex-shrink-0 text-green-600 mt-0.5">{icon}</div>
      )}
      <div className="text-sm text-green-800">{message}</div>
    </div>
  );
}

/**
 * AuthInfoBox provides consistent info box styling
 */
interface AuthInfoBoxProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function AuthInfoBox({
  title,
  children,
  icon,
  className,
}: AuthInfoBoxProps) {
  return (
    <div
      className={cn(
        "bg-blue-50 border border-blue-200 rounded-lg p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 text-blue-600 mt-0.5">{icon}</div>
        )}
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * AuthLink provides consistent link styling for auth forms
 */
interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function AuthLink({
  href,
  children,
  variant = "primary",
  className,
}: AuthLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "transition-colors",
        variant === "primary" &&
          "text-primary hover:text-primary/80 font-medium",
        variant === "secondary" && "text-gray-600 hover:text-gray-900",
        className
      )}
    >
      {children}
    </a>
  );
}
