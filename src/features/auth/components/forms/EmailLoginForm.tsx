import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailLoginSchema, EmailLoginInfo } from '@auth/utils/validation';
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

interface EmailLoginFormProps {
  onSubmit: (data: EmailLoginInfo) => void;
  isLoading?: boolean;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<EmailLoginInfo>({
    resolver: zodResolver(EmailLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="me@example.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login with Email"}
        </Button>
      </form>
    </Form>
  );
};

export default EmailLoginForm;


