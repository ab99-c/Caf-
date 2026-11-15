import { CommerceService, OrderItemDTO } from "../services/commerce/commerceService";
import { PaymentService, PaymentMethodType } from "../services/payments/paymentService";
import { TaxService } from "../services/tax/taxService";
import { AiOrchestrator, AiAuditResult } from "../services/ai/aiOrchestrator";

export interface OrderSagaInput {
  cafeId: string;
  cafeIce: string;
  userId: string;
  items: OrderItemDTO[];
  paymentMethod: PaymentMethodType;
}

export interface OrderSagaOutput {
  success: boolean;
  orderId: string;
  paymentReference: string;
  invoiceNumber: number;
  aiAudit: AiAuditResult;
  status: "COMPLETED" | "FLAGGED_FOR_HUMAN_REVIEW" | "COMPENSATED";
}

/**
 * Order Orchestrator - Saga Pattern
 * Aligned with Blueprint Microservices Layer 4
 */
export class OrderSagaOrchestrator {
  static async execute(input: OrderSagaInput): Promise<OrderSagaOutput> {
    // 1. Commerce Service: Create Order
    const order = CommerceService.createOrderPayload({
      cafeId: input.cafeId,
      userId: input.userId,
      items: input.items,
    });

    // 2. Payment Service: Settle / Authorize
    const payment = await PaymentService.processPayment({
      orderId: order.id,
      amountMad: order.totalMad,
      method: input.paymentMethod,
      cafeId: input.cafeId,
    });

    // 3. Tax Service: Generate VAT 10% breakdown
    const invoiceNum = Math.floor(1000 + Math.random() * 9000);
    const breakdown = TaxService.calculateBreakdown(order.totalMad, 10);
    await TaxService.issueInvoice({
      cafeId: input.cafeId,
      orderId: order.id,
      totalTtc: order.totalMad,
      cafeIce: input.cafeIce,
      year: new Date().getFullYear(),
      number: invoiceNum,
    });

    // 4. AI & Agents Layer: LangGraph Audit & Fraud Evaluation
    const aiAudit = await AiOrchestrator.evaluateTransaction({
      orderId: order.id,
      cafeId: input.cafeId,
      cafeIce: input.cafeIce,
      amountMad: order.totalMad,
      subtotalHt: breakdown.subtotalHt,
      vatMad: breakdown.vatMad,
      items: input.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.unitMad })),
    });

    const status = aiAudit.requiresHumanReview ? "FLAGGED_FOR_HUMAN_REVIEW" : "COMPLETED";

    return {
      success: true,
      orderId: order.id,
      paymentReference: payment.reference,
      invoiceNumber: invoiceNum,
      aiAudit,
      status,
    };
  }
}
