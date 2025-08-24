// utils/passwordStrength.ts
export type PasswordStrength = {
  text: "Weak" | "Medium" | "Strong" | "Very Strong";
  color: "text-green-500" | "text-yellow-500" | "text-red-500";
};

export function GetPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  // Length points
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Variety of characters
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&.,;:<>^{}[\]()/\\#'"~_+=|-]/.test(password)) score++;

  // Map score to strength
  if (score <= 2) return { text: "Weak", color: "text-red-500" };
  if (score <= 4) return { text: "Medium", color: "text-yellow-500" };
  if (score <= 6) return { text: "Strong", color: "text-green-500" };
  return { text: "Very Strong", color: "text-green-500" };
}
