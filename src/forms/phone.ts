export function phoneError(value: string): string {
  const text = value.trim();
  if (!text) return 'Please enter your phone number.';
  if (!/^[6-9]\d{9}$/.test(text)) {
    return 'Enter exactly 10 digits starting with 6, 7, 8 or 9, without a country code.';
  }
  if (/^(\d)\1+$/.test(text)) {
    return 'Please enter a valid phone number; repeated digits are not accepted.';
  }
  return '';
}
