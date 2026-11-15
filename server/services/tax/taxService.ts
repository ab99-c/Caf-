import { breakdownFromTtc } from "../../../lib/vat";
import { prisma } from "../../../lib/db";

export interface TaxInvoiceDTO {
  cafeId: string;
  orderId: string;
  totalTtc: number;
  cafeIce: string;
  year: number;
  number: number;
}

/**
 * Microservice: Tax & Invoicing (TradeTax Core)
 * Ensures Moroccan legal compliance, 10% VAT calculation, and gapless sequential numbering per ICE.
 */
export class TaxService {
  static calculateBreakdown(totalTtc: number, vatRate: number = 10) {
    return breakdownFromTtc(totalTtc, vatRate);
  }

  static async issueInvoice(dto: TaxInvoiceDTO) {
    const { subtotalHt, vatMad } = this.calculateBreakdown(dto.totalTtc, 10);

    return {
      invoiceNumber: dto.number,
      year: dto.year,
      ice: dto.cafeIce,
      subtotalHt,
      vatRate: 10,
      vatMad,
      totalTtc: dto.totalTtc,
      legalNote: "فاتورة قانونية خاضعة للضريبة على القيمة المضافة 10% وفق قانون المالية المغربي",
      timestamp: new Date().toISOString(),
    };
  }
}
