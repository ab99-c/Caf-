/**
 * Moroccan VAT helpers. Menu prices are TTC (VAT included), amounts are integer MAD.
 * Standard rate for cafe/restaurant consumption: 10%.
 */
export const DEFAULT_VAT_RATE = 10;

export type VatBreakdown = {
  subtotalHt: number;
  vatRate: number;
  vatMad: number;
  totalTtc: number;
};

export function breakdownFromTtc(totalTtc: number, vatRate: number = DEFAULT_VAT_RATE): VatBreakdown {
  if (!Number.isInteger(totalTtc) || totalTtc < 0) throw new Error("totalTtc must be a non-negative integer");
  if (vatRate < 0 || vatRate > 100) throw new Error("Invalid VAT rate");
  const subtotalHt = Math.round(totalTtc / (1 + vatRate / 100));
  return { subtotalHt, vatRate, vatMad: totalTtc - subtotalHt, totalTtc };
}

export function formatInvoiceNumber(year: number, number: number): string {
  return `${year}-${String(number).padStart(6, "0")}`;
}
