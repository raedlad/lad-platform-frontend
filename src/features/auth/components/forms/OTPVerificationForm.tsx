import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OTPVerificationSchema, OTPVerificationInfo } from '@auth/utils/validation';
import { Input } from '@shared/components/ui/input';
import { Button } from '@shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";

interface OTPVerificationFormProps {
  onSubmit: (data: OTPVerificationInfo) => void;
  onResendCode: () => void;
  isLoading?: boolean;
  contactInfo: string; // Email or phone number for display
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ onSubmit, onResendCode, isLoading, contactInfo }) => {
  const form = useForm<OTPVerificationInfo>({
    resolver: zodResolver(OTPVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">
          Please enter the 6-digit code sent to {contactInfo}.
        </p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input type="text" placeholder="XXXXXX" {...field} disabled={isLoading} maxLength={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
        <Button type="button" variant="link" className="w-full" onClick={onResendCode} disabled={isLoading}>
          Resend Code
        </Button>
      </form>
    </Form>
  );
};

export default OTPVerificationForm;


