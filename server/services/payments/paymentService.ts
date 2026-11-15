export type PaymentMethodType = "CASH" | "CARD" | "ONLINE";

export interface ProcessPaymentDTO {
  orderId: string;
  amountMad: number;
  method: PaymentMethodType;
  cafeId: string;
}

/**
 * Microservice: Payments Service
 * Handles Cash Register & CMI Card reconciliation.
 */
export class PaymentService {
  static async processPayment(dto: ProcessPaymentDTO) {
    const reference = `PAY-${dto.method.slice(0, 2)}-${Date.now().toString().slice(-6)}`;

    return {
      success: true,
      reference,
      amountMad: dto.amountMad,
      method: dto.method,
      status: "SETTLED",
      processedAt: new Date().toISOString(),
    };
  }
}
