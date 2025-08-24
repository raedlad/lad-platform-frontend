"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  className?: string
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className,
}: OTPInputProps) {
  return (
    <InputOTP
    autoFocus={true}
      maxLength={length}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
    >
      <InputOTPGroup>
        {Array.from({ length }).map((_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
