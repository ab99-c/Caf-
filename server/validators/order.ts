import { z } from "zod";

export const createOrderSchema = z.object({
  cafeId: z.string().min(1),
  deliveryAddress: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(50),
  })).min(1).max(100),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
