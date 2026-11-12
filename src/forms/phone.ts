export function phoneError(value: string): string {
  const text = value.trim();
  if (!text) return 'Please enter your phone number.';
  if (!/^\+?[\d\s().-]+$/.test(text)) return 'Use digits only, with an optional +country code.';
  const digits = text.replace(/\D/g, '');
  const indian = !text.startsWith('+') || text.startsWith('+91');
  const national = text.startsWith('+91') ? digits.slice(2) : digits;
  if (indian && !/^[6-9]\d{9}$/.test(national)) {
    return 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9. You can include +91.';
  }
  if (!indian && !/^[1-9]\d{7,14}$/.test(digits)) {
    return 'Enter a valid international number with +country code and 8–15 digits.';
  }
  if (/^(\d)\1+$/.test(national) || /(\d)\1{9}$/.test(digits)) {
    return 'Please enter a valid phone number; repeated digits are not accepted.';
  }
  return '';
}
