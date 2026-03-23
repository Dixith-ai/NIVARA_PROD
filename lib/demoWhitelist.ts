/**
 * Whitelist of email addresses with unlimited demo access
 */
export const UNLIMITED_DEMO_EMAILS = [
  'nivara.dermat@gmail.com',
  '31dixithadithya@gmail.com',
  'chetu8172@gmail.com',
  'karthikmanuhs25@gmail.com',
  'patel9871pratham@gmail.com',
];

/**
 * Check if an email has unlimited demo access
 */
export function hasUnlimitedDemoAccess(email: string | null): boolean {
  if (!email) return false;
  return UNLIMITED_DEMO_EMAILS.includes(email.toLowerCase());
}
