const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

/**
 * Converts any Arabic digits found in a number or string into Khmer numerals.
 * Non-digit characters (dashes, spaces, etc.) are left untouched.
 */
export function toKhmerNumeral(value: number | string): string {
  return String(value)
    .split('')
    .map((char) => (/\d/.test(char) ? KHMER_DIGITS[Number(char)] : char))
    .join('');
}