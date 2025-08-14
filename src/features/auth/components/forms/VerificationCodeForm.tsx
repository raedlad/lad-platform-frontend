'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Input } from "@shared/components/ui/input";
import { useSignUpStore } from "@auth/store/signupStore";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function VerificationCodeForm() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { 
    authMethod, 
    emailSignUpData, 
    phoneSignUpData, 
    setVerificationCode, 
    setIsVerified 
  } = useSignUpStore();
  
  const router = useRouter();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Start resend cooldown
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && value) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would verify the code with the backend
      console.log('Verifying code:', verificationCode);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate verification (in real app, this would be based on server response)
      if (verificationCode === '123456') {
        setVerificationCode(verificationCode);
        setIsVerified(true);
        router.push('/signup/success');
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendCooldown(60); // 60 second cooldown
    setError('');
    
    try {
      // In a real app, this would resend the verification code
      const contact = authMethod === 'email' 
        ? emailSignUpData?.email 
        : phoneSignUpData?.phoneNumber;
      
      console.log(`Resending verification code to ${contact}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Resend error:', error);
      setError('Failed to resend code. Please try again.');
    }
  };

  const getContactInfo = () => {
    if (authMethod === 'email') {
      return emailSignUpData?.email || 'your email';
    }
    return phoneSignUpData?.phoneNumber || 'your phone number';
  };

  const getContactType = () => {
    return authMethod === 'email' ? 'email' : 'SMS';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">Step 2 of 2</div>
          </div>
          <CardTitle className="text-2xl font-bold">Enter verification code</CardTitle>
          <CardDescription>
            We sent a 6-digit code to {getContactInfo()} via {getContactType()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verification Code Inputs */}
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={() => handleVerify(code.join(''))}
            className="w-full"
            disabled={isLoading || code.some(digit => digit === '')}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="text-sm"
            >
              {resendCooldown > 0 
                ? `Resend code in ${resendCooldown}s` 
                : 'Resend code'
              }
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-center text-muted-foreground">
            For demo purposes, use code: <strong>123456</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

