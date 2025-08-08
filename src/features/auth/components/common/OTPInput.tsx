"use client";

import React, { useRef, useEffect } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  className = "",
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Only allow digits
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split("");
    newValue[index] = digit;
    const newOTP = newValue.join("");

    onChange(newOTP);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === "Backspace") {
      if (value[index]) {
        // Clear current input
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        // Move to previous input
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    const digits = pastedData.slice(0, length).split("");

    if (digits.length > 0) {
      const newValue = value.split("");
      digits.forEach((digit, index) => {
        if (index < length) {
          newValue[index] = digit;
        }
      });
      onChange(newValue.join(""));

      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
            ${
              disabled
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-gray-300 text-gray-900 hover:border-gray-400"
            }
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;
