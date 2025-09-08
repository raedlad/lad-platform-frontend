/**
 * Calculate password strength as a percentage (0-100)
 * @param password - The password to evaluate
 * @returns A number between 0-100 representing password strength
 */
export function getPasswordStrength(password: string): number {
  if (!password) return 0;

  let score = 0;
  const checks = {
    length: password.length >= 8,
    longLength: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    veryLong: password.length >= 16,
    noCommon: !isCommonPassword(password),
  };

  // Base requirements (60% of total score)
  if (checks.length) score += 15;
  if (checks.lowercase) score += 15;
  if (checks.uppercase) score += 15;
  if (checks.number) score += 15;

  // Bonus points (40% of total score)
  if (checks.special) score += 10;
  if (checks.longLength) score += 10;
  if (checks.veryLong) score += 10;
  if (checks.noCommon) score += 10;

  return Math.min(score, 100);
}

/**
 * Check if password is in common password list
 * @param password - The password to check
 * @returns true if password is NOT common (good), false if it IS common (bad)
 */
function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    'password',
    '123456',
    '12345678',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Get password strength text description
 * @param strength - Password strength score (0-100)
 * @param t - Translation function from useTranslations
 */
export function getPasswordStrengthText(strength: number, t?: (key: string) => string): string {
  if (!t) {
    // Fallback to English if no translation function provided
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  }

  if (strength < 30) return t("auth.newPassword.strength.weak");
  if (strength < 60) return t("auth.newPassword.strength.fair");
  if (strength < 80) return t("auth.newPassword.strength.good");
  return t("auth.newPassword.strength.strong");
}

/**
 * Get password strength color class
 */
export function getPasswordStrengthColor(strength: number): string {
  if (strength < 30) return "text-red-500";
  if (strength < 60) return "text-yellow-500";
  if (strength < 80) return "text-blue-500";
  return "text-green-500";
}