/**
 * Utility functions for Biteship Integration
 */

export function isDummyCourier(paymentType: string | null | undefined): boolean {
  if (!paymentType) return false;
  const lower = paymentType.toLowerCase();
  return lower.includes("simulasi") || lower.includes("dummy");
}
