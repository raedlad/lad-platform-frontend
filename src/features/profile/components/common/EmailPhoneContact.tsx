"use client";

import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Mail, Phone } from "lucide-react";
import { PhoneInput } from "@/features/auth/components/phone-input/PhoneInput";
import { cn } from "@/lib/utils";

export interface ContactData {
  email: string;
  phone: string;
}

interface EmailPhoneContactProps {
  data: ContactData;
  onDataChange: (data: ContactData) => void;
  className?: string;
}

export const EmailPhoneContact: React.FC<EmailPhoneContactProps> = ({
  data,
  onDataChange,
  className,
}) => {

  const handleInputChange = (field: keyof ContactData, value: string) =>
    onDataChange({ ...data, [field]: value });

  const handlePhoneChange = (value: string | undefined) =>
    onDataChange({ ...data, phone: value || "" });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Email Section */}
      <div className="form-field-group">
        <div className="flex items-center">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
        </div>
        <div className="flex flex-col gap-3">
          <div className="relative flex w-full items-center">
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
            />
            <Mail className="absolute end-1 text-muted-foreground/50 p-1" />
          </div>
        </div>
      </div>

      {/* Phone Section */}
      <div className="form-field-group">
        <div className="flex items-center justify-between">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
        </div>
        <div className="flex flex-col gap-3">
          <div className="relative flex w-full items-center">
            <PhoneInput
              value={data.phone}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
            />
            <Phone className="absolute end-1 text-muted-foreground/50 p-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPhoneContact;
